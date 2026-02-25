import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const members = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { donations: true, eventRegistrations: true } },
      },
    });

    const membersWithStats = members.map((m) => ({
      ...m,
      donationCount: m._count.donations,
      eventCount: m._count.eventRegistrations,
    }));

    return NextResponse.json(membersWithStats);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, role, address } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const member = await prisma.user.create({
      data: {
        name: name || "",
        email,
        phone: phone || null,
        role: role || "member",
        address: address || null,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
