"use client";

import { useEffect, useState } from "react";
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

  // While the phone menu is open, stop the page behind it from scrolling and let Esc close it.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const navLinks = NAV_IDS.map((id, i) => ({
    id,
    label: t.nav[i],
    href: withLocale(`/${lang}/${id}`, lang),
  }));

  return (
    <header className="site-header">
      <div className="site-header__row">
        <Link href={`/${lang}`} className="brand">
          <img src="/assets/monogram-mark.png" alt="" />
          <span className="brand-word">SAGAN BEAUTY</span>
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
          <span className="label-long">{t.bookNow}</span>
          <span className="label-short">{t.bookShort}</span>
        </Link>

        <button
          className="btn btn-icon menu-btn"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mobile-menu__top">
            <Link href={`/${lang}`} className="brand" onClick={() => setOpen(false)}>
              <img src="/assets/monogram-mark.png" alt="" />
              <span className="brand-word">SAGAN BEAUTY</span>
            </Link>
            <button className="btn btn-icon" aria-label="Close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
          <nav className="mobile-menu__nav">
            {navLinks.map((l) => (
              <Link key={l.id} href={l.href} data-active={activeId === l.id} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href={`/${lang}/book`} className="btn btn-primary btn-block" onClick={() => setOpen(false)}>
            {t.bookNow}
          </Link>
          <div className="lang-switch" style={{ alignSelf: "flex-start" }}>
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
