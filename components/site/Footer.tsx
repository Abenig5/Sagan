import Link from "next/link";
import PoweredBy from "@/components/PoweredBy";
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
            <p>{t.address}</p>
            <p>+41 00 000 00 00</p>
            <p>hello@saganbeauty.ch</p>
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
