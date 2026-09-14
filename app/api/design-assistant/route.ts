import { NextResponse } from "next/server";

function cleanApiKey(raw: string | undefined): string {
  if (!raw) return "";
  let key = raw.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }
  if (/^GEMINI_API_KEY\s*[:=]\s*/i.test(key)) {
    key = key.replace(/^GEMINI_API_KEY\s*[:=]\s*/i, "").trim();
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
      key = key.slice(1, -1).trim();
    }
  }
  return key;
}

export async function POST(req: Request) {
  try {
    const { prompt, currentPalette, currentTypography, currentMood } = await req.json();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Please provide a valid design description." },
        { status: 400 }
      );
    }

    const apiKey = cleanApiKey(process.env.GEMINI_API_KEY);
    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY environment variable.");
      return NextResponse.json(
        { error: "Unable to generate the design direction right now. Please try again." },
        { status: 500 }
      );
    }

    const systemPrompt = `You are PAIMA Atelier's Senior Architectural Design Director.
Analyze the user's interior architecture vision: "${prompt.trim()}".
Current Active Context: Palette=${currentPalette || "PAIMA Original"}, Typography=${currentTypography || "Editorial Serif"}, Mood=${currentMood || "Minimal"}.

Select the most appropriate matching design tokens from the available options:
1. Palette ID options: ["paima-original", "ivory-editorial", "warm-earth", "soft-blush", "stone-bronze", "monochrome", "midnight-luxury"]
2. Typography ID options: ["editorial-serif", "modern-luxury", "architectural-minimal", "contemporary-classic"]
3. Mood ID options: ["minimal", "warm", "contemporary", "sophisticated", "dramatic"]

Respond ONLY with a valid, clean JSON object matching this exact schema:
{
  "suggestedPaletteId": "one of the palette IDs",
  "suggestedTypographyId": "one of the typography IDs",
  "suggestedMoodId": "one of the mood IDs",
  "title": "Short Bespoke Architectural Title (3-6 words)",
  "conceptSummary": "2-3 sentences of elevated architectural rationale describing the residence concept.",
  "materialMood": "3-4 primary high-end interior materials (e.g., Hone-finished Travertine, Patinated Bronze, Smoked Oak)",
  "lightingCharacter": "1-2 sentences on natural and artificial light direction.",
  "furnitureDirection": "1-2 sentences on spatial proportions and custom millwork/furniture.",
  "atmosphere": "1 sentence on overall sensory feeling."
}`;

    const candidateModels = [
      "gemini-3.5-flash-lite",
      "gemini-3.5-flash",
      "gemini-2.5-flash",
      "gemini-3.6-flash",
      "gemini-flash-latest"
    ];

    let aiTextResult: any = null;

    for (const model of candidateModels) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7,
                maxOutputTokens: 1000,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            aiTextResult = JSON.parse(rawText);
            break;
          }
        }
      } catch (err) {
        console.warn(`Model ${model} failed, trying next candidate...`, err);
      }
    }

    if (!aiTextResult) {
      return NextResponse.json(
        { error: "Unable to generate the design direction right now. Please try again." },
        { status: 500 }
      );
    }

    // Generate real AI architectural visual URL for the user's prompt
    const cleanPrompt = prompt.trim().replace(/[^a-zA-Z0-9\s]/g, "");
    const seed = Math.floor(Math.random() * 900000) + 100000;
    const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      `PAIMA luxury architectural interior design, ${cleanPrompt}, high-end editorial photography, 8k resolution, architectural digest style`
    )}?width=1200&height=800&nologo=true&seed=${seed}`;

    return NextResponse.json({
      success: true,
      data: {
        ...aiTextResult,
        imageUrl: aiImageUrl,
        userPrompt: prompt.trim(),
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in design-assistant route:", error);
    return NextResponse.json(
      { error: "Unable to generate the design direction right now. Please try again." },
      { status: 500 }
    );
  }
}
