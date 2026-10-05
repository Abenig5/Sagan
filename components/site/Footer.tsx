import Link from "next/link";
import PoweredBy from "@/components/PoweredBy";
import { SALON_CONTACT } from "@/lib/data/salon";
import type { Dictionary, Lang } from "@/lib/i18n/dictionaries";

export default function Footer({ lang, t }: { lang: Lang; t: Dictionary }) {
  const pages = [
    { id: "", label: t.nav[0] },
    { id: "services", label: t.nav[1] },
    { id: "about", label: t.nav[2] },
    { id: "contact", label: t.nav[3] },
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-word">
              SAGAN
              <small>BEAUTY</small>
            </div>
            <hr className="footer-rule" />
            <p className="footer-tagline">HAIR · BEAUTY · STYLE</p>
          </div>
          <div className="footer-col">
            <h6>{t.pagesU}</h6>
            {pages.map((p) => (
              <Link key={p.id} href={`/${lang}/${p.id}`}>
                {p.label}
              </Link>
            ))}
          </div>
          <div className="footer-col">
            <h6>{t.visitU}</h6>
            <a href={SALON_CONTACT.mapsUrl} target="_blank" rel="noreferrer" className="footer-contact">
              <span aria-hidden="true">⌂</span>
              <span>
                {SALON_CONTACT.street}
                <br />
                {SALON_CONTACT.city}
              </span>
            </a>
            <a href={SALON_CONTACT.phoneHref} className="footer-contact">
              <span aria-hidden="true">☏</span>
              <span className="tabular-nums">{SALON_CONTACT.phone}</span>
            </a>
            <a href={`mailto:${SALON_CONTACT.email}`} className="footer-contact">
              <span aria-hidden="true">@</span>
              <span>{SALON_CONTACT.email}</span>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Sagan Beauty</span>
          <PoweredBy variant="dark" />
          <Link href="/admin">{t.staff}</Link>
        </div>
      </div>
    </footer>
  );
}
