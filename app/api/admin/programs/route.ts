import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(programs);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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

    if (!title || !slug || !shortDescription || !longDescription) {
      return NextResponse.json(
        { error: "Title, slug, short description, and long description are required" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.program.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "A program with this slug already exists" }, { status: 409 });
    }

    const program = await prisma.program.create({
      data: {
        title,
        slug,
        shortDescription,
        longDescription,
        image: image || null,
        icon: icon || "Heart",
        color: color || "from-emerald-500 to-teal-600",
        emoji: emoji || "🌟",
        features: features ? JSON.stringify(features) : null,
        impacts: impacts ? JSON.stringify(impacts) : null,
        active: active ?? true,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json({ error: "Failed to create program" }, { status: 500 });
  }
}
