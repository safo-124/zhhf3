import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, userId, name, email } = body;

    if (!eventId || !email) {
      return NextResponse.json(
        { error: "Event ID and email are required" },
        { status: 400 }
      );
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        event: { connect: { id: eventId } },
        ...(userId && { user: { connect: { id: userId } } }),
        name: name || "",
        email,
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error("Error registering for event:", error);
    return NextResponse.json(
      { error: "Failed to register for event" },
      { status: 500 }
    );
  }
}
