import { NextResponse } from "next/server";
import { likeDesign } from "@/lib/db-designs";

export async function POST(req: Request) {
  try {
    const { designId, sessionToken } = await req.json();

    if (!designId || typeof designId !== "string") {
      return NextResponse.json({ error: "Missing design ID." }, { status: 400 });
    }

    const token = sessionToken || "anonymous_session";
    const result = await likeDesign(designId, token);

    return NextResponse.json({
      success: true,
      likes: result.likes,
      alreadyLiked: result.alreadyLiked,
    });
  } catch (error) {
    console.error("Error in like API:", error);
    return NextResponse.json(
      { error: "Could not record like." },
      { status: 500 }
    );
  }
}
