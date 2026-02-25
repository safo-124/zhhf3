import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.homepageSetting.findMany({
      where: {
        key: { startsWith: "about_" },
      },
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching about settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch about settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { settings } = body as { settings: { key: string; value: string }[] };

    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Upsert each setting
    for (const setting of settings) {
      if (!setting.key.startsWith("about_")) continue;
      await prisma.homepageSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value },
      });
    }

    const updated = await prisma.homepageSetting.findMany({
      where: { key: { startsWith: "about_" } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error saving about settings:", error);
    return NextResponse.json(
      { error: "Failed to save about settings" },
      { status: 500 }
    );
  }
}
