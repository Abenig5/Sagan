"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { getDictionary, type Dictionary, type Lang } from "@/lib/i18n/dictionaries";
import { setAdminLang } from "@/lib/actions/lang";
import PoweredBy from "@/components/PoweredBy";

type NavKey = keyof Dictionary["adminNav"];

/** Admin navigation, grouped by what the admin is managing. */
const GROUPS: { items: { key: NavKey; href: string; icon: keyof typeof ICONS }[] }[] = [
  {
    items: [
      { key: "bookings", href: "/admin/bookings", icon: "inbox" },
      { key: "calendar", href: "/admin/availability", icon: "calendar" },
      { key: "closures", href: "/admin/closures", icon: "sun" },
    ],
  },
  {
    items: [
      { key: "photos", href: "/admin/photos", icon: "image" },
      { key: "location", href: "/admin/location", icon: "pin" },
      { key: "logo", href: "/admin/appearance", icon: "sparkle" },
    ],
  },
  {
    items: [
      { key: "hours", href: "/admin/hours", icon: "clock" },
      { key: "rules", href: "/admin/booking-rules", icon: "sliders" },
    ],
  },
];

export default function AdminChrome({
  lang,
  pendingCount,
  children,
}: {
  lang: Lang;
  pendingCount: number;
  children: React.ReactNode;
}) {
  const t = getDictionary(lang);
  const pathname = usePathname();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);

  useEffect(() => setDrawer(false), [pathname]);

  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  if (pathname === "/admin/login") return <>{children}</>;

  const current = GROUPS.flatMap((g) => g.items).find((i) => pathname.startsWith(i.href));

  async function switchLang(l: Lang) {
    if (l === lang) return;
    await setAdminLang(l);
    router.refresh();
  }

  const sidebar = (
    <>
      <div className="admin-side__brand">
        <img src="/assets/monogram-mark.png" alt="" />
        <span>
          <span className="admin-side__name">SAGAN BEAUTY</span>
          <span className="admin-side__sub">{t.adminSub}</span>
        </span>
        <button type="button" className="admin-side__close" aria-label={t.closeL} onClick={() => setDrawer(false)}>
          ✕
        </button>
      </div>

      <nav className="admin-nav" aria-label={t.adminMenu}>
        {GROUPS.map((g, gi) => (
          <div key={gi} className="admin-nav__group">
            <div className="admin-nav__label">{t.adminGroups[gi]}</div>
            {g.items.map((item) => {
              const active = current?.key === item.key;
              return (
                <Link key={item.key} href={item.href} className="admin-nav__item" aria-current={active ? "page" : undefined}>
                  <Icon name={item.icon} />
                  <span>{t.adminNav[item.key]}</span>
                  {item.key === "bookings" && pendingCount > 0 && (
                    <span className="admin-nav__badge" title={t.pendingBadge(pendingCount)} aria-label={t.pendingBadge(pendingCount)}>
                      {pendingCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="admin-side__foot">
        <div className="admin-lang" role="group" aria-label="Language">
          {(["en", "de"] as const).map((l) => (
            <button key={l} type="button" data-on={lang === l} aria-pressed={lang === l} onClick={() => switchLang(l)}>
              {l === "en" ? "English" : "Deutsch"}
            </button>
          ))}
        </div>
        <Link href={`/${lang}`} className="admin-side__link" target="_blank">
          <Icon name="external" />
          <span>{t.viewSite}</span>
        </Link>
        <button type="button" className="admin-side__link" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
          <Icon name="logout" />
          <span>{t.logout}</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="admin-shell">
      <aside className="admin-side" data-open={drawer}>
        {sidebar}
      </aside>
      {drawer && <div className="admin-scrim" onClick={() => setDrawer(false)} aria-hidden="true" />}

      <div className="admin-body">
        <header className="admin-topbar">
          <button type="button" className="admin-topbar__menu" aria-label={t.adminMenu} aria-expanded={drawer} onClick={() => setDrawer(true)}>
            <Icon name="menu" />
          </button>
          <span className="admin-topbar__title">{current ? t.adminNav[current.key] : "SAGAN BEAUTY"}</span>
          {pendingCount > 0 && current?.key !== "bookings" ? (
            <Link href="/admin/bookings" className="admin-nav__badge" aria-label={t.pendingBadge(pendingCount)}>
              {pendingCount}
            </Link>
          ) : (
            <img src="/assets/monogram-mark.png" alt="" className="admin-topbar__logo" />
          )}
        </header>
        <main className="admin-main">{children}</main>
        <footer className="admin-footer">
          <PoweredBy />
        </footer>
      </div>
    </div>
  );
}

const ICONS = {
  inbox: "M4 13h4l2 3h4l2-3h4M5 5h14l1 8v6H4v-6z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  sun: "M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  image: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9.5a1.5 1.5 0 100-.01",
  pin: "M12 21s-6-5.6-6-11a6 6 0 1112 0c0 5.4-6 11-6 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z",
  clock: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2",
  sliders: "M4 7h10M18 7h2M4 17h4M12 17h8M14 5v4M8 15v4",
  external: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
  menu: "M4 7h16M4 12h16M4 17h16",
};

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg className="admin-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICONS[name]} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
