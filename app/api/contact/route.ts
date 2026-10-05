import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !message || !email.includes("@")) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const salonEmail = process.env.SALON_NOTIFICATION_EMAIL || "hello@saganbeauty.ch";
  await sendEmail({
    to: salonEmail,
    subject: `Website message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  return NextResponse.json({ ok: true });
}
