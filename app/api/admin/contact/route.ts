import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const CONTACT_KEYS = [
  "contact_address_line1",
  "contact_address_line2",
  "contact_phone1",
  "contact_phone2",
  "contact_email1",
  "contact_email2",
  "contact_hours_line1",
  "contact_hours_line2",
  "contact_facebook",
  "contact_twitter",
  "contact_instagram",
  "contact_linkedin",
  "contact_map_label",
  "contact_map_sublabel",
  "contact_hq_name",
  "contact_hq_address",
];

export async function GET() {
  try {
    const settings = await prisma.homepageSetting.findMany({
      where: { key: { in: CONTACT_KEYS } },
    });
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return NextResponse.json(map);
  } catch (error) {
    console.error("Error fetching contact settings:", error);
    return NextResponse.json({});
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    for (const [key, value] of Object.entries(body)) {
      if (CONTACT_KEYS.includes(key)) {
        await prisma.homepageSetting.upsert({
          where: { key },
          update: { value: (value as string) || "" },
          create: { key, value: (value as string) || "" },
        });
      }
    }

    return NextResponse.json({ message: "Contact settings updated" });
  } catch (error) {
    console.error("Error updating contact settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
