import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT to update a hero image
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const image = await prisma.heroImage.update({
      where: { id: parseInt(id) },
      data: body,
    });
    return NextResponse.json(image);
  } catch (error) {
    console.error("Error updating hero image:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE a hero image
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.heroImage.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting hero image:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
