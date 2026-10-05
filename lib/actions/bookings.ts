"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { sendEmail } from "@/lib/email";
import { getService, categoryName, serviceName } from "@/lib/data/catalogue";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { revalidatePath } from "next/cache";

export async function setBookingStatus(id: string, status: "pending" | "confirmed" | "declined") {
  await requireAdmin();
  const booking = await prisma.booking.update({
    where: { id },
    data: { status, decidedAt: status === "pending" ? null : new Date() },
  });

  if (status !== "pending" && booking.email.includes("@")) {
    const lang = (booking.lang as Lang) || "de";
    const t = getDictionary(lang);
    const service = getService(booking.serviceId);
    const svcLabel = service ? serviceName(service, lang) : booking.serviceId;
    const catLabel = categoryName(booking.categoryId as any, lang);
    const subject = status === "confirmed" ? t.st.confirmed : t.st.declined;
    sendEmail({
      to: booking.email,
      subject: `${subject} — ${booking.ref}`,
      text: `${catLabel} · ${svcLabel}\n${booking.date} ${booking.time}\n\n${subject}`,
    }).catch((e) => console.error("status email failed", e));
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/availability");
  return booking;
}
