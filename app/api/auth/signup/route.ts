import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOTP } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

// POST /api/auth/signup — Create new member account + send OTP
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name.trim(),
        phone: phone?.trim() || null,
        role: "member",
      },
    });

    // Generate and send OTP
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationCode.create({
      data: {
        code,
        email: normalizedEmail,
        userId: user.id,
        expiresAt,
      },
    });

    await sendVerificationEmail(normalizedEmail, code, user.name);

    return NextResponse.json({
      success: true,
      message: "Account created! Verification code sent to your email.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
