"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { addDays, parseIso, todayIso, type HM, type Iso } from "@/lib/dates";
import { closureCovering, daySlots, isPast, type ClosureRange } from "@/lib/availability";
import type { SalonSettings } from "@/lib/settings";
import { categoryName, type CategoryId } from "@/lib/data/catalogue";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import {
  addClosure,
  blockAllOpenInRange,
  openAllBlockedInRange,
  removeClosure,
  toggleBlockedSlot,
} from "@/lib/actions/availability";

interface BookingLite {
  id: string;
  date: Iso;
  time: HM;
  name: string;
  categoryId: CategoryId;
}

interface ClosureLite {
  id: string;
  from: Iso;
  to: Iso;
  note: string | null;
}

export default function AvailabilityView({
  lang,
  refDate,
  dates,
  settings,
  closures,
  bookings,
  blocked,
}: {
  lang: Lang;
  refDate: Iso;
  dates: Iso[];
  settings: SalonSettings;
  closures: ClosureLite[];
  bookings: BookingLite[];
  blocked: { date: Iso; time: HM }[];
}) {
  const t = getDictionary(lang);
  const router = useRouter();
  const mobile = useIsMobile();
  const [, startTransition] = useTransition();
  const [cFrom, setCFrom] = useState("");
  const [cTo, setCTo] = useState("");
  const [cNote, setCNote] = useState("");

  const today = todayIso();
  const closureRanges = closures;
  const visibleDates = mobile ? [refDate] : dates;

  const bookedAt = useMemo(() => {
    const m = new Map<string, BookingLite>();
    for (const b of bookings) m.set(`${b.date}|${b.time}`, b);
    return m;
  }, [bookings]);

  const blockedAt = useMemo(() => {
    const s = new Set<string>();
    for (const b of blocked) s.add(`${b.date}|${b.time}`);
    return s;
  }, [blocked]);

  const dayInfo = visibleDates.map((date) => ({
    date,
    reg: daySlots(date, settings, closureRanges),
    closed: closureCovering(date, closureRanges),
  }));
  const times = [...new Set(dayInfo.flatMap((d) => d.reg))].sort();

  let nOpen = 0;
  let nBooked = 0;
  let nBlocked = 0;
  for (const { date, reg, closed } of dayInfo) {
    if (closed) continue;
    for (const time of reg) {
      const key = `${date}|${time}`;
      if (bookedAt.has(key)) nBooked++;
      else if (date < today || (date === today && isPastNow(time))) continue;
      else if (blockedAt.has(key)) nBlocked++;
      else nOpen++;
    }
  }

  function go(nextRef: Iso) {
    router.push(`/admin/availability?ref=${nextRef}`);
  }

  function prev() {
    go(addDays(refDate, mobile ? -1 : -7));
  }
  function next() {
    go(addDays(refDate, mobile ? 1 : 7));
  }
  function goToday() {
    go(today);
  }

  function toggle(date: Iso, time: HM) {
    startTransition(async () => {
      await toggleBlockedSlot(date, time);
      router.refresh();
    });
  }

  function blockAllWeek() {
    startTransition(async () => {
      await blockAllOpenInRange(visibleDates);
      router.refresh();
    });
  }
  function openAllWeek() {
    startTransition(async () => {
      await openAllBlockedInRange(visibleDates);
      router.refresh();
    });
  }

  function closeSingleDay(date: Iso) {
    startTransition(async () => {
      await addClosure(date, date, "");
      router.refresh();
    });
  }
  function reopenSingleDay(closure: ClosureRange) {
    const match = closures.find((c) => c.from === closure.from && c.to === closure.to);
    if (!match) return;
    startTransition(async () => {
      await removeClosure(match.id);
      router.refresh();
    });
  }

  const rangeTitle = mobile
    ? `${t.daysLong[parseIso(refDate).getDay()]}, ${shortDate(refDate, t, lang)}`
    : `${shortDate(dates[0], t, lang)} – ${shortDate(dates[6], t, lang)} ${parseIso(dates[6]).getFullYear()}`;

  const canAddClosure = !!cFrom && !!cTo && cTo >= cFrom;
  const upcomingClosures = closures.filter((c) => c.to >= today).sort((a, b) => a.from.localeCompare(b.from));

  return (
    <div>
      <h1>{t.avTitle}</h1>
      <p className="vat-note" style={{ maxWidth: 640 }}>{t.avBody}</p>

      <div className="avail-toolbar">
        <button className="btn btn-secondary btn-sm" onClick={blockAllWeek}>
          {mobile ? t.blockAllDay : t.blockAllWeek}
        </button>
        <button className="btn btn-secondary btn-sm" onClick={openAllWeek}>
          {mobile ? t.openAllDay : t.openAllWeek}
        </button>
      </div>

      <div className="stat-grid">
        <div className="stat-tile" data-accent="true">
          <div className="stat-tile__k">{t.avStatsL[0]}</div>
          <div className="stat-tile__v tabular-nums">{nOpen}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile__k">{t.avStatsL[1]}</div>
          <div className="stat-tile__v tabular-nums">{nBooked}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile__k">{t.avStatsL[2]}</div>
          <div className="stat-tile__v tabular-nums">{nBlocked}</div>
        </div>
      </div>

      <div className="avail-panel-head">
        <button className="btn btn-icon" onClick={prev}>‹</button>
        <strong className="tabular-nums">{rangeTitle}</strong>
        <button className="btn btn-icon" onClick={next}>›</button>
        <button className="btn btn-secondary btn-sm" onClick={goToday}>
          {mobile ? t.today : t.thisWeek}
        </button>
      </div>

      {mobile && (
        <div className="avail-daystrip" role="tablist">
          {dates.map((date) => {
            const dt = parseIso(date);
            const open = daySlots(date, settings, closureRanges).length > 0 && !closureCovering(date, closureRanges);
            return (
              <button
                key={date}
                role="tab"
                className="avail-daystrip__day"
                aria-selected={date === refDate}
                data-today={date === today}
                data-closed={!open}
                onClick={() => go(date)}
              >
                <span className="wd">{t.days[dt.getDay()]}</span>
                <span className="dnum tabular-nums">{dt.getDate()}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="avail-legend">
        <span><span className="legend-dot" style={{ background: "#fff", border: "1px solid var(--color-divider)" }} />{t.slOpen}</span>
        <span><span className="legend-dot" style={{ background: "var(--color-accent-100)", border: "1px solid var(--color-accent)" }} />{t.bookedL}</span>
        <span><span className="legend-dot avail-hatch" style={{ border: "1px solid var(--color-neutral-300)" }} />{t.slBlocked}</span>
      </div>

      <div className="avail-scroll">
        <div
          className="avail-grid"
          data-single={visibleDates.length === 1}
          style={{ gridTemplateColumns: `56px repeat(${visibleDates.length}, minmax(0,1fr))` }}
        >
          <div className="avail-corner" />
          {dayInfo.map(({ date, reg, closed }) => {
            const dt = parseIso(date);
            const freeCount = reg.filter((time) => {
              const key = `${date}|${time}`;
              return !bookedAt.has(key) && !blockedAt.has(key) && !isPast(date, time);
            }).length;
            const single = closed && closed.from === closed.to;
            let actionLabel = t.blockDay;
            let action: (() => void) | null = () => closeSingleDay(date);
            let actionOff = false;
            if (!reg.length && !closed) {
              actionLabel = t.closedOn;
              action = null;
              actionOff = true;
            } else if (single) {
              actionLabel = t.openDay;
              action = () => reopenSingleDay(closed!);
            } else if (closed) {
              actionLabel = t.inPeriod;
              action = null;
              actionOff = true;
            } else if (date < today) {
              action = null;
              actionOff = true;
            }
            return (
              <div key={date} className="avail-col-head" style={{ background: date === today ? "var(--tint)" : "transparent" }}>
                <div className="wd">{t.days[dt.getDay()].toUpperCase()}</div>
                <div className="dnum tabular-nums">{dt.getDate()}</div>
                <div className="free tabular-nums">{reg.length && !closed ? t.freeShort(freeCount) : t.closedOn}</div>
                {action ? (
                  <button className="btn btn-secondary btn-sm" onClick={action} disabled={actionOff}>
                    {actionLabel}
                  </button>
                ) : (
                  <span className="vat-note" style={{ fontSize: 11, opacity: 0.45 }}>{actionLabel}</span>
                )}
              </div>
            );
          })}

          {times.map((time) => (
            <FragmentRow
              key={time}
              time={time}
              dayInfo={dayInfo}
              bookedAt={bookedAt}
              blockedAt={blockedAt}
              today={today}
              t={t}
              lang={lang}
              onToggle={toggle}
              onOpenBooking={(id) => router.push(`/admin/bookings?select=${id}`)}
            />
          ))}
        </div>
      </div>

      <div className="settings-section" style={{ marginTop: 32 }}>
        <h3>{t.closuresTitle}</h3>
        <p className="settings-note">{t.closuresNote}</p>
        <div className="closures-form">
          <div className="field">
            <label>{t.fromL}</label>
            <input className="input" type="date" min={today} value={cFrom} onChange={(e) => setCFrom(e.target.value)} />
          </div>
          <div className="field">
            <label>{t.toL}</label>
            <input className="input" type="date" min={cFrom || today} value={cTo} onChange={(e) => setCTo(e.target.value)} />
          </div>
          <div className="field">
            <label>{t.noteL}</label>
            <input className="input" placeholder={t.notePh} value={cNote} onChange={(e) => setCNote(e.target.value)} />
          </div>
          <button
            className="btn btn-primary"
            disabled={!canAddClosure}
            onClick={() => {
              startTransition(async () => {
                await addClosure(cFrom, cTo, cNote);
                setCFrom("");
                setCTo("");
                setCNote("");
                router.refresh();
              });
            }}
          >
            {t.addClosure}
          </button>
        </div>
        {upcomingClosures.length === 0 ? (
          <p className="vat-note">{t.noClosures}</p>
        ) : (
          upcomingClosures.map((c) => (
            <div key={c.id} className="closure-row">
              <span>
                {c.from === c.to ? shortDate(c.from, t, lang) : `${shortDate(c.from, t, lang)} – ${shortDate(c.to, t, lang)}`}
                {c.note ? ` · ${c.note}` : ""}
              </span>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  startTransition(async () => {
                    await removeClosure(c.id);
                    router.refresh();
                  });
                }}
              >
                {t.remove}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function shortDate(date: Iso, t: ReturnType<typeof getDictionary>, lang: Lang) {
  const dt = parseIso(date);
  return `${dt.getDate()}${lang === "de" ? "." : ""} ${t.months[dt.getMonth()]}`;
}

function FragmentRow({
  time,
  dayInfo,
  bookedAt,
  blockedAt,
  today,
  t,
  lang,
  onToggle,
  onOpenBooking,
}: {
  time: HM;
  dayInfo: { date: Iso; reg: HM[]; closed: ClosureRange | undefined }[];
  bookedAt: Map<string, BookingLite>;
  blockedAt: Set<string>;
  today: Iso;
  t: ReturnType<typeof getDictionary>;
  lang: Lang;
  onToggle: (date: Iso, time: HM) => void;
  onOpenBooking: (id: string) => void;
}) {
  return (
    <>
      <div className="avail-time-label">{time}</div>
      {dayInfo.map(({ date, reg, closed }) => {
        const key = `${date}|${time}`;
        if (!reg.includes(time)) return <div key={key} className="avail-cell" data-vis="hidden" />;
        if (closed) return <div key={key} className="avail-cell avail-hatch" title={t.closedOn} />;
        const booking = bookedAt.get(key);
        if (booking) {
          return (
            <button
              key={key}
              className="avail-cell"
              title={`${booking.name} · ${categoryName(booking.categoryId, lang)}`}
              style={{ background: "var(--color-accent-100)", borderColor: "var(--color-accent)", color: "var(--color-accent-800)" }}
              onClick={() => onOpenBooking(booking.id)}
            >
              {booking.name.split(" ")[0]}
            </button>
          );
        }
        if (date < today || (date === today && isPastNow(time))) {
          return <div key={key} className="avail-cell" style={{ color: "var(--color-neutral-400)" }}>—</div>;
        }
        if (blockedAt.has(key)) {
          return (
            <button key={key} className="avail-cell avail-hatch" title={t.slBlocked} onClick={() => onToggle(date, time)}>
              {t.slBlocked}
            </button>
          );
        }
        return (
          <button key={key} className="avail-cell" title={t.slOpen} onClick={() => onToggle(date, time)}>
            {t.slOpen}
          </button>
        );
      })}
    </>
  );
}

function isPastNow(time: HM): boolean {
  const now = new Date();
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
}
