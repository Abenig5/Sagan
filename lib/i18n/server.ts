import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES, type Lang } from "./dictionaries";

export async function getAdminLang(): Promise<Lang> {
  const store = await cookies();
  const value = store.get("sagan-lang")?.value;
  return LOCALES.includes(value as Lang) ? (value as Lang) : DEFAULT_LOCALE;
}
