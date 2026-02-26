import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const donations = await prisma.donation.findMany({
      where: { userId: session.userId },
      include: { campaign: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    });

    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
    const monthlyDonations = donations.filter((d) => d.isMonthly);
    const monthlyTotal = monthlyDonations.length > 0
      ? monthlyDonations[0].amount
      : 0;

    return NextResponse.json({
      donations: donations.map((d) => ({
        id: d.id,
        date: d.createdAt,
        amount: d.amount,
        currency: d.currency,
        campaign: d.campaign?.title || "General Donation",
        paymentMethod: d.paymentMethod || "card",
        status: d.status,
        type: d.isMonthly ? "Monthly" : "One-time",
      })),
      summary: {
        totalDonated,
        totalTransactions: donations.length,
        monthlyAmount: monthlyTotal,
        currency: donations[0]?.currency || "GHS",
      },
    });
  } catch (error) {
    console.error("Portal donations error:", error);
    return NextResponse.json(
      { error: "Failed to load donations" },
      { status: 500 }
    );
  }
}
