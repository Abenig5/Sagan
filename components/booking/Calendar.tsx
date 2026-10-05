"use client";

import { useEffect, useState } from "react";
import type { Dictionary, Lang } from "@/lib/i18n/dictionaries";
import { addDays, iso, parseIso, todayIso, type Iso } from "@/lib/dates";

interface DayInfo {
  freeCount: number;
  closed: boolean;
  hasRegularSlots: boolean;
}

interface MonthResponse {
  days: Record<Iso, DayInfo>;
  settings: { bookingWindowWeeks: number };
}

export default function Calendar({
  lang,
  t,
  selectedDate,
  onSelectDate,
}: {
  lang: Lang;
  t: Dictionary;
  selectedDate: Iso | null;
  onSelectDate: (date: Iso) => void;
}) {
  const curMonth = todayIso().slice(0, 7) + "-01";
  const [calMonth, setCalMonth] = useState<Iso>(selectedDate ? selectedDate.slice(0, 7) + "-01" : curMonth);
  const [data, setData] = useState<MonthResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/availability?month=${calMonth}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setData(d);
      });
    return () => {
      cancelled = true;
    };
  }, [calMonth]);

  const cm = parseIso(calMonth);
  const today = todayIso();
  const maxIso = data ? addDays(today, data.settings.bookingWindowWeeks * 7) : today;
  const offset = (cm.getDay() + 6) % 7;
  const daysInMonth = new Date(cm.getFullYear(), cm.getMonth() + 1, 0).getDate();
  const L = lang === "de" ? 1 : 0;
  const weekHead = [1, 2, 3, 4, 5, 6, 0].map((i) => t.days[i].slice(0, 2).toUpperCase());

  const cells: Array<{
    key: string;
    day: number | null;
    date: Iso | null;
    off: boolean;
    full: boolean;
    selected: boolean;
    isToday: boolean;
  }> = [];
  for (let i = 0; i < offset; i++) cells.push({ key: `pad-${i}`, day: null, date: null, off: true, full: false, selected: false, isToday: false });
  for (let n = 1; n <= daysInMonth; n++) {
    const date = iso(new Date(cm.getFullYear(), cm.getMonth(), n));
    const info = data?.days[date];
    const inWindow = date >= today && date <= maxIso;
    const free = info?.freeCount ?? 0;
    const off = !inWindow || !info || info.closed || free === 0;
    const full = inWindow && !!info && !info.closed && info.hasRegularSlots && free === 0;
    cells.push({
      key: date,
      day: n,
      date,
      off,
      full,
      selected: selectedDate === date,
      isToday: date === today,
    });
  }

  const prevOff = calMonth <= curMonth;
  const nextOff = iso(new Date(cm.getFullYear(), cm.getMonth() + 1, 1)) > maxIso;

  return (
    <div className="calendar-panel">
      <div className="calendar-head">
        <button
          className="btn btn-icon"
          disabled={prevOff}
          onClick={() => setCalMonth(iso(new Date(cm.getFullYear(), cm.getMonth() - 1, 1)))}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h3>
          {t.monthsLong[cm.getMonth()]} {cm.getFullYear()}
        </h3>
        <button
          className="btn btn-icon"
          disabled={nextOff}
          onClick={() => setCalMonth(iso(new Date(cm.getFullYear(), cm.getMonth() + 1, 1)))}
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className="calendar-weekdays">
        {weekHead.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((c) =>
          c.date === null ? (
            <span key={c.key} />
          ) : (
            <button
              key={c.key}
              className="calendar-cell"
              disabled={c.off}
              data-today={c.isToday}
              onClick={() => c.date && onSelectDate(c.date)}
              style={{
                background: c.selected ? "var(--tint)" : "transparent",
                borderColor: c.selected ? "var(--color-accent)" : "transparent",
                color: c.off ? "var(--color-neutral-400)" : c.selected ? "var(--color-accent-800)" : "var(--color-text)",
                textDecoration: c.full ? "line-through" : "none",
              }}
            >
              {c.day}
            </button>
          )
        )}
      </div>
      <div className="calendar-legend">
        <span>
          <span className="legend-dot" style={{ background: "var(--color-accent)" }} />
          {t.legendSel}
        </span>
        <span>
          <span className="legend-dot" style={{ background: "var(--color-accent)", opacity: 0.4 }} />
          {t.legendToday}
        </span>
        <span>
          <span className="legend-dot" style={{ background: "var(--color-neutral-400)" }} />
          {t.legendClosed}
        </span>
      </div>
    </div>
  );
}
