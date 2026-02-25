import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalMembers,
      donationAgg,
      donationCount,
      activeEvents,
      blogPosts,
      volunteers,
      newsletters,
      recentMembers,
      recentDonations,
      allDonations,
      campaigns,
      campaignsWithDonations,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.donation.aggregate({ _sum: { amount: true } }),
      prisma.donation.count(),
      prisma.event.count({ where: { date: { gte: new Date() } } }),
      prisma.blogPost.count(),
      prisma.volunteerApplication.count(),
      prisma.newsletter.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.donation.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          user: { select: { name: true, email: true } },
          campaign: { select: { title: true } },
        },
      }),
      prisma.donation.findMany({
        orderBy: { createdAt: "asc" },
        select: { amount: true, createdAt: true, isMonthly: true },
      }),
      prisma.campaign.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.campaign.findMany({
        include: { _count: { select: { donations: true } } },
      }),
    ]);

    // Build monthly donation trend (last 12 months)
    const monthlyTrend: { month: string; amount: number; count: number }[] = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      monthlyTrend.push({ month: label, amount: 0, count: 0 });
    }
    for (const don of allDonations) {
      const donDate = new Date(don.createdAt);
      const label = donDate.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      const entry = monthlyTrend.find((m) => m.month === label);
      if (entry) {
        entry.amount += don.amount;
        entry.count += 1;
      }
    }

    // Donation type breakdown
    const oneTime = allDonations.filter((d) => !d.isMonthly);
    const monthly = allDonations.filter((d) => d.isMonthly);
    const donationBreakdown = [
      { name: "One-time", value: oneTime.reduce((s, d) => s + d.amount, 0), count: oneTime.length },
      { name: "Monthly", value: monthly.reduce((s, d) => s + d.amount, 0), count: monthly.length },
    ];

    // Campaign distribution for pie chart
    const campaignDistribution = campaignsWithDonations.map((c) => ({
      name: c.title,
      value: c.raised,
      goal: c.goal,
      donations: c._count.donations,
    }));

    return NextResponse.json({
      totalMembers,
      totalDonations: donationAgg._sum.amount || 0,
      donationCount,
      activeEvents,
      blogPosts,
      volunteers,
      newsletters,
      recentMembers,
      recentDonations: recentDonations.map((d) => ({
        id: d.id,
        amount: d.amount,
        donorName: d.user?.name || "Anonymous",
        donorEmail: d.user?.email || "",
        createdAt: d.createdAt,
        campaign: d.campaign ? { title: d.campaign.title } : null,
      })),
      campaigns: campaigns.map((c) => ({
        id: c.id,
        title: c.title,
        goal: c.goal,
        raised: c.raised,
        isActive: c.active,
      })),
      // Chart data
      monthlyTrend,
      donationBreakdown,
      campaignDistribution,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
