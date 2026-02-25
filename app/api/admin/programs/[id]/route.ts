import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      slug,
      shortDescription,
      longDescription,
      image,
      icon,
      color,
      emoji,
      features,
      impacts,
      active,
      sortOrder,
    } = body;

    // If slug changed, check uniqueness
    if (slug) {
      const existing = await prisma.program.findUnique({ where: { slug } });
      if (existing && existing.id !== parseInt(id)) {
        return NextResponse.json(
          { error: "A program with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const program = await prisma.program.update({
      where: { id: parseInt(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(longDescription !== undefined && { longDescription }),
        ...(image !== undefined && { image: image || null }),
        ...(icon !== undefined && { icon }),
        ...(color !== undefined && { color }),
        ...(emoji !== undefined && { emoji }),
        ...(features !== undefined && { features: features ? JSON.stringify(features) : null }),
        ...(impacts !== undefined && { impacts: impacts ? JSON.stringify(impacts) : null }),
        ...(active !== undefined && { active }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json(program);
  } catch (error) {
    console.error("Error updating program:", error);
    return NextResponse.json({ error: "Failed to update program" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.program.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ message: "Program deleted" });
  } catch (error) {
    console.error("Error deleting program:", error);
    return NextResponse.json({ error: "Failed to delete program" }, { status: 500 });
  }
}
