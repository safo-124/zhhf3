import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "desc" },
      include: { _count: { select: { registrations: true } } },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, date, endDate, time, location, capacity, category, featured, image } = body;

    if (!title || !date || !location) {
      return NextResponse.json({ error: "Title, date, and location are required" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || "",
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        time: time || null,
        location,
        capacity: capacity ? parseInt(capacity) : null,
        category: category || "Community",
        featured: featured || false,
        image: image || null,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
