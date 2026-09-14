import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";
import { NextResponse } from "next/server";
import { getKnowledgeBaseContext } from "@/lib/db-knowledge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY environment variable.");
      return NextResponse.json(
        { error: "Configuration error. AI services are currently unavailable." },
        { status: 500 }
      );
    }

    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

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

    // Active supported Google Gemini model (gemini-3.6-flash)
    const result = streamText({
      model: google("gemini-3.6-flash"),
      system: systemContext,
      messages: modelMessages,
      maxOutputTokens: 800,
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("Error in AI chat route handler:", error);
    return NextResponse.json(
      { error: error?.message || String(error) || "PAIMA Concierge is currently unavailable." },
      { status: 500 }
    );
  }
}




