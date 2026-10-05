import type { Dictionary, Lang } from "./i18n/dictionaries";
import type { HoursDay } from "./data/defaults";
import { addDays, parseIso, todayIso, type Iso } from "./dates";

export interface HoursRow {
  label: string;
  value: string;
}

export interface ClosureLike {
  from: Iso;
  to: Iso;
  note?: string | null;
}

/** Groups Mon→Sun opening hours into consecutive same-value rows, then appends
 * upcoming closures (next 90 days) — ported from the prototype's `renderVals`. */
export function buildHoursDisplay(
  hours: HoursDay[],
  closures: ClosureLike[],
  t: Dictionary,
  lang: Lang
): HoursRow[] {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const groups: { start: number; end: number; v: string }[] = [];
  for (const i of order) {
    const h = hours[i];
    const v = h.open ? `${h.from} – ${h.to}` : t.closedL;
    const last = groups[groups.length - 1];
    if (last && last.v === v) last.end = i;
    else groups.push({ start: i, end: i, v });
  }
  const rows: HoursRow[] = groups.map((g) => ({
    label: g.start === g.end ? t.daysLong[g.start] : `${t.daysLong[g.start]} – ${t.daysLong[g.end]}`,
    value: g.v,
  }));

  const L = lang === "de" ? 1 : 0;
  const today = todayIso();
  const short = (x: Iso) => {
    const dt = parseIso(x);
    return `${dt.getDate()}${L ? ". " : " "}${t.months[dt.getMonth()]}`;
  };
  closures
    .filter((c) => c.to >= today && c.from <= addDays(today, 90))
    .forEach((c) => {
      rows.push({
        label: t.closedOn + (c.note ? ` · ${c.note}` : ""),
        value: c.from === c.to ? short(c.from) : `${short(c.from)} – ${short(c.to)}`,
      });
    });

  return rows;
}
