import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [settings, heroImages] = await Promise.all([
      prisma.homepageSetting.findMany(),
      prisma.heroImage.findMany({
        where: { active: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    return NextResponse.json({ settings: settingsMap, heroImages });
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return NextResponse.json({ settings: {}, heroImages: [] });
  }
}
