"use client";

import logo from "@/public/logo.png";
import Image from "next/image";
import {
  FaMoon,
  FaPaperPlane,
  FaSignOutAlt,
  FaSun,
  FaDownload,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getBotReply } from "@/lib/chatBot";
import LoadingDots from "../components/LoadingDots";

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Chat() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const fetchMessages = async (userId: string) => {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
    return data;
  };

  useEffect(() => {
    setMounted(true);
    const checkAuthAndLoadMessages = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      // Fetch existing messages
      const chatHistory = await fetchMessages(session.user.id);

      // Convert chat history to Message format
      const formattedMessages: Message[] = chatHistory.map((chat) => ({
        content: chat.message,
        isUser: chat.role === "user",
        timestamp: new Date(chat.created_at),
      }));

      setMessages(formattedMessages);

      // Hide suggestions if there are existing messages
      if (formattedMessages.length > 0) {
        setShowSuggestions(false);
      }
    };

    checkAuthAndLoadMessages();
  }, [router]);

  const saveMessage = async (
    userId: string,
    role: "user" | "bot",
    message: string
  ) => {
    const { error } = await supabase
      .from("chats")
      .insert([{ user_id: userId, role, message }]);
    if (error) {
      console.error("Error saving message:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setShowSuggestions(false);

    const userMessage: Message = {
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Get the current user's ID
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // Save user message
      if (userId) {
        await saveMessage(userId, "user", inputMessage);
      }

      const botReply = await getBotReply(inputMessage);
      const botMessage: Message = {
        content: botReply,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      // Save bot message
      if (userId) {
        await saveMessage(userId, "bot", botReply);
      }
    } catch (error) {
      console.error("Error getting bot reply:", error);
      const errorMessage: Message = {
        content: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const exportChat = () => {
    // Create a formatted string of the chat
    const chatText = messages
      .map((msg) => {
        const timestamp = msg.timestamp.toLocaleString();
        const sender = msg.isUser ? "You" : "ZeroCode";
        return `[${timestamp}] ${sender}: ${msg.content}`;
      })
      .join("\n\n");

    // Create a blob with the chat text
    const blob = new Blob([chatText], { type: "text/plain" });

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zerocode-chat-${new Date().toISOString().split("T")[0]}.txt`;

    // Trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleLogout = async () => {
    try {
      // First check if there's an active session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // No active session, just redirect to home
        console.log("No active session found, redirecting to home");
        setMessages([]);
        setInputMessage("");
        router.push("/");
        return;
      }

      // If there is a session, try to sign out
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        // Even if signOut fails, we should still redirect
        setMessages([]);
        setInputMessage("");
        router.push("/");
        return;
      }

      // Clear any local state
      setMessages([]);
      setInputMessage("");

      // Clear any stored session data from localStorage as fallback
      if (typeof window !== "undefined") {
        localStorage.removeItem("supabase.auth.token");
        localStorage.removeItem(
          "sb-" +
            process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(
              "."
            )[0] +
            "-auth-token"
        );
      }

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, try to redirect and clear local data
      setMessages([]);
      setInputMessage("");

      // Clear localStorage as fallback
      if (typeof window !== "undefined") {
        localStorage.removeItem("supabase.auth.token");
        localStorage.removeItem(
          "sb-" +
            process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(
              "."
            )[0] +
            "-auth-token"
        );
      }

      router.push("/");
    }
  };

  return (
    <>
      <div className="absolute top-0 right-0 z-10 p-2 flex flex-row gap-2 w-full shadow-lg justify-between items-center px-4">
        <div className="text-xl font-bold text-[#2E3440] dark:text-[#ECEFF4]">
          ZeroCode
        </div>
        <div className="flex flex-row-reverse gap-2">
          <button
            onClick={handleLogout}
            className="bg-[#ECEFF4] dark:bg-[#5E81AC] text-[#2E3440] dark:text-[#ECEFF4] p-4 rounded-md flex items-center gap-2 z-10 hover:bg-[#81A1C1] transition-colors hover:scale-105 duration-300"
            title="Logout"
          >
            <FaSignOutAlt />
          </button>
          <button
            onClick={exportChat}
            className="bg-[#ECEFF4] dark:bg-[#5E81AC] text-[#2E3440] dark:text-[#ECEFF4] p-4 rounded-md flex items-center gap-2 z-10 hover:bg-[#81A1C1] transition-colors hover:scale-105 duration-300"
            title="Export Chat"
          >
            <FaDownload />
          </button>
          <button className="text-[#2E3440] dark:text-[#ECEFF4] p-4 rounded-md flex items-center gap-2 z-10 cursor-pointer transition-colors hover:scale-105 duration-300">
            {isDarkMode ? (
              <FaSun className="w-4 h-4" />
            ) : (
              <FaMoon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center h-screen gap-4 bg-[#ECEFF4] dark:bg-[#2E3440] p-8 shadow-[0_0_17px_rgba(0,0,0,1)] relative">
        <div
          className={`flex flex-col items-center justify-center gap-2 pt-32 transition-all duration-500 ${
            showSuggestions
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <Image
            src={logo}
            alt="logo"
            width={40}
            height={40}
            className="dark:invert"
          />
          <h1 className="text-xl font-bold text-[#2E3440] dark:text-[#ECEFF4]">
            Ask ZeroCode anything!
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 w-full absolute bottom-10 px-4 animate-fade-in-up animate-delay-400 lg:w-[70%] xl:w-[50%]">
          <div
            className={`text-start w-full relative bottom-10 transition-all duration-500 ${
              showSuggestions
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <p className="text-sm text-[#2E3440] dark:text-[#ECEFF4] font-semibold">
              Suggestions, questions, or just say hi!
            </p>
            <div className="flex flex-row items-center gap-2 w-full mt-5">
              <button
                onClick={() => setInputMessage("Hi!")}
                className="text-[13px] border border-dotted bg-[#D8DEE9] dark:bg-[#3b42519f] border-[#2E3440] dark:border-[#D8DEE9] rounded-4xl px-4 py-2 text-[#2E3440] dark:text-[#D8DEE9] hover:bg-[#E5E9F0] dark:hover:bg-[#3B4252] cursor-pointer transition-colors"
              >
                Hi!
              </button>
              <button
                onClick={() => setInputMessage("How can I get started?")}
                className="text-[13px] border border-dotted bg-[#D8DEE9] dark:bg-[#3b42519f] border-[#2E3440] dark:border-[#D8DEE9] rounded-4xl px-4 py-2 text-[#2E3440] dark:text-[#D8DEE9] hover:bg-[#E5E9F0] dark:hover:bg-[#3B4252] cursor-pointer transition-colors"
              >
                How can I get started?
              </button>
              <button
                onClick={() => setInputMessage("What can you do?")}
                className="text-[13px] border border-dotted bg-[#D8DEE9] dark:bg-[#3b42519f] border-[#2E3440] dark:border-[#D8DEE9] rounded-4xl px-4 py-2 text-[#2E3440] dark:text-[#D8DEE9] hover:bg-[#E5E9F0] dark:hover:bg-[#3B4252] cursor-pointer transition-colors"
              >
                What can you do?
              </button>
            </div>
          </div>
          <div
            className="w-full max-h-[82vh] overflow-x-hidden mb-4 
            scrollbar-thin 
            scrollbar-thumb-[#5E81AC]/30 
            scrollbar-track-transparent
            hover:scrollbar-thumb-[#5E81AC]/50
            scrollbar-thin
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-[#5E81AC]/30
            [&::-webkit-scrollbar-thumb]:hover:bg-[#5E81AC]/50
            [&::-webkit-scrollbar]:hover:w-2
            transition-all duration-300
            pr-4"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.isUser ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg text-[13px] ${
                    message.isUser
                      ? "bg-[#5E81AC] text-[#ECEFF4] max-w-[90%]"
                      : "bg-[#D8DEE9] dark:bg-[#3B4252] text-[#2E3440] dark:text-[#D8DEE9] max-w-[90%]"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-lg bg-[#D8DEE9] dark:bg-[#3B4252] text-[#2E3440] dark:text-[#D8DEE9] text-[13px]">
                  <LoadingDots />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-row items-center justify-center gap-2 w-full">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask ZeroCode anything"
              className="w-full p-2 rounded-md border border-[#2E3440] dark:border-[#D8DEE9] outline-none bg-[#D8DEE9] dark:bg-[#3B4252] text-[#2E3440] dark:text-[#D8DEE9] placeholder-[#4C566A]"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-[#5E81AC] text-[#ECEFF4] p-5 rounded-md h-10 flex items-center justify-center hover:bg-[#81A1C1] transition-colors hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
