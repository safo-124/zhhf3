import nodemailer from "nodemailer";

// For development/demo: use a console logger if no SMTP is configured
const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER;

const transporter = hasSmtp
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export async function sendVerificationEmail(
  email: string,
  code: string,
  name?: string | null
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 30px; background: #f9fafb; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 12px; background: linear-gradient(135deg, #059669, #0d9488); border-radius: 12px;">
          <span style="color: white; font-size: 24px; font-weight: bold;">ZHHF</span>
        </div>
      </div>
      <div style="background: white; padding: 32px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h2 style="color: #111827; margin: 0 0 8px 0; font-size: 20px;">Your Verification Code</h2>
        <p style="color: #6b7280; margin: 0 0 24px 0; font-size: 14px;">
          Hi${name ? ` ${name}` : ""}, use this code to sign in to your ZHHF account:
        </p>
        <div style="text-align: center; padding: 20px; background: #f0fdf4; border: 2px dashed #059669; border-radius: 12px; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #059669;">${code}</span>
        </div>
        <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
          This code expires in 10 minutes. If you didn't request this, please ignore this email.
        </p>
      </div>
      <p style="color: #9ca3af; font-size: 11px; text-align: center; margin-top: 16px;">
        Zion Helping Hand Foundation
      </p>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || '"ZHHF" <noreply@zhhf.org>',
        to: email,
        subject: `${code} - Your ZHHF Verification Code`,
        html,
      });
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  } else {
    // Development fallback: log to console
    console.log("\n========================================");
    console.log(`📧 VERIFICATION CODE for ${email}`);
    console.log(`🔑 CODE: ${code}`);
    console.log("========================================\n");
    return true;
  }
}
