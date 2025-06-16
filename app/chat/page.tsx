"use client";

import logo from "@/public/logo.png";
import Image from "next/image";
import { FaMoon, FaPaperPlane, FaSignOutAlt, FaSun } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Chat() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  

  return (
    <>
      <div className="absolute top-0 right-0 z-10 m-4 flex flex-row-reverse gap-2">
        <button
          onClick={() => {
            supabase.auth.signOut();
            router.push("/");
          }}
          className="bg-[#ECEFF4] dark:bg-[#5E81AC] text-[#2E3440] dark:text-[#ECEFF4] p-4 rounded-md flex items-center gap-2 z-10 hover:bg-[#81A1C1] transition-colors hover:scale-105 duration-300"
        >
          <FaSignOutAlt />
        </button>
        <button
          className="text-[#2E3440] dark:text-[#ECEFF4] p-4 rounded-md flex items-center gap-2 z-10 cursor-pointer transition-colors hover:scale-105 duration-300"
        >
          {isDarkMode ? (
            <FaSun className="w-4 h-4" />
          ) : (
            <FaMoon className="w-4 h-4" />
          )}
        </button>
      </div>
      <div className="flex flex-col items-center h-screen gap-4 bg-[#ECEFF4] dark:bg-[#2E3440] p-8 shadow-[0_0_17px_rgba(0,0,0,1)] relative">
        <div className="flex flex-col items-center justify-center gap-2 pt-32 animate-fade-in-up animate-delay-400">
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

        <div className="flex flex-col items-center justify-center gap-2 w-full absolute bottom-10 px-8 animate-fade-in-up animate-delay-400">
          <div className="text-start w-full relative bottom-10">
            <p className="text-sm text-[#2E3440] dark:text-[#ECEFF4] font-semibold">
              Suggestions, questions, or just say hi!
            </p>
            <div className="flex flex-row items-center gap-2 w-full mt-5">
              <div className="text-[13px] border border-dotted bg-[#D8DEE9] dark:bg-[#3b42519f] border-[#2E3440] dark:border-[#D8DEE9] rounded-4xl px-4 py-2 text-[#2E3440] dark:text-[#D8DEE9] hover:bg-[#E5E9F0] dark:hover:bg-[#3B4252] cursor-pointer transition-colors">
                Hi!
              </div>
              <div className="text-[13px] border border-dotted bg-[#D8DEE9] dark:bg-[#3b42519f] border-[#2E3440] dark:border-[#D8DEE9] rounded-4xl px-4 py-2 text-[#2E3440] dark:text-[#D8DEE9] hover:bg-[#E5E9F0] dark:hover:bg-[#3B4252] cursor-pointer transition-colors">
                How can I get started?
              </div>
              <div className="text-[13px] border border-dotted bg-[#D8DEE9] dark:bg-[#3b42519f] border-[#2E3440] dark:border-[#D8DEE9] rounded-4xl px-4 py-2 text-[#2E3440] dark:text-[#D8DEE9] hover:bg-[#E5E9F0] dark:hover:bg-[#3B4252] cursor-pointer transition-colors">
                What can you do?
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 w-full">
            <input
              type="text"
              placeholder="Ask ZeroCode anything"
              className="w-full max-w-md p-2 rounded-md border border-[#2E3440] dark:border-[#D8DEE9] outline-none bg-[#D8DEE9] dark:bg-[#3B4252] text-[#2E3440] dark:text-[#D8DEE9] placeholder-[#4C566A]"
            />
            <button className="bg-[#5E81AC] text-[#ECEFF4] p-5 rounded-md h-10 flex items-center justify-center hover:bg-[#81A1C1] transition-colors hover:scale-105 duration-300">
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
