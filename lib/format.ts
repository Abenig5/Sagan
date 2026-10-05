import type { Dictionary, Lang } from "./i18n/dictionaries";
import { parseIso, type Iso } from "./dates";

/** "Tue 6 Oct" / "Di 6. Okt" */
export function dateLabel(date: Iso, t: Dictionary, lang: Lang): string {
  const dt = parseIso(date);
  const L = lang === "de";
  return `${t.days[dt.getDay()]} ${dt.getDate()}${L ? "." : ""} ${t.months[dt.getMonth()]}`;
}

/** "Tuesday, 6 October" / "Dienstag, 6. Oktober" */
export function dateLabelLong(date: Iso, t: Dictionary, lang: Lang): string {
  const dt = parseIso(date);
  const L = lang === "de";
  return `${t.daysLong[dt.getDay()]}, ${dt.getDate()}${L ? "." : ""} ${t.monthsLong[dt.getMonth()]}`;
}
