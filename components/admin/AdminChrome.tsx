"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { getDictionary, type Lang } from "@/lib/i18n/dictionaries";
import { setAdminLang } from "@/lib/actions/lang";
import PoweredBy from "@/components/PoweredBy";

const TABS = [
  { id: "bookings", href: "/admin/bookings" },
  { id: "availability", href: "/admin/availability" },
  { id: "settings", href: "/admin/settings" },
];

export default function AdminChrome({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const t = getDictionary(lang);
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return <>{children}</>;

  const active = pathname.split("/")[2] ?? "bookings";

  async function switchLang(l: Lang) {
    await setAdminLang(l);
    router.refresh();
  }

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <div className="admin-header__row">
          <div className="brand">
            <img src="/assets/monogram-mark.png" alt="" style={{ width: 38, height: 38 }} />
            <span>
              <span className="brand-word" style={{ display: "block", fontSize: 16 }}>
                SAGAN BEAUTY
              </span>
              <span className="brand-sub">{t.adminSub}</span>
            </span>
          </div>
          <div className="lang-switch" style={{ borderColor: "#444" }}>
            <button className="seg-opt" data-on={lang === "en"} onClick={() => switchLang("en")} style={{ color: lang === "en" ? "var(--color-accent-300)" : "#9b938b" }}>
              EN
            </button>
            <button className="seg-opt" data-on={lang === "de"} onClick={() => switchLang("de")} style={{ color: lang === "de" ? "var(--color-accent-300)" : "#9b938b" }}>
              DE
            </button>
          </div>
          <Link href={`/${lang}`} className="btn btn-ghost" style={{ color: "#efe7de" }}>
            {t.viewSite} →
          </Link>
          <button className="btn btn-secondary" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
            {t.logout}
          </button>
        </div>
        <div className="admin-tabs">
          {TABS.map((tab, i) => (
            <Link key={tab.id} href={tab.href} className="admin-tab" data-active={active === tab.id}>
              {t.tabs[i]}
            </Link>
          ))}
        </div>
      </div>
      <div className="admin-main">{children}</div>
      <footer className="admin-footer">
        <PoweredBy />
      </footer>
    </div>
  );
}
