"use server";

import { createBooking, type CreateBookingInput } from "@/lib/booking";
import { getService, categoryName, serviceName } from "@/lib/data/catalogue";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { sendEmail } from "@/lib/email";

export interface SubmitBookingResult {
  ok: boolean;
  ref?: string;
  error?: "invalid" | "conflict";
}

export async function submitBooking(input: CreateBookingInput): Promise<SubmitBookingResult> {
  const result = await createBooking(input);
  if (!result.ok) return { ok: false, error: result.error };

  const service = getService(input.serviceId);
  const t = getDictionary(input.lang as Lang);
  const svcLabel = service ? serviceName(service, input.lang as Lang) : input.serviceId;
  const catLabel = categoryName(input.categoryId, input.lang as Lang);
  const dateLabel = input.date;

  if (input.email.includes("@")) {
    sendEmail({
      to: input.email,
      subject: t.thanksTitle,
      text: t.thanks(svcLabel, dateLabel, input.time),
    }).catch((e) => console.error("booking confirmation email failed", e));
  }

  const salonEmail = process.env.SALON_NOTIFICATION_EMAIL || "hello@saganbeauty.ch";
  sendEmail({
    to: salonEmail,
    subject: `New booking request ${result.ref} — ${input.name}`,
    text: [
      `Ref: ${result.ref}`,
      `Client: ${input.name}`,
      `Phone: ${input.phone}`,
      `Email: ${input.email}`,
      `Category: ${catLabel}`,
      `Service: ${svcLabel}`,
      `Date: ${dateLabel}`,
      `Time: ${input.time}`,
      input.notes ? `Notes: ${input.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  }).catch((e) => console.error("salon notification email failed", e));

  return { ok: true, ref: result.ref };
}
