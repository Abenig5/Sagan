import Link from "next/link";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { getSettings } from "@/lib/settings";
import { listClosures } from "@/lib/closures";
import { buildHoursDisplay } from "@/lib/hours-display";
import ContactForm from "@/components/site/ContactForm";
import { SALON_CONTACT } from "@/lib/data/salon";
import StoreMap from "@/components/map/StoreMap";

export const dynamic = "force-dynamic";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const lang = (await params).locale as Lang;
  const t = getDictionary(lang);
  const [settings, closures] = await Promise.all([getSettings(), listClosures()]);
  const hours = buildHoursDisplay(settings.hours, closures, t, lang);

  const rows = [
    { icon: "⌂", k: t.cRows[0], v: t.address },
    { icon: "☏", k: t.cRows[1], v: SALON_CONTACT.phone },
    { icon: "@", k: t.cRows[2], v: SALON_CONTACT.email },
  ];

  return (
    <div className="container" style={{ padding: "64px var(--pad-x) 88px" }}>
      <p className="kicker">{t.cKicker}</p>
      <h1>{t.cTitle}</h1>

      <div className="contact-grid" style={{ marginTop: 32 }}>
        <div>
          {rows.map((r) => (
            <div key={r.k} className="contact-row">
              <span className="contact-icon">{r.icon}</span>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--color-accent-700)" }}>{r.k}</div>
                <div>{r.v}</div>
              </div>
            </div>
          ))}

          <div className="hours-list" style={{ marginTop: 24 }}>
            {hours.map((row, i) => (
              <div className="hours-row tabular-nums" key={i}>
                <span>{row.label}</span>
                <span>{row.value}</span>
              </div>
            ))}
          </div>

          {settings.map ? (
            <div style={{ marginTop: 24 }}>
              <div className="mat map-slot">
                <StoreMap location={settings.map} label={`Sagan Beauty · ${t.address}`} />
              </div>
              <a
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 8 }}
                href={SALON_CONTACT.mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                {t.openMap} ↗
              </a>
            </div>
          ) : (
            <div className="photo-slot mat map-slot" style={{ marginTop: 24 }}>MAP / STOREFRONT</div>
          )}
        </div>

        <div>
          <ContactForm lang={lang} />
          <p className="vat-note" style={{ marginTop: 14 }}>
            {t.forAppts}{" "}
            <Link href={`/${lang}/book`} style={{ textDecoration: "underline" }}>
              {t.onlineBooking}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
