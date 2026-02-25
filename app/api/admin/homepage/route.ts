import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all homepage settings + hero images
export async function GET() {
  try {
    const [settings, heroImages] = await Promise.all([
      prisma.homepageSetting.findMany(),
      prisma.heroImage.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    return NextResponse.json({ settings: settingsMap, heroImages });
  } catch (error) {
    console.error("Error fetching homepage settings:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST to upsert settings or add hero images
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "update_settings") {
      const { settings } = body as { settings: Record<string, string>; action: string };
      const ops = Object.entries(settings).map(([key, value]) =>
        prisma.homepageSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      );
      await Promise.all(ops);
      return NextResponse.json({ success: true });
    }

    if (action === "add_hero_image") {
      const { url, alt } = body;
      if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
      }
      const maxOrder = await prisma.heroImage.findFirst({
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      });
      const image = await prisma.heroImage.create({
        data: {
          url,
          alt: alt || "",
          sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
        },
      });
      return NextResponse.json(image, { status: 201 });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating homepage:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
