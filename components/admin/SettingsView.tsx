"use client";

import { useRef, useState, useTransition } from "react";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import type { SalonSettings } from "@/lib/settings";
import type { HoursDay } from "@/lib/data/defaults";
import { BOOKING_START_TIMES, LOGOS } from "@/lib/data/defaults";
import { toMin, toHM } from "@/lib/dates";
import { updateSettings, resetSettings } from "@/lib/actions/settings";
import type { MapLocation, SettingsPatch } from "@/lib/settings";
import type { GalleryImageLite } from "@/lib/gallery";
import GalleryManager from "./GalleryManager";
import LocationPicker from "./LocationPicker";

const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon..Sun, index into hours[] (0 = Sunday)

export default function SettingsView({
  lang,
  initialSettings,
  gallery,
}: {
  lang: Lang;
  initialSettings: SalonSettings;
  gallery: { studio: GalleryImageLite[]; portrait: GalleryImageLite[] };
}) {
  const t = getDictionary(lang);
  const [settings, setSettings] = useState(initialSettings);
  const [, startTransition] = useTransition();
  const mapSaveTimer = useRef<number>();

  function save(patch: SettingsPatch) {
    setSettings((s) => ({ ...s, ...patch }));
    startTransition(async () => {
      await updateSettings(patch);
    });
  }

  // Dragging and zooming the pin fire many changes in a row; only persist the last one.
  function saveMap(map: MapLocation | null) {
    setSettings((s) => ({ ...s, map }));
    window.clearTimeout(mapSaveTimer.current);
    mapSaveTimer.current = window.setTimeout(() => {
      startTransition(async () => {
        await updateSettings({ map });
      });
    }, 500);
  }

  function setHour(index: number, patch: Partial<HoursDay>) {
    const hours = settings.hours.map((h, i) => (i === index ? { ...h, ...patch } : h));
    save({ hours });
  }

  function reset() {
    startTransition(async () => {
      const fresh = await resetSettings();
      setSettings(fresh);
    });
  }

  const previewDay = [2, 3, 4, 5, 6, 0, 1].find((i) => settings.hours[i].open);
  const previewSlots: string[] = [];
  if (previewDay !== undefined) {
    const h = settings.hours[previewDay];
    const end = toMin(h.to) - settings.lastBeforeCloseMinutes;
    for (let m = toMin(h.from); m <= end; m += settings.slotMinutes) previewSlots.push(toHM(m));
  }

  return (
    <div>
      <div className="admin-toolbar">
        <h1 style={{ margin: 0 }}>{t.setTitle}</h1>
        <span className="autosave-badge">● {t.autoSaved}</span>
      </div>
      <p className="vat-note" style={{ marginBottom: 24 }}>{t.setBody}</p>

      <div className="settings-section">
        <h3>{t.hoursTitle}</h3>
        <p className="settings-note">{t.hoursNote}</p>
        {WEEKDAY_ORDER.map((i) => {
          const h = settings.hours[i];
          return (
            <div key={i} className="hours-row-admin">
              <span>{t.daysLong[i]}</span>
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
                <>
                  <select className="input" value={h.from} onChange={(e) => setHour(i, { from: e.target.value })}>
                    {BOOKING_START_TIMES.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  <select className="input" value={h.to} onChange={(e) => setHour(i, { to: e.target.value })}>
                    {BOOKING_START_TIMES.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </>
              ) : (
                <span />
              )}
            </div>
          );
        })}
      </div>

      <div className="settings-section">
        <h3>{t.slotsTitle}</h3>
        <p className="settings-note">{t.slotsNote}</p>

        <p style={{ fontWeight: 600, marginBottom: 8 }}>{t.slotInt}</p>
        <div className="seg" style={{ marginBottom: 20 }}>
          {[15, 30, 45, 60].map((v) => (
            <button key={v} className="seg-opt" data-on={settings.slotMinutes === v} onClick={() => save({ slotMinutes: v })}>
              {v} min
            </button>
          ))}
        </div>

        <p style={{ fontWeight: 600, marginBottom: 8 }}>{t.lastBefore}</p>
        <div className="seg" style={{ marginBottom: 20 }}>
          {[0, 30, 60, 90].map((v, i) => (
            <button key={v} className="seg-opt" data-on={settings.lastBeforeCloseMinutes === v} onClick={() => save({ lastBeforeCloseMinutes: v })}>
              {t.lastOptsL[i]}
            </button>
          ))}
        </div>

        <p style={{ fontWeight: 600, marginBottom: 8 }}>{t.window}</p>
        <div className="seg" style={{ marginBottom: 20 }}>
          {[2, 4, 8, 12].map((v) => (
            <button key={v} className="seg-opt" data-on={settings.bookingWindowWeeks === v} onClick={() => save({ bookingWindowWeeks: v })}>
              {t.weeksL(v)}
            </button>
          ))}
        </div>

        <p className="vat-note">{t.previewL(previewDay === undefined ? "—" : t.daysLong[previewDay])}</p>
        <div className="preview-row">
          {previewSlots.length === 0 ? (
            <span className="vat-note">—</span>
          ) : (
            previewSlots.map((s) => (
              <span key={s} className="preview-chip">{s}</span>
            ))
          )}
        </div>
      </div>

      <div className="settings-section">
        <h3>{t.styleTitle}</h3>
        <p className="settings-note">{t.styleNote}</p>
        <div className="logo-grid">
          {Object.entries(LOGOS).map(([key, src], i) => {
            const on = settings.heroLogo === key;
            return (
              <button
                key={key}
                className="logo-card"
                onClick={() => save({ heroLogo: key })}
                style={{ borderColor: on ? "var(--color-accent)" : "var(--color-divider)" }}
              >
                <img src={src} alt="" />
                <div>{t.logoNames[i]}</div>
                {on && <div className="vat-note" style={{ color: "var(--color-accent-700)" }}>{t.current}</div>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="settings-section">
        <h3>{t.galleryTitle}</h3>
        <p className="settings-note">{t.galleryNote}</p>
        <GalleryManager slot="studio" title={t.gallerySlots[0]} t={t} initialImages={gallery.studio} />
        <GalleryManager slot="portrait" title={t.gallerySlots[1]} t={t} initialImages={gallery.portrait} />
      </div>

      <div className="settings-section">
        <h3>{t.mapTitle}</h3>
        <p className="settings-note">{t.mapNote}</p>
        <LocationPicker lang={lang} t={t} value={settings.map} onChange={saveMap} />
      </div>

      <button className="btn btn-secondary" onClick={reset}>
        {t.resetDefaults}
      </button>
    </div>
  );
}
