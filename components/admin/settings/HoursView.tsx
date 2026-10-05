"use client";

import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import type { SalonSettings } from "@/lib/settings";
import type { HoursDay } from "@/lib/data/defaults";
import { BOOKING_START_TIMES } from "@/lib/data/defaults";
import { resetSettings } from "@/lib/actions/settings";
import PageHeader from "../PageHeader";
import SavedBadge from "./SavedBadge";
import { useSettings } from "./useSettings";

const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon..Sun, index into hours[] (0 = Sunday)

export default function HoursView({ lang, initialSettings }: { lang: Lang; initialSettings: SalonSettings }) {
  const t = getDictionary(lang);
  const { settings, setSettings, save, saving, startTransition } = useSettings(initialSettings);

  function setHour(index: number, patch: Partial<HoursDay>) {
    save({ hours: settings.hours.map((h, i) => (i === index ? { ...h, ...patch } : h)) });
  }

  function reset() {
    startTransition(async () => {
      setSettings(await resetSettings());
    });
  }

  return (
    <div>
      <PageHeader title={t.adminNav.hours} description={t.hoursNote} actions={<SavedBadge label={t.autoSaved} saving={saving} />} />

      <section className="admin-card">
        {WEEKDAY_ORDER.map((i) => {
          const h = settings.hours[i];
          return (
            <div key={i} className="hours-row-admin">
              <span className="hours-row-admin__day">{t.daysLong[i]}</span>
              <label className="switch">
                <input type="checkbox" checked={h.open} onChange={(e) => setHour(i, { open: e.target.checked })} />
                <span
                  className="switch-track"
                  style={{ borderColor: h.open ? "var(--color-accent)" : "var(--color-neutral-400)", background: h.open ? "var(--tint)" : "transparent" }}
                >
                  <span className="switch-knob" style={{ left: h.open ? 21 : 3, background: h.open ? "var(--color-accent)" : "var(--color-neutral-400)" }} />
                </span>
                <span style={{ marginLeft: 8, fontSize: 13 }}>{h.open ? t.open : t.closedL}</span>
              </label>
              {h.open ? (
                <div className="hours-row-admin__times">
                  <select className="input" aria-label={`${t.daysLong[i]} ${t.fromL}`} value={h.from} onChange={(e) => setHour(i, { from: e.target.value })}>
                    {BOOKING_START_TIMES.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  <span aria-hidden="true">–</span>
                  <select className="input" aria-label={`${t.daysLong[i]} ${t.toL}`} value={h.to} onChange={(e) => setHour(i, { to: e.target.value })}>
                    {BOOKING_START_TIMES.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <span />
              )}
            </div>
          );
        })}
      </section>

      <section className="admin-card admin-card--quiet">
        <h2 className="admin-card__title">{t.resetTitle}</h2>
        <p className="settings-note">{t.resetNote}</p>
        <button className="btn btn-secondary" onClick={reset} disabled={saving}>
          {t.resetDefaults}
        </button>
      </section>
    </div>
  );
}
