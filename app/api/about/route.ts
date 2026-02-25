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
