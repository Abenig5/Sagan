// Date helpers that work on YYYY-MM-DD strings in the salon's local time
// (Europe/Zurich). Ported from the prototype's `iso`/`parse`/`addDays`/`toMin` etc.
// The server and the browser are assumed to run in (or be fine treating dates as)
// Europe/Zurich; see README "Availability Rules".

export type Iso = string; // YYYY-MM-DD
export type HM = string; // HH:mm

export function iso(d: Date): Iso {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function parseIso(s: Iso): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(s: Iso, n: number): Iso {
  const d = parseIso(s);
  d.setDate(d.getDate() + n);
  return iso(d);
}

export function todayIso(): Iso {
  return iso(new Date());
}

export function toMin(hm: HM): number {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}

export function toHM(min: number): HM {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

/** Monday of the week containing `s` (ISO weeks, Monday-first). */
export function mondayOf(s: Iso): Iso {
  const dow = parseIso(s).getDay(); // 0 = Sunday
  return addDays(s, -((dow + 6) % 7));
}

export function weekdayIndex(s: Iso): number {
  return parseIso(s).getDay(); // 0 = Sunday .. 6 = Saturday, matches Settings.hours index
}
