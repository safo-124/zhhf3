import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// PUT — update a gallery image
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const image = await prisma.galleryImage.update({
      where: { id: parseInt(id) },
      data: body,
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Failed to update gallery image:", error);
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}

// DELETE — remove a gallery image
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.galleryImage.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete gallery image:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
