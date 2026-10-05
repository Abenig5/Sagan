"use client";

import { useEffect, useState } from "react";
import type { Dictionary, Lang } from "@/lib/i18n/dictionaries";
import { dateLabelLong } from "@/lib/format";
import { toMin, type HM, type Iso } from "@/lib/dates";

interface DayAvailability {
  closed: boolean;
  times: Array<{ time: HM; state: "open" | "booked" | "unavailable" }>;
}

export default function TimesPanel({
  lang,
  t,
  date,
  selectedTime,
  onSelectTime,
}: {
  lang: Lang;
  t: Dictionary;
  date: Iso | null;
  selectedTime: HM | null;
  onSelectTime: (time: HM) => void;
}) {
  const [data, setData] = useState<DayAvailability | null>(null);

  useEffect(() => {
    if (!date) {
      setData(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/availability?date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setData(d);
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  if (!date) {
    return (
      <div className="times-panel">
        <div className="times-hint">{t.pickDay}</div>
      </div>
    );
  }

  const times = data?.times ?? [];
  const freeCount = times.filter((x) => x.state === "open").length;
  const morning = times.filter((x) => toMin(x.time) < 720);
  const afternoon = times.filter((x) => toMin(x.time) >= 720);

  return (
    <div className="times-panel">
      <h3 style={{ marginBottom: 2 }}>{dateLabelLong(date, t, lang)}</h3>
      <p className="vat-note tabular-nums">{t.freeN(freeCount)}</p>

      {times.length === 0 && (
        <div className="times-hint" style={{ marginTop: 12 }}>
          {t.noTimes}
        </div>
      )}

      {morning.length > 0 && (
        <>
          <div className="times-group-label">{t.morning}</div>
          <div className="times-grid">
            {morning.map((slot) => (
              <TimeSlot key={slot.time} slot={slot} t={t} selected={selectedTime === slot.time} onSelect={onSelectTime} />
            ))}
          </div>
        </>
      )}
      {afternoon.length > 0 && (
        <>
          <div className="times-group-label">{t.afternoon}</div>
          <div className="times-grid">
            {afternoon.map((slot) => (
              <TimeSlot key={slot.time} slot={slot} t={t} selected={selectedTime === slot.time} onSelect={onSelectTime} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TimeSlot({
  slot,
  t,
  selected,
  onSelect,
}: {
  slot: { time: HM; state: "open" | "booked" | "unavailable" };
  t: Dictionary;
  selected: boolean;
  onSelect: (time: HM) => void;
}) {
  const disabled = slot.state !== "open";
  const state = selected ? "selected" : slot.state;
  return (
    <button
      type="button"
      className="time-slot"
      data-state={state}
      disabled={disabled}
      onClick={() => onSelect(slot.time)}
    >
      {slot.time}
      {slot.state === "booked" && <small>{t.bookedL}</small>}
      {slot.state === "unavailable" && <small>{t.unavailL}</small>}
    </button>
  );
}
