import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

const gradientMap: Record<string, string> = {
  Community: "from-emerald-500 to-teal-500",
  Health: "from-blue-500 to-cyan-500",
  Education: "from-violet-500 to-purple-500",
  Fundraising: "from-rose-500 to-pink-500",
  Outreach: "from-amber-500 to-orange-500",
};

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user registrations and all upcoming events in parallel
    const [registrations, allEvents] = await Promise.all([
      prisma.eventRegistration.findMany({
        where: { userId: session.userId },
        include: {
          event: {
            select: {
              id: true,
              title: true,
              description: true,
              date: true,
              endDate: true,
              time: true,
              location: true,
              category: true,
              image: true,
              capacity: true,
            },
          },
        },
        orderBy: { event: { date: "desc" } },
      }),
      prisma.event.findMany({
        where: { date: { gte: new Date() } },
        include: { _count: { select: { registrations: true } } },
        orderBy: { date: "asc" },
      }),
    ]);

    const now = new Date();
    const registeredEventIds = new Set(registrations.map((r) => r.event.id));

    // My registered events
    const myEvents = registrations.map((r) => {
      const eventDate = new Date(r.event.date);
      const status: "Upcoming" | "Attended" = eventDate >= now ? "Upcoming" : "Attended";

      return {
        id: r.event.id,
        registrationId: r.id,
        title: r.event.title,
        date: r.event.date,
        endDate: r.event.endDate,
        time: r.event.time,
        location: r.event.location,
        category: r.event.category,
        status,
        gradient: gradientMap[r.event.category] || "from-emerald-500 to-teal-500",
      };
    });

    // Available events the user has NOT registered for
    const availableEvents = allEvents
      .filter((e) => !registeredEventIds.has(e.id))
      .map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        date: e.date,
        endDate: e.endDate,
        time: e.time,
        location: e.location,
        category: e.category,
        image: e.image,
        capacity: e.capacity,
        registered: e._count.registrations,
        spotsLeft: e.capacity ? Math.max(0, e.capacity - e._count.registrations) : null,
        gradient: gradientMap[e.category] || "from-emerald-500 to-teal-500",
      }));

    const upcoming = myEvents.filter((e) => e.status === "Upcoming");
    const past = myEvents.filter((e) => e.status !== "Upcoming");

    return NextResponse.json({
      events: myEvents,
      availableEvents,
      stats: {
        total: myEvents.length,
        upcoming: upcoming.length,
        attended: past.length,
      },
    });
  } catch (error) {
    console.error("Portal events error:", error);
    return NextResponse.json(
      { error: "Failed to load events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await request.json();
    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    // Check the event exists and has capacity
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
      include: { _count: { select: { registrations: true } } },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.capacity && event._count.registrations >= event.capacity) {
      return NextResponse.json({ error: "This event is fully booked" }, { status: 400 });
    }

    // Check if already registered
    const existing = await prisma.eventRegistration.findUnique({
      where: { userId_eventId: { userId: session.userId, eventId: parseInt(eventId) } },
    });

    if (existing) {
      return NextResponse.json({ error: "You are already registered for this event" }, { status: 400 });
    }

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        user: { connect: { id: session.userId } },
        event: { connect: { id: parseInt(eventId) } },
      },
    });

    return NextResponse.json({
      success: true,
      registration: { id: registration.id, eventId: event.id, title: event.title },
    });
  } catch (error) {
    console.error("Portal event registration error:", error);
    return NextResponse.json(
      { error: "Failed to register for event" },
      { status: 500 }
    );
  }
}
