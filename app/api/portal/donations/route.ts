import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, campaignId, isMonthly, paymentMethod } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Create the donation linked to the logged-in user
    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        currency: "GHS",
        status: "completed",
        isMonthly: !!isMonthly,
        paymentMethod: paymentMethod || "mobile_money",
        user: { connect: { id: session.userId } },
        ...(campaignId ? { campaign: { connect: { id: parseInt(campaignId) } } } : {}),
      },
      include: { campaign: { select: { title: true } } },
    });

    // If the donation is linked to a campaign, update the raised amount
    if (campaignId) {
      await prisma.campaign.update({
        where: { id: parseInt(campaignId) },
        data: { raised: { increment: parseFloat(amount) } },
      });
    }

    return NextResponse.json({
      success: true,
      donation: {
        id: donation.id,
        amount: donation.amount,
        currency: donation.currency,
        campaign: donation.campaign?.title || "General Donation",
        status: donation.status,
      },
    });
  } catch (error) {
    console.error("Portal donation create error:", error);
    return NextResponse.json(
      { error: "Failed to process donation" },
      { status: 500 }
    );
  }
}

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
        currency: "GHS",
        campaign: d.campaign?.title || "General Donation",
        paymentMethod: d.paymentMethod || "card",
        status: d.status,
        type: d.isMonthly ? "Monthly" : "One-time",
      })),
      summary: {
        totalDonated,
        totalTransactions: donations.length,
        monthlyAmount: monthlyTotal,
        currency: "GHS",
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
