"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n/dictionaries";
import { setAdminLang } from "@/lib/actions/lang";

/** EN/DE toggle for admin pages outside the admin chrome (e.g. the login page). */
export default function LangSwitch({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(l: Lang) {
    if (l === lang) return;
    startTransition(async () => {
      await setAdminLang(l);
      router.refresh();
    });
  }

  return (
    <div className="lang-switch" role="group" aria-label="Language" aria-busy={pending}>
      {(["en", "de"] as const).map((l) => (
        <button key={l} type="button" className="seg-opt" data-on={lang === l} aria-pressed={lang === l} onClick={() => choose(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
