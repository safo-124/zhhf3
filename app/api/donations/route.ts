import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      include: {
        user: { select: { name: true, email: true } },
        campaign: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, campaignId, userId, isMonthly, paymentMethod } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid donation amount" },
        { status: 400 }
      );
    }

    const donation = await prisma.donation.create({
      data: {
        amount,
        currency: currency || "GHS",
        status: "COMPLETED",
        paymentMethod: paymentMethod || "card",
        isMonthly: isMonthly || false,
        ...(campaignId && { campaign: { connect: { id: campaignId } } }),
        ...(userId && { user: { connect: { id: userId } } }),
      },
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error("Error creating donation:", error);
    return NextResponse.json(
      { error: "Failed to create donation" },
      { status: 500 }
    );
  }
}
