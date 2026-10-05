"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { getSettings } from "@/lib/settings";
import { listClosures } from "@/lib/closures";
import { daySlots, closureCovering, isPast, type ClosureRange } from "@/lib/availability";
import { revalidatePath } from "next/cache";
import type { Iso, HM } from "@/lib/dates";

async function afterChange() {
  revalidatePath("/admin/availability");
}

export async function toggleBlockedSlot(date: Iso, time: HM) {
  await requireAdmin();
  const existing = await prisma.blockedSlot.findUnique({ where: { date_time: { date, time } } });
  if (existing) {
    await prisma.blockedSlot.delete({ where: { id: existing.id } });
  } else {
    await prisma.blockedSlot.create({ data: { date, time } });
  }
  await afterChange();
}

/** Blocks every currently-open (not booked, not past) slot across the given dates. */
export async function blockAllOpenInRange(dates: Iso[]) {
  await requireAdmin();
  const settings = await getSettings();
  const closures = (await listClosures()) as ClosureRange[];

  const [bookings, blocked] = await Promise.all([
    prisma.booking.findMany({ where: { date: { in: dates }, status: { not: "declined" } }, select: { date: true, time: true } }),
    prisma.blockedSlot.findMany({ where: { date: { in: dates } }, select: { date: true, time: true } }),
  ]);
  const takenKey = new Set(bookings.map((b) => `${b.date}|${b.time}`));
  const blockedKey = new Set(blocked.map((b) => `${b.date}|${b.time}`));

  const toCreate: { date: Iso; time: HM }[] = [];
  for (const date of dates) {
    if (closureCovering(date, closures)) continue;
    for (const time of daySlots(date, settings, closures)) {
      const key = `${date}|${time}`;
      if (takenKey.has(key) || blockedKey.has(key) || isPast(date, time)) continue;
      toCreate.push({ date, time });
    }
  }
  if (toCreate.length) await prisma.blockedSlot.createMany({ data: toCreate });
  await afterChange();
}

export async function openAllBlockedInRange(dates: Iso[]) {
  await requireAdmin();
  await prisma.blockedSlot.deleteMany({ where: { date: { in: dates } } });
  await afterChange();
}

export async function addClosure(from: Iso, to: Iso, note: string) {
  await requireAdmin();
  if (!from || !to || to < from) return;
  await prisma.closure.create({ data: { from, to, note: note.trim() || null } });
  await afterChange();
}

export async function removeClosure(id: string) {
  await requireAdmin();
  await prisma.closure.delete({ where: { id } });
  await afterChange();
}
