import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";
import { NextResponse } from "next/server";
import { getKnowledgeBaseContext } from "@/lib/db-knowledge";

function cleanApiKey(raw: string | undefined): string {
  if (!raw) return "";
  let key = raw.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }
  if (/^(OPENAI_API_KEY|GEMINI_API_KEY)\s*[:=]\s*/i.test(key)) {
    key = key.replace(/^(OPENAI_API_KEY|GEMINI_API_KEY)\s*[:=]\s*/i, "").trim();
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
      key = key.slice(1, -1).trim();
    }
  }
  return key;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const openaiKey = cleanApiKey(process.env.OPENAI_API_KEY);
    const geminiKey = cleanApiKey(process.env.GEMINI_API_KEY);

    if (!openaiKey && !geminiKey) {
      console.error("Missing AI API key environment variable (OPENAI_API_KEY or GEMINI_API_KEY).");
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

    let result: any = null;

    // 1. Try OpenAI if configured
    if (openaiKey) {
      try {
        const openai = createOpenAI({ apiKey: openaiKey });
        const stream = streamText({
          model: openai("gpt-4o-mini"),
          system: systemContext,
          messages: modelMessages,
          maxOutputTokens: 800,
          temperature: 0.7,
        });
        result = stream;
      } catch (openAiErr) {
        console.warn("OpenAI stream initialization failed, falling back to Gemini:", openAiErr);
        result = null;
      }
    }

    // 2. Fall back to Gemini if OpenAI is unavailable
    if (!result && geminiKey) {
      const google = createGoogleGenerativeAI({ apiKey: geminiKey });
      result = streamText({
        model: google("gemini-3.6-flash"),
        system: systemContext,
        messages: modelMessages,
        maxOutputTokens: 800,
        temperature: 0.7,
      });
    }

    if (!result) {
      throw new Error("All configured AI providers are currently unavailable.");
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
      { error: error?.message || String(error) || "PAIMA Concierge is currently unavailable." },
      { status: 500 }
    );
  }
}

