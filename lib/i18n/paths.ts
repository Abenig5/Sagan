import type { Lang } from "./dictionaries";

export const PUBLIC_PAGES = ["", "services", "book", "about", "contact"] as const;

/** Swaps the locale segment of a pathname like "/de/services" -> "/en/services". */
export function withLocale(pathname: string, locale: Lang): string {
  const parts = pathname.split("/").filter(Boolean);
  parts[0] = locale;
  return `/${parts.join("/")}`;
}

export function currentPageId(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  return parts[1] ?? "home";
}
