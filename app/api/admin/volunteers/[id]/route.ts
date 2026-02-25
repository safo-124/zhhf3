import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOTP } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const status = body.status as string;

    // Get the application first
    const application = await prisma.volunteerApplication.findUnique({
      where: { id: parseInt(id) },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    let accountCreated = false;
    let userId: number | null = application.userId;

    // If approving, create a user account for the volunteer (if one doesn't exist)
    if (status.toUpperCase() === "APPROVED" && !application.userId) {
      // Check if a user with this email already exists
      let user = await prisma.user.findUnique({
        where: { email: application.email },
      });

      if (!user) {
        // Create new user account
        user = await prisma.user.create({
          data: {
            email: application.email,
            name: application.name,
            phone: application.phone,
            role: "member",
          },
        });
        accountCreated = true;
      }

      userId = user.id;

      // Send OTP code so they can log in
      const code = generateOTP();
      await prisma.verificationCode.updateMany({
        where: { email: application.email, used: false },
        data: { used: true },
      });
      await prisma.verificationCode.create({
        data: {
          code,
          email: application.email,
          userId: user.id,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });
      await sendVerificationEmail(application.email, code, application.name);
    }

    // Update the application status and link user if created
    const updated = await prisma.volunteerApplication.update({
      where: { id: parseInt(id) },
      data: {
        status,
        ...(userId ? { userId } : {}),
      },
    });

    return NextResponse.json({
      ...updated,
      accountCreated,
      message: accountCreated
        ? `Approved! Account created for ${application.email} — a login code has been sent.`
        : status.toUpperCase() === "APPROVED"
        ? `Approved! ${application.email} already has an account.`
        : undefined,
    });
  } catch (error) {
    console.error("Failed to update volunteer application:", error);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.volunteerApplication.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete volunteer application:", error);
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    );
  }
}
