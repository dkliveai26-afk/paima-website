import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getKnowledgeBaseContext } from "@/lib/db-knowledge";

export const runtime = "nodejs";
export const maxDuration = 30;

function cleanApiKey(raw: string | undefined): string {
  if (!raw) return "";
  let key = raw.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }
  if (/^OPENAI_API_KEY\s*[:=]\s*/i.test(key)) {
    key = key.replace(/^OPENAI_API_KEY\s*[:=]\s*/i, "").trim();
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
      key = key.slice(1, -1).trim();
    }
  }
  return key;
}

// Module-level singleton client to reuse open TLS connection pool
let cachedOpenAI: OpenAI | null = null;
let lastApiKey: string | null = null;

function getOpenAIClient(): OpenAI | null {
  const apiKey = cleanApiKey(process.env.OPENAI_API_KEY);
  if (!apiKey) return null;
  if (!cachedOpenAI || lastApiKey !== apiKey) {
    cachedOpenAI = new OpenAI({ apiKey });
    lastApiKey = apiKey;
  }
  return cachedOpenAI;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const openai = getOpenAIClient();

    if (!openai) {
      console.error("Missing OPENAI_API_KEY environment variable.");
      return NextResponse.json(
        { error: "Configuration error. AI services are currently unavailable." },
        { status: 500 }
      );
    }

    // Fast cached context retrieval (<0.01ms on cache hit)
    const systemContext = await getKnowledgeBaseContext();

    // Preserve the last 12 messages for full multi-turn conversation memory while preventing unbounded token prefill
    const formattedMessages = Array.isArray(messages)
      ? messages.slice(-12).map((m: any) => {
          let text = "";
          if (typeof m.content === "string") {
            text = m.content;
          } else if (Array.isArray(m.parts)) {
            text = m.parts
              .filter((p: any) => p.type === "text")
              .map((p: any) => p.text)
              .join("\n");
          }
          return {
            role: m.role === "assistant" ? "assistant" : "user",
            content: text,
          };
        })
      : [];

    const responseStream = await openai.responses.create({
      model: "gpt-5.6-luna",
      instructions: systemContext,
      input: formattedMessages as any,
      stream: true,
    });

    const encoder = new TextEncoder();

    const customStream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode(`data: {"type":"start"}\n\n`));
        controller.enqueue(encoder.encode(`data: {"type":"start-step"}\n\n`));
        controller.enqueue(encoder.encode(`data: {"type":"text-start","id":"0"}\n\n`));

        try {
          for await (const chunk of responseStream) {
            if (chunk.type === "response.output_text.delta" && chunk.delta) {
              controller.enqueue(
                encoder.encode(`data: {"type":"text-delta","id":"0","delta":${JSON.stringify(chunk.delta)}}\n\n`)
              );
            }
          }

          controller.enqueue(encoder.encode(`data: {"type":"text-end","id":"0"}\n\n`));
          controller.enqueue(encoder.encode(`data: {"type":"finish-step"}\n\n`));
          controller.enqueue(encoder.encode(`data: {"type":"finish"}\n\n`));
          controller.close();
        } catch (streamErr) {
          console.error("Stream reading error:", streamErr);
          controller.error(streamErr);
        }
      },
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: any) {
    console.error("Error in AI chat route handler:", error);
    return NextResponse.json(
      { error: error?.message || String(error) || "PAIMA Concierge is currently unavailable." },
      { status: 500 }
    );
  }
}



