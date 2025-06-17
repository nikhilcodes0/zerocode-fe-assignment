const useLLM = true; // Set to true to use OpenAI

// Helper function to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getBotReply = async (message: string): Promise<string> => {
  if (!useLLM) {
    // Add 1.5 second delay for dummy responses
    await delay(1500);
    return getDummyReply(message);
  }

  try {
    console.log("Sending request to API...");
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      // Check for specific Cohere errors
      if (data.error?.includes("rate limit") || data.error?.includes("quota")) {
        console.log("API rate limit reached, falling back to dummy responses");
        return getDummyReply(message);
      }
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    if (!data.reply) {
      throw new Error("No reply received from API");
    }

    return data.reply;
  } catch (error: any) {
    console.error("Error in getBotReply:", error);
    // Fallback to dummy response if API fails
    return getDummyReply(message);
  }
};

// Enhanced dummy responses
const getDummyReply = (message: string): string => {
  const lower = message.toLowerCase();

  if (lower.includes("hi") || lower.includes("hello")) {
    return "Hi! I'm ZeroCode. How can I help you with your coding questions today?";
  }
  if (lower.includes("help")) {
    return "I can help you with coding questions, debugging, and development concepts. What specific topic would you like to learn about?";
  }
  if (lower.includes("bye") || lower.includes("goodbye")) {
    return "Goodbye! Feel free to come back if you have more questions!";
  }
  if (lower.includes("how can i get started")) {
    return "To get started, you can ask me about:\n- Programming languages\n- Development tools\n- Best practices\n- Debugging techniques\nWhat interests you the most?";
  }
  if (lower.includes("what can you do")) {
    return "I can help you with:\n- Code explanations\n- Debugging assistance\n- Development best practices\n- Technical concepts\n- Programming language questions\nWhat would you like to know?";
  }
  if (lower.includes("error") || lower.includes("bug")) {
    return "I can help you debug your code. Could you share the error message or describe the issue you're facing?";
  }
  if (lower.includes("thank")) {
    return "You're welcome! Let me know if you have any other questions!";
  }

  return "I'm here to help with your coding questions. Could you please rephrase your question or ask something specific about programming or development?";
};
