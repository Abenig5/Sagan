import Link from "next/link";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { getSettings } from "@/lib/settings";
import { listClosures } from "@/lib/closures";
import { buildHoursDisplay } from "@/lib/hours-display";
import { LOGOS } from "@/lib/data/defaults";
import { CATEGORIES, fromPriceForCategory } from "@/lib/data/catalogue";
import { listGallery } from "@/lib/gallery";
import Slideshow from "@/components/site/Slideshow";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const lang = (await params).locale as Lang;
  const t = getDictionary(lang);
  const [settings, closures, studioPhotos] = await Promise.all([getSettings(), listClosures(), listGallery("studio")]);
  const hours = buildHoursDisplay(settings.hours, closures, t, lang);
  const heroSrc = LOGOS[settings.heroLogo] ?? LOGOS.monogram;

  return (
    <>
      <section className="hero">
        <div className="hero__grid">
          <div>
            <p className="kicker">HAIR · BEAUTY · STYLE</p>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroBody}</p>
            <div className="hero__actions">
              <Link href={`/${lang}/book`} className="btn btn-primary">
                {t.heroCta}
              </Link>
              <Link href={`/${lang}/services`} className="btn btn-secondary">
                {t.heroPrices}
              </Link>
            </div>
          </div>
          <div className="hero__image-wrap">
            <img src={heroSrc} alt="Sagan Beauty" className="hero__image plate elev-md" />
          </div>
        </div>
      </section>

      <div className="tagline-band">
        <span>
          HAIR<span className="dot">•</span>BEAUTY<span className="dot">•</span>WELLNESS
        </span>
      </div>

      <section className="section">
        <div className="section-head">
          <p className="kicker">{t.offerKicker}</p>
          <h2>{t.offerTitle}</h2>
        </div>
        <div className="offer-grid">
          {CATEGORIES.map((c) => (
            <div key={c.id} className="card offer-card">
              <p className="card-kicker" style={{ fontSize: 10, letterSpacing: "0.1em", color: "var(--color-accent-700)", textTransform: "uppercase" }}>
                {c.kind === "hair" ? "HAIR" : "BEAUTY"}
              </p>
              <h3 className="card-title">{c[lang][0]}</h3>
              <p className="card-body">{c[lang][1]}</p>
              <div className="offer-card__actions">
                <span className="from tabular-nums">
                  {t.from} {fromPriceForCategory(c.id)}
                </span>
                <Link href={`/${lang}/book?cat=${c.id}`} className="btn btn-ghost">
                  {t.book}
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link href={`/${lang}/services`} className="btn btn-ghost">
            {t.fullList} →
          </Link>
        </div>
      </section>

      <section className="section section--taupe">
        <div className="studio-grid">
          <Slideshow images={studioPhotos} placeholder="STUDIO PHOTO" className="studio-photo" label={t.studioKicker} />
          <div>
            <p className="kicker">{t.studioKicker}</p>
            <h2>{t.studioTitle}</h2>
            <p>{t.studioBody}</p>
            <Link href={`/${lang}/about`} className="btn btn-secondary">
              {t.about}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="hours-grid">
          <div>
            <p className="kicker">{t.hoursKicker}</p>
            <div className="hours-list">
              {hours.map((row, i) => (
                <div className="hours-row tabular-nums" key={i}>
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hours-cta">
            <img src="/assets/monogram-mark.png" alt="" />
            <h3>{t.ctaTitle}</h3>
            <p>{t.ctaBody}</p>
            <Link href={`/${lang}/book`} className="btn btn-primary">
              {t.heroCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
