"use client";

import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import type { SalonSettings } from "@/lib/settings";
import { toMin, toHM } from "@/lib/dates";
import PageHeader from "../PageHeader";
import SavedBadge from "./SavedBadge";
import { useSettings } from "./useSettings";

export default function BookingRulesView({ lang, initialSettings }: { lang: Lang; initialSettings: SalonSettings }) {
  const t = getDictionary(lang);
  const { settings, save, saving } = useSettings(initialSettings);

  const previewDay = [2, 3, 4, 5, 6, 0, 1].find((i) => settings.hours[i].open);
  const previewSlots: string[] = [];
  if (previewDay !== undefined) {
    const h = settings.hours[previewDay];
    const end = toMin(h.to) - settings.lastBeforeCloseMinutes;
    for (let m = toMin(h.from); m <= end; m += settings.slotMinutes) previewSlots.push(toHM(m));
  }

  const rules = [
    { label: t.slotInt, options: [15, 30, 45, 60].map((v) => ({ v, label: `${v} min` })), value: settings.slotMinutes, key: "slotMinutes" as const },
    { label: t.lastBefore, options: [0, 30, 60, 90].map((v, i) => ({ v, label: t.lastOptsL[i] })), value: settings.lastBeforeCloseMinutes, key: "lastBeforeCloseMinutes" as const },
    { label: t.window, options: [2, 4, 8, 12].map((v) => ({ v, label: t.weeksL(v) })), value: settings.bookingWindowWeeks, key: "bookingWindowWeeks" as const },
  ];

  return (
    <div>
      <PageHeader title={t.adminNav.rules} description={t.slotsNote} actions={<SavedBadge label={t.autoSaved} saving={saving} />} />

      <section className="admin-card">
        {rules.map((r) => (
          <div key={r.key} className="rule-row">
            <p className="rule-row__label">{r.label}</p>
            <div className="seg">
              {r.options.map((o) => (
                <button key={o.v} className="seg-opt" data-on={r.value === o.v} onClick={() => save({ [r.key]: o.v })}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="admin-card admin-card--quiet">
        <p className="admin-card__kicker">{t.previewL(previewDay === undefined ? "—" : t.daysLong[previewDay])}</p>
        <div className="preview-row">
          {previewSlots.length === 0 ? (
            <span className="vat-note">—</span>
          ) : (
            previewSlots.map((s) => (
              <span key={s} className="preview-chip">{s}</span>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
