import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";
import { NextResponse } from "next/server";
import { getKnowledgeBaseContext } from "@/lib/db-knowledge";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY environment variable.");
      return NextResponse.json(
        { error: "Configuration error. AI services are currently unavailable." },
        { status: 500 }
      );
    }

    const systemContext = await getKnowledgeBaseContext();

    const safeMessages = Array.isArray(messages)
      ? messages.map((m: any) => {
          if (Array.isArray(m.parts)) return m;
          const textContent = typeof m.content === "string" ? m.content : "";
          return {
            role: m.role || "user",
            parts: [{ type: "text", text: textContent }],
          };
        })
      : [];

    const modelMessages = await convertToModelMessages(safeMessages);

    // Active supported Google Gemini models
    const candidateModels = [
      "gemini-3.6-flash",
      "gemini-3.5-flash-lite",
      "gemini-flash-latest",
    ];
    let result: any = null;
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        result = streamText({
          model: google(modelName),
          system: systemContext,
          messages: modelMessages,
          maxOutputTokens: 800,
          temperature: 0.7,
        });
        if (result) break;
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} encountered error, trying next...`);
      }
    }

    if (!result) {
      throw lastError || new Error("All AI models unavailable");
    }

    if (typeof (result as any).toUIMessageStreamResponse === "function") {
      return (result as any).toUIMessageStreamResponse();
    } else if (typeof (result as any).toDataStreamResponse === "function") {
      return (result as any).toDataStreamResponse();
    } else {
      return result.toTextStreamResponse();
    }
  } catch (error: any) {
    console.error("Error in AI chat route handler:", error);
    return NextResponse.json(
      { error: "PAIMA Concierge is currently unavailable. Please try again later." },
      { status: 500 }
    );
  }
}




