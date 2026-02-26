import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;

    // Fetch stats in parallel
    const [donations, eventRegistrations, user] = await Promise.all([
      prisma.donation.findMany({
        where: { userId },
        include: { campaign: { select: { title: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.eventRegistration.findMany({
        where: { userId },
        include: {
          event: {
            select: {
              id: true,
              title: true,
              date: true,
              endDate: true,
              time: true,
              location: true,
              category: true,
            },
          },
        },
        orderBy: { event: { date: "asc" } },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { createdAt: true },
      }),
    ]);

    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
    const now = new Date();
    const eventsAttended = eventRegistrations.filter(
      (r) => new Date(r.event.date) < now
    ).length;
    const memberSince = user?.createdAt
      ? new Date(user.createdAt).getFullYear()
      : new Date().getFullYear();

    // Recent donations (last 5)
    const recentDonations = donations.slice(0, 5).map((d) => ({
      id: d.id,
      date: d.createdAt,
      amount: d.amount,
      currency: d.currency,
      campaign: d.campaign?.title || "General Donation",
      status: d.status,
    }));

    // Upcoming events
    const upcomingEvents = eventRegistrations
      .filter((r) => new Date(r.event.date) >= now)
      .slice(0, 5)
      .map((r) => ({
        id: r.event.id,
        title: r.event.title,
        date: r.event.date,
        time: r.event.time,
        location: r.event.location,
      }));

    return NextResponse.json({
      stats: {
        totalDonated,
        eventsAttended,
        totalEvents: eventRegistrations.length,
        memberSince,
        donationCount: donations.length,
      },
      recentDonations,
      upcomingEvents,
    });
  } catch (error) {
    console.error("Portal dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
