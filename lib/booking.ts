import { prisma } from "./prisma";
import { getSettings, type SalonSettings } from "./settings";
import { listClosures } from "./closures";
import {
  closureCovering,
  daySlots,
  freeTimesFor,
  isFree,
  isPast,
  type ClosureRange,
} from "./availability";
import { getService } from "./data/catalogue";
import type { CategoryId } from "./data/catalogue";
import type { Iso, HM } from "./dates";

export type SlotState = "open" | "booked" | "unavailable";

async function activeBookingTimes(date: Iso): Promise<Set<HM>> {
  const rows = await prisma.booking.findMany({
    where: { date, status: { not: "declined" } },
    select: { time: true },
  });
  return new Set(rows.map((r) => r.time));
}

async function blockedTimes(date: Iso): Promise<Set<HM>> {
  const rows = await prisma.blockedSlot.findMany({ where: { date }, select: { time: true } });
  return new Set(rows.map((r) => r.time));
}

export async function dayAvailability(date: Iso) {
  const [settings, closures, taken, blocked] = await Promise.all([
    getSettings(),
    listClosures(),
    activeBookingTimes(date),
    blockedTimes(date),
  ]);
  const closed = !!closureCovering(date, closures as ClosureRange[]);
  const slots = daySlots(date, settings, closures as ClosureRange[]);
  const times = slots.map((time) => {
    let state: SlotState = "open";
    if (taken.has(time)) state = "booked";
    else if (blocked.has(time) || isPast(date, time)) state = "unavailable";
    return { time, state };
  });
  return { closed, times };
}

export async function monthAvailability(firstOfMonth: Iso) {
  const settings = await getSettings();
  const closures = (await listClosures()) as ClosureRange[];
  const [y, m] = firstOfMonth.split("-").map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();

  const dates: Iso[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    dates.push(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  }

  const [bookings, blocks] = await Promise.all([
    prisma.booking.findMany({
      where: { date: { in: dates }, status: { not: "declined" } },
      select: { date: true, time: true },
    }),
    prisma.blockedSlot.findMany({ where: { date: { in: dates } }, select: { date: true, time: true } }),
  ]);

  const takenByDate = new Map<Iso, Set<HM>>();
  for (const b of bookings) {
    if (!takenByDate.has(b.date)) takenByDate.set(b.date, new Set());
    takenByDate.get(b.date)!.add(b.time);
  }
  const blockedByDate = new Map<Iso, Set<HM>>();
  for (const b of blocks) {
    if (!blockedByDate.has(b.date)) blockedByDate.set(b.date, new Set());
    blockedByDate.get(b.date)!.add(b.time);
  }

  const days: Record<Iso, { freeCount: number; closed: boolean; hasRegularSlots: boolean }> = {};
  for (const date of dates) {
    const closed = !!closureCovering(date, closures);
    const reg = daySlots(date, settings, closures);
    const free = freeTimesFor(
      date,
      settings,
      closures,
      takenByDate.get(date) ?? new Set(),
      blockedByDate.get(date) ?? new Set()
    );
    days[date] = { freeCount: free.length, closed, hasRegularSlots: reg.length > 0 };
  }

  return { days, settings };
}

export interface CreateBookingInput {
  categoryId: CategoryId;
  serviceId: string;
  hairLength: number | null;
  date: Iso;
  time: HM;
  name: string;
  phone: string;
  email: string;
  notes: string;
  lang: "en" | "de";
}

export type CreateBookingResult =
  | { ok: true; ref: string }
  | { ok: false; error: "invalid" | "conflict" };

export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  const service = getService(input.serviceId);
  if (!service || service.categoryId !== input.categoryId) return { ok: false, error: "invalid" };
  if (service.pricing.kind === "length" && (input.hairLength === null || input.hairLength === undefined)) {
    return { ok: false, error: "invalid" };
  }
  if (input.name.trim().length < 2) return { ok: false, error: "invalid" };
  if (input.phone.trim().length < 6 && !input.email.includes("@")) return { ok: false, error: "invalid" };

  const settings = await getSettings();
  const closures = (await listClosures()) as ClosureRange[];

  return prisma.$transaction(async (tx) => {
    const [activeRows, blockedRows] = await Promise.all([
      tx.booking.findMany({ where: { date: input.date, status: { not: "declined" } }, select: { time: true } }),
      tx.blockedSlot.findMany({ where: { date: input.date }, select: { time: true } }),
    ]);
    const taken = new Set(activeRows.map((r) => r.time));
    const blocked = new Set(blockedRows.map((r) => r.time));

    if (!isFree(input.date, input.time, settings, closures, taken, blocked)) {
      return { ok: false, error: "conflict" } as const;
    }

    const last = await tx.booking.findFirst({ orderBy: { createdAt: "desc" }, select: { ref: true } });
    const lastNum = last ? Number(last.ref.replace("SB-", "")) || 1040 : 1040;
    const ref = `SB-${lastNum + 1}`;

    await tx.booking.create({
      data: {
        ref,
        categoryId: input.categoryId,
        serviceId: input.serviceId,
        hairLength: input.hairLength,
        date: input.date,
        time: input.time,
        name: input.name.trim(),
        phone: input.phone.trim(),
        email: input.email.trim(),
        notes: input.notes.trim() || null,
        lang: input.lang,
        status: "pending",
      },
    });

    return { ok: true, ref } as const;
  });
}
