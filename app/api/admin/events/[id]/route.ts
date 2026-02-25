import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, date, endDate, time, location, capacity, category, featured, image } = body;

    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(time !== undefined && { time }),
        ...(location !== undefined && { location }),
        ...(capacity !== undefined && { capacity: capacity ? parseInt(capacity) : null }),
        ...(category !== undefined && { category }),
        ...(featured !== undefined && { featured }),
        ...(image !== undefined && { image: image || null }),
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Delete registrations first, then the event
    await prisma.eventRegistration.deleteMany({ where: { eventId: parseInt(id) } });
    await prisma.event.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ message: "Event deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
