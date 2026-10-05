"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { withLocale } from "@/lib/i18n/paths";

const NAV_IDS = ["", "services", "about", "contact"] as const;

export default function Header({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const activeId = pathname.split("/").filter(Boolean)[1] ?? "";

  const navLinks = NAV_IDS.map((id, i) => ({
    id,
    label: t.nav[i],
    href: withLocale(`/${lang}/${id}`, lang),
  }));

  return (
    <header className="site-header">
      <div className="site-header__row">
        <Link href={`/${lang}`} className="brand">
          <img src="/assets/monogram-mark.png" alt="Sagan Beauty" />
          <span>
            <span className="brand-word" style={{ display: "block" }}>
              SAGAN BEAUTY
            </span>
            <span className="brand-sub">HAIR &amp; BEAUTY STUDIO</span>
          </span>
        </Link>

        <nav className="main-nav">
          {navLinks.map((l) => (
            <Link key={l.id} href={l.href} data-active={activeId === l.id}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="lang-switch lang-switch-desktop">
          <Link href={withLocale(pathname, "en")} data-active={lang === "en"}>
            EN
          </Link>
          <Link href={withLocale(pathname, "de")} data-active={lang === "de"}>
            DE
          </Link>
        </div>

        <Link href={`/${lang}/book`} className="btn btn-primary">
          {t.bookNow}
        </Link>

        <button
          className="btn btn-icon menu-btn"
          aria-label="Menu"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="mobile-menu">
          <div className="mobile-menu__top">
            <button className="btn btn-icon" aria-label="Close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
          {navLinks.map((l) => (
            <Link key={l.id} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="lang-switch">
            <Link href={withLocale(pathname, "en")} data-active={lang === "en"} onClick={() => setOpen(false)}>
              EN
            </Link>
            <Link href={withLocale(pathname, "de")} data-active={lang === "de"} onClick={() => setOpen(false)}>
              DE
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
