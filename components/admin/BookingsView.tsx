"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { getDictionary, type Dictionary, type Lang } from "@/lib/i18n/dictionaries";
import { CATEGORIES, categoryName, getService, serviceName, priceLabel, type CategoryId } from "@/lib/data/catalogue";
import { dateLabel, dateLabelLong } from "@/lib/format";
import { addDays, todayIso } from "@/lib/dates";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { setBookingStatus } from "@/lib/actions/bookings";
import { useRouter } from "next/navigation";
import PageHeader from "./PageHeader";

export interface AdminBooking {
  id: string;
  ref: string;
  categoryId: CategoryId;
  serviceId: string;
  hairLength: number | null;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  notes: string | null;
  status: "pending" | "confirmed" | "declined";
}

type StatusFilter = "all" | "pending" | "confirmed" | "declined";

export default function BookingsView({
  lang,
  initialBookings,
  initialSelectedId = null,
}: {
  lang: Lang;
  initialBookings: AdminBooking[];
  initialSelectedId?: string | null;
}) {
  const t = getDictionary(lang);
  const [bookings, setBookings] = useState(initialBookings);
  const [view, setView] = useState<"list" | "day">("list");
  const [fType, setFType] = useState<"all" | CategoryId>("all");
  const [fStatus, setFStatus] = useState<StatusFilter>("all");
  const [q, setQ] = useState("");
  const [selId, setSelId] = useState<string | null>(initialSelectedId);
  const [adminDay, setAdminDay] = useState(todayIso());
  const [pending, startTransition] = useTransition();
  const mobile = useIsMobile();
  const router = useRouter();

  const today = todayIso();
  const weekEnd = addDays(today, 7);

  const fullName = (b: AdminBooking) => {
    const service = getService(b.serviceId);
    if (!service) return "—";
    const name = serviceName(service, lang);
    return service.pricing.kind === "length" && b.hairLength !== null ? `${name} · ${t.lengths[b.hairLength]}` : name;
  };

  const query = q.trim().toLowerCase();
  const sorted = useMemo(() => [...bookings].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)), [bookings]);
  const byStatus = sorted.filter(
    (b) =>
      (fStatus === "all" || b.status === fStatus) &&
      (!query || (b.name + " " + fullName(b)).toLowerCase().includes(query))
  );
  const list = byStatus.filter((b) => fType === "all" || b.categoryId === fType);

  const stats = [
    { k: t.statsL[0], v: bookings.filter((b) => b.status === "pending").length, accent: true },
    { k: t.statsL[1], v: bookings.filter((b) => b.date === today && b.status !== "declined").length, accent: false },
    { k: t.statsL[2], v: bookings.filter((b) => b.status === "confirmed" && b.date >= today && b.date <= weekEnd).length, accent: false },
    { k: t.statsL[3], v: bookings.length, accent: false },
  ];

  const typeTabs = [{ id: "all" as const, label: t.all }, ...CATEGORIES.map((c) => ({ id: c.id, label: c[lang][0] }))];

  const selB = bookings.find((b) => b.id === selId) ?? null;

  function selectBooking(id: string) {
    setSelId(id);
  }

  function changeStatus(status: "pending" | "confirmed" | "declined") {
    if (!selB) return;
    const prev = bookings;
    setBookings((bs) => bs.map((b) => (b.id === selB.id ? { ...b, status } : b)));
    startTransition(async () => {
      try {
        await setBookingStatus(selB.id, status);
        router.refresh(); // updates the "waiting for a reply" badge in the sidebar
      } catch {
        setBookings(prev);
      }
    });
  }

  const dayList = list.filter((b) => b.date === adminDay);
  const dayTimes = useMemo(() => {
    const times = new Set(dayList.map((b) => b.time));
    return [...times].sort();
  }, [dayList]);

  const tagClass = (status: AdminBooking["status"]) =>
    status === "pending" ? "tag tag-accent" : status === "confirmed" ? "tag tag-outline" : "tag tag-neutral";

  return (
    <div>
      <PageHeader title={t.adminNav.bookings} description={t.bookingsDesc} />

      <div className="stat-grid stat-grid--4">
        {stats.map((s) => (
          <div key={s.k} className="stat-tile" data-accent={s.accent}>
            <div className="stat-tile__k">{s.k}</div>
            <div className="stat-tile__v tabular-nums">{s.v}</div>
          </div>
        ))}
      </div>

      <section className="admin-card filter-card" aria-label={t.filtersL}>
        <div className="filter-card__row">
          <input className="input filter-card__search" type="search" placeholder={t.search} value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="filter-group">
            <span className="filter-group__label">{t.viewL}</span>
            <div className="seg">
              <button className="seg-opt" data-on={view === "list"} onClick={() => setView("list")}>
                {t.list}
              </button>
              <button className="seg-opt" data-on={view === "day"} onClick={() => setView("day")}>
                {t.day}
              </button>
            </div>
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-group__label">{t.statusL}</span>
          <div className="seg">
            {(["all", "pending", "confirmed", "declined"] as StatusFilter[]).map((s) => (
              <button key={s} className="seg-opt" data-on={fStatus === s} onClick={() => setFStatus(s)}>
                {s === "all" ? t.all : t.st[s]}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-group__label">{t.categoryL}</span>
          <div className="chip-row">
            {typeTabs.map((tab) => (
              <button key={tab.id} className="chip" data-on={fType === tab.id} onClick={() => setFType(tab.id)}>
                {tab.label} <span className="chip__n">{byStatus.filter((b) => tab.id === "all" || b.categoryId === tab.id).length}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="admin-layout">
        <div className="admin-layout__main">
          {view === "list" ? (
            list.length === 0 ? (
              <p className="vat-note">{t.noRows}</p>
            ) : mobile ? (
              <div className="booking-cards">
                {list.map((b) => (
                  <div key={b.id} className="booking-card" onClick={() => selectBooking(b.id)} style={{ background: b.id === selId ? "var(--tint)" : "var(--color-paper)" }}>
                    <div className="booking-card__top">
                      <strong>{b.name}</strong>
                      <span className={tagClass(b.status)}>{t.st[b.status]}</span>
                    </div>
                    <div className="vat-note tabular-nums">
                      {dateLabel(b.date, t, lang)} · {b.time}
                    </div>
                    <div className="vat-note">{fullName(b)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>{t.thWhen}</th>
                    <th>{t.thClient}</th>
                    <th>{t.thService}</th>
                    <th>{t.thType}</th>
                    <th>{t.thStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((b) => (
                    <tr key={b.id} onClick={() => selectBooking(b.id)} style={{ background: b.id === selId ? "var(--tint)" : "transparent" }}>
                      <td className="tabular-nums">
                        {dateLabel(b.date, t, lang)} · {b.time}
                      </td>
                      <td>{b.name}</td>
                      <td>{fullName(b)}</td>
                      <td>{categoryName(b.categoryId, lang)}</td>
                      <td>
                        <span className={tagClass(b.status)}>{t.st[b.status]}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            <div>
              <div className="day-view-head">
                <button className="btn btn-icon" onClick={() => setAdminDay(addDays(adminDay, -1))}>
                  ‹
                </button>
                <div>
                  <h3 style={{ margin: 0 }}>{dateLabelLong(adminDay, t, lang)}</h3>
                  <span className="vat-note">{t.bookingN(dayList.length)}</span>
                </div>
                <button className="btn btn-icon" onClick={() => setAdminDay(addDays(adminDay, 1))}>
                  ›
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setAdminDay(today)}>
                  {t.today}
                </button>
              </div>
              {dayTimes.length === 0 ? (
                <p className="vat-note">{t.noRows}</p>
              ) : (
                dayTimes.map((time) => {
                  const items = dayList.filter((b) => b.time === time);
                  return (
                    <div key={time} className="day-slot-row">
                      <time className="tabular-nums">{time}</time>
                      <div className="day-slot-chips">
                        {items.map((b) => (
                          <button
                            key={b.id}
                            className="day-chip"
                            onClick={() => selectBooking(b.id)}
                            style={{
                              borderLeftColor: b.status === "pending" ? "var(--color-accent)" : b.status === "confirmed" ? "var(--color-text)" : "var(--color-neutral-400)",
                              textDecoration: b.status === "declined" ? "line-through" : "none",
                              background: b.id === selId ? "var(--tint)" : b.status === "pending" ? "var(--color-accent-100)" : "#fff",
                            }}
                          >
                            {b.name} · {categoryName(b.categoryId, lang)}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {!mobile && (
          <div className="admin-layout__aside">
            {selB ? (
              <DetailPanel
                t={t}
                lang={lang}
                booking={selB}
                onAccept={() => changeStatus("confirmed")}
                onDecline={() => changeStatus("declined")}
                onReopen={() => changeStatus("pending")}
                onClose={() => setSelId(null)}
                busy={pending}
              />
            ) : (
              <p className="times-hint">{t.selectHint}</p>
            )}
          </div>
        )}
      </div>

      {mobile && selB && (
        <BottomSheet label={t.bookingDetailsL} onClose={() => setSelId(null)}>
          <DetailPanel
            t={t}
            lang={lang}
            booking={selB}
            onAccept={() => changeStatus("confirmed")}
            onDecline={() => changeStatus("declined")}
            onReopen={() => changeStatus("pending")}
            onClose={() => setSelId(null)}
            busy={pending}
          />
        </BottomSheet>
      )}
    </div>
  );
}

function DetailPanel({
  t,
  lang,
  booking,
  onAccept,
  onDecline,
  onReopen,
  onClose,
  busy,
}: {
  t: Dictionary;
  lang: Lang;
  booking: AdminBooking;
  onAccept: () => void;
  onDecline: () => void;
  onReopen: () => void;
  onClose: () => void;
  busy: boolean;
}) {
  const service = getService(booking.serviceId);
  const svcLabel = service ? serviceName(service, lang) + (service.pricing.kind === "length" && booking.hairLength !== null ? ` · ${t.lengths[booking.hairLength]}` : "") : "—";
  const price = service ? priceLabel(service, lang, booking.hairLength, t.perHour) : "—";
  const tagClass = booking.status === "pending" ? "tag tag-accent" : booking.status === "confirmed" ? "tag tag-outline" : "tag tag-neutral";

  const rows = [
    [t.selL[0], dateLabel(booking.date, t, lang)],
    [t.selL[1], booking.time],
    [t.selL[2], categoryName(booking.categoryId, lang)],
    [t.selL[3], svcLabel],
    [t.selL[4], price],
    [t.selL[5], booking.phone || "—"],
    [t.selL[6], booking.email || "—"],
  ];

  return (
    <div className="detail-panel">
      <div className="detail-panel__top">
        <span className="vat-note">{booking.ref}</span>
        <span className={tagClass}>{t.st[booking.status]}</span>
        <button className="btn btn-icon detail-panel__close" onClick={onClose} aria-label={t.closeL} title={t.closeL}>
          ✕
        </button>
      </div>
      <h2 className="detail-panel__name">{booking.name}</h2>
      {rows.map(([k, v]) => (
        <div key={k} className="detail-panel__row">
          <span>{k}</span>
          <span className="tabular-nums">{v}</span>
        </div>
      ))}
      {booking.notes && (
        <div>
          <div className="vat-note" style={{ marginBottom: 4 }}>{t.notesU}</div>
          <div className="detail-panel__notes">{booking.notes}</div>
        </div>
      )}
      <div className="detail-panel__actions">
        {booking.status === "pending" ? (
          <>
            <button className="btn btn-primary" disabled={busy} onClick={onAccept}>
              {t.accept}
            </button>
            <button className="btn btn-secondary" disabled={busy} onClick={onDecline}>
              {t.decline}
            </button>
          </>
        ) : (
          <button className="btn btn-secondary" disabled={busy} onClick={onReopen}>
            {t.reopen}
          </button>
        )}
      </div>
    </div>
  );
}

/** Phone-only panel that slides up from the bottom with the selected booking. */
function BottomSheet({ label, onClose, children }: { label: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={label}>
      <div className="sheet__scrim" onClick={onClose} aria-hidden="true" />
      <div className="sheet__panel">{children}</div>
    </div>
  );
}
