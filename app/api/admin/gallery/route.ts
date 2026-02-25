import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET all gallery images
export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error("Failed to fetch gallery:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

// POST — add a new gallery image
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, caption, category } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const image = await prisma.galleryImage.create({
      data: {
        url,
        caption: caption || null,
        category: category || "General",
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Failed to add gallery image:", error);
    return NextResponse.json({ error: "Failed to add image" }, { status: 500 });
  }
}
