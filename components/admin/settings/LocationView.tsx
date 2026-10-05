"use client";

import { useRef } from "react";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import type { MapLocation, SalonSettings } from "@/lib/settings";
import { updateSettings } from "@/lib/actions/settings";
import PageHeader from "../PageHeader";
import LocationPicker from "../LocationPicker";
import SavedBadge from "./SavedBadge";
import { useSettings } from "./useSettings";

export default function LocationView({ lang, initialSettings }: { lang: Lang; initialSettings: SalonSettings }) {
  const t = getDictionary(lang);
  const { settings, setSettings, saving, startTransition } = useSettings(initialSettings);
  const timer = useRef<number>();

  // Dragging and zooming the pin fire many changes in a row; only persist the last one.
  function saveMap(map: MapLocation | null) {
    setSettings((s) => ({ ...s, map }));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      startTransition(async () => {
        await updateSettings({ map });
      });
    }, 500);
  }

  return (
    <div>
      <PageHeader title={t.adminNav.location} description={t.mapNote} actions={<SavedBadge label={t.autoSaved} saving={saving} />} />
      <section className="admin-card">
        <LocationPicker lang={lang} t={t} value={settings.map} onChange={saveMap} />
      </section>
    </div>
  );
}
