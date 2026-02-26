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
        select: { createdAt: true, name: true },
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

    // Distinct campaigns supported
    const campaignsSupported = new Set(
      donations.filter((d) => d.campaignId).map((d) => d.campaignId)
    ).size;

    // Monthly donation totals (last 6 months)
    const monthlyDonations: { month: string; amount: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      const total = donations
        .filter((don) => {
          const cd = new Date(don.createdAt);
          return (
            cd.getMonth() === d.getMonth() &&
            cd.getFullYear() === d.getFullYear()
          );
        })
        .reduce((s, don) => s + don.amount, 0);
      monthlyDonations.push({ month: label, amount: total });
    }

    // This month vs last month comparison
    const thisMonth = monthlyDonations[5]?.amount || 0;
    const lastMonth = monthlyDonations[4]?.amount || 0;
    const donationTrend =
      lastMonth > 0
        ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
        : thisMonth > 0
          ? 100
          : 0;

    // Largest single donation
    const largestDonation =
      donations.length > 0
        ? Math.max(...donations.map((d) => d.amount))
        : 0;

    // Donation milestone progress (milestones at 500, 1000, 2500, 5000, 10000)
    const milestones = [500, 1000, 2500, 5000, 10000];
    const nextMilestone =
      milestones.find((m) => m > totalDonated) ||
      milestones[milestones.length - 1];
    const milestoneProgress = Math.min(
      (totalDonated / nextMilestone) * 100,
      100
    );

    // Recent donations (last 5)
    const recentDonations = donations.slice(0, 5).map((d) => ({
      id: d.id,
      date: d.createdAt,
      amount: d.amount,
      currency: "GHS",
      campaign: d.campaign?.title || "General Donation",
      status: d.status,
    }));

    // Upcoming events (sorted by nearest)
    const upcomingEvents = eventRegistrations
      .filter((r) => new Date(r.event.date) >= now)
      .slice(0, 5)
      .map((r) => ({
        id: r.event.id,
        title: r.event.title,
        date: r.event.date,
        time: r.event.time,
        location: r.event.location,
        category: r.event.category,
      }));

    // Next upcoming event (for the highlight card)
    const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

    // Recent activity feed (combined donations + event registrations, last 8)
    const activities: {
      id: string;
      type: "donation" | "event";
      title: string;
      description: string;
      date: Date;
      amount?: number;
    }[] = [];

    donations.slice(0, 8).forEach((d) => {
      activities.push({
        id: `d-${d.id}`,
        type: "donation",
        title: `Donated GH₵${d.amount.toLocaleString()}`,
        description: d.campaign?.title || "General Donation",
        date: new Date(d.createdAt),
        amount: d.amount,
      });
    });

    eventRegistrations.slice(0, 8).forEach((r) => {
      activities.push({
        id: `e-${r.id}`,
        type: "event",
        title: `Registered for event`,
        description: r.event.title,
        date: new Date(r.createdAt),
      });
    });

    activities.sort((a, b) => b.date.getTime() - a.date.getTime());
    const recentActivity = activities.slice(0, 8).map((a) => ({
      ...a,
      date: a.date.toISOString(),
    }));

    return NextResponse.json({
      userName: session.name || user?.name || "Member",
      stats: {
        totalDonated,
        eventsAttended,
        totalEvents: eventRegistrations.length,
        memberSince,
        donationCount: donations.length,
        campaignsSupported,
        largestDonation,
        donationTrend,
      },
      milestone: {
        current: totalDonated,
        target: nextMilestone,
        progress: milestoneProgress,
      },
      monthlyDonations,
      nextEvent,
      recentDonations,
      upcomingEvents,
      recentActivity,
    });
  } catch (error) {
    console.error("Portal dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
