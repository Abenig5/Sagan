// Server-side availability rules — see README "Availability Rules".
//
//   regularSlots(date) = hours[weekday].open
//       ? every slotMinutes from `from` while start <= `to` − lastBeforeCloseMinutes
//       : []
//   daySlots(date)     = date is inside any Closure ? [] : regularSlots(date)
//   isFree(date, t)    = t ∈ daySlots(date)
//                        && no active booking at (date, t)
//                        && (date, t) not in BlockedSlot
//                        && (date, t) is in the future (Europe/Zurich)
//   bookable date      = today ≤ date ≤ today + bookingWindowWeeks*7 && any isFree

import { addDays, toHM, toMin, todayIso, weekdayIndex, type HM, type Iso } from "./dates";
import type { HoursDay } from "./data/defaults";

export interface AvailabilityConfig {
  hours: HoursDay[]; // index 0 = Sunday
  slotMinutes: number;
  lastBeforeCloseMinutes: number;
  bookingWindowWeeks: number;
}

export interface ClosureRange {
  from: Iso;
  to: Iso;
  note?: string | null;
}

export function regularSlots(date: Iso, cfg: AvailabilityConfig): HM[] {
  const h = cfg.hours[weekdayIndex(date)];
  if (!h.open) return [];
  const out: HM[] = [];
  const end = toMin(h.to) - cfg.lastBeforeCloseMinutes;
  for (let m = toMin(h.from); m <= end; m += cfg.slotMinutes) out.push(toHM(m));
  return out;
}

export function closureCovering(date: Iso, closures: ClosureRange[]): ClosureRange | undefined {
  return closures.find((c) => date >= c.from && date <= c.to);
}

export function daySlots(date: Iso, cfg: AvailabilityConfig, closures: ClosureRange[]): HM[] {
  if (closureCovering(date, closures)) return [];
  return regularSlots(date, cfg);
}

export function isPast(date: Iso, time: HM, now: Date = new Date()): boolean {
  const today = todayIso();
  if (date < today) return true;
  if (date > today) return false;
  return toMin(time) <= now.getHours() * 60 + now.getMinutes();
}

export function maxBookableDate(cfg: AvailabilityConfig): Iso {
  return addDays(todayIso(), cfg.bookingWindowWeeks * 7);
}

export function isDateInWindow(date: Iso, cfg: AvailabilityConfig): boolean {
  const today = todayIso();
  return date >= today && date <= maxBookableDate(cfg);
}

/**
 * Free times for a date, given the slots already taken by active bookings and
 * admin-blocked slots. Does not itself query the database — callers fetch
 * bookings/blocks and pass them in, so this stays pure and testable.
 */
export function freeTimesFor(
  date: Iso,
  cfg: AvailabilityConfig,
  closures: ClosureRange[],
  takenTimes: Set<HM>,
  blockedTimes: Set<HM>,
  now: Date = new Date()
): HM[] {
  return daySlots(date, cfg, closures).filter(
    (t) => !takenTimes.has(t) && !blockedTimes.has(t) && !isPast(date, t, now)
  );
}

export function isFree(
  date: Iso,
  time: HM,
  cfg: AvailabilityConfig,
  closures: ClosureRange[],
  takenTimes: Set<HM>,
  blockedTimes: Set<HM>,
  now: Date = new Date()
): boolean {
  if (!daySlots(date, cfg, closures).includes(time)) return false;
  if (takenTimes.has(time)) return false;
  if (blockedTimes.has(time)) return false;
  if (isPast(date, time, now)) return false;
  return true;
}
