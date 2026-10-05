"use server";

import { cookies } from "next/headers";
import type { Lang } from "@/lib/i18n/dictionaries";

export async function setAdminLang(lang: Lang) {
  const store = await cookies();
  store.set("sagan-lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
}
