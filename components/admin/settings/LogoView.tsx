"use client";

import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import type { SalonSettings } from "@/lib/settings";
import { LOGOS } from "@/lib/data/defaults";
import PageHeader from "../PageHeader";
import SavedBadge from "./SavedBadge";
import { useSettings } from "./useSettings";

export default function LogoView({ lang, initialSettings }: { lang: Lang; initialSettings: SalonSettings }) {
  const t = getDictionary(lang);
  const { settings, save, saving } = useSettings(initialSettings);

  return (
    <div>
      <PageHeader title={t.adminNav.logo} description={t.styleNote} actions={<SavedBadge label={t.autoSaved} saving={saving} />} />

      <section className="admin-card">
        <div className="logo-grid">
          {Object.entries(LOGOS).map(([key, src], i) => {
            const on = settings.heroLogo === key;
            return (
              <button key={key} className="logo-card" data-on={on} aria-pressed={on} onClick={() => save({ heroLogo: key })}>
                <img src={src} alt="" />
                <div>{t.logoNames[i]}</div>
                <div className="logo-card__state">{on ? `✓ ${t.current}` : " "}</div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
