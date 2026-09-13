import { NextResponse } from "next/server";
import { getDesigns } from "@/lib/db-designs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const roomType = searchParams.get("roomType") || undefined;
    const palette = searchParams.get("palette") || undefined;
    const style = searchParams.get("style") || undefined;
    const sortBy = searchParams.get("sortBy") || undefined;

    const designs = await getDesigns({ roomType, palette, sortBy });
    return NextResponse.json({ success: true, count: designs.length, data: designs });
  } catch (error) {
    console.error("Error fetching designs:", error);
    return NextResponse.json(
      { error: "Failed to load design catalog." },
      { status: 500 }
    );
  }
}
