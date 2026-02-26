import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const registrations = await prisma.eventRegistration.findMany({
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
          },
        },
      },
      orderBy: { event: { date: "desc" } },
    });

    const now = new Date();

    const events = registrations.map((r) => {
      const eventDate = new Date(r.event.date);
      let status: "Upcoming" | "Attended" = "Attended";
      if (eventDate >= now) status = "Upcoming";

      // Assign gradient based on category
      const gradientMap: Record<string, string> = {
        Community: "from-emerald-500 to-teal-500",
        Health: "from-blue-500 to-cyan-500",
        Education: "from-violet-500 to-purple-500",
        Fundraising: "from-rose-500 to-pink-500",
        Outreach: "from-amber-500 to-orange-500",
      };

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

    const upcoming = events.filter((e) => e.status === "Upcoming");
    const past = events.filter((e) => e.status !== "Upcoming");

    return NextResponse.json({
      events,
      stats: {
        total: events.length,
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
