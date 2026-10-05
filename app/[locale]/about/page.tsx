import Link from "next/link";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { listGallery } from "@/lib/gallery";
import Slideshow from "@/components/site/Slideshow";

export const dynamic = "force-dynamic";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const lang = (await params).locale as Lang;
  const t = getDictionary(lang);
  const portraitPhotos = await listGallery("portrait");

  return (
    <div style={{ padding: "64px 0 88px" }}>
      <div className="container">
        <div className="two-col" style={{ marginBottom: 56 }}>
          <div>
            <p className="kicker">{t.aboutKicker}</p>
            <h1>{t.aboutTitle}</h1>
            <p className="justify-hyphens">{t.aboutP1}</p>
            <p className="justify-hyphens" style={{ fontStyle: "italic" }}>{t.aboutP2}</p>
          </div>
          <Slideshow images={portraitPhotos} placeholder="PORTRAIT PHOTO" className="portrait-photo" label={t.aboutKicker} />
        </div>
      </div>

      <section className="section section--beige">
        <div className="pillars-grid">
          {t.pillars.map(([title, body], i) => (
            <div key={i} className="pillar">
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="photo-row">
          <div className="photo-slot mat">SALON</div>
          <div className="photo-slot mat">TEAM</div>
          <div className="photo-slot mat">WORK EXAMPLE</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <Link href={`/${lang}/book`} className="btn btn-primary">
            {t.heroCta}
          </Link>
        </div>
      </section>
    </div>
  );
}
