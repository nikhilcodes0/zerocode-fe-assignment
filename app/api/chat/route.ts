import { NextResponse } from "next/server";
import { CohereClient } from "cohere-ai";

// Add error logging
const logError = (error: any) => {
  console.error("Detailed error:", {
    message: error.message,
    status: error.status,
    type: error.type,
    code: error.code,
    stack: error.stack,
  });
};

export async function POST(request: Request) {
  try {
    // Validate API key
    if (!process.env.COHERE_API_KEY) {
      console.error("Cohere API key is missing");
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      );
    }

    // Initialize Cohere client
    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });

    const body = await request.json();
    console.log("Received request:", body);

    if (!body.message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Use the chat endpoint
    const response = await cohere.chat({
      message: body.message,
      model: "command",
      temperature: 0.7,
      maxTokens: 300,
      // Add system prompt
      preamble:
        "You are ZeroCode, a helpful and friendly AI assistant focused on helping with coding and development questions. Keep your responses concise and practical.",
    });

    const reply = response.text;

    if (!reply) {
      throw new Error("No response from Cohere");
    }

    return NextResponse.json({
      reply,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get response" },
      { status: 500 }
    );
  }
}
