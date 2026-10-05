// Service catalogue — source of truth ported from the design prototype's
// `CATS` / `SERVICES` arrays. Business data, not meant to change via the
// admin UI, so it lives in code rather than the database.

export type CategoryId = "women" | "men" | "kids" | "makeup" | "brows";
export type Lang = "en" | "de";
export type ServiceGroup = "cut" | "col" | "perm" | "girls" | "boys" | null;

export type ServicePricing =
  | { kind: "length"; short: number; medium: number; long: number }
  | { kind: "fixed"; amount: number }
  | { kind: "hourly"; perHour: number };

export interface Category {
  id: CategoryId;
  kind: "hair" | "beauty";
  en: [name: string, blurb: string];
  de: [name: string, blurb: string];
}

export interface Service {
  id: string;
  categoryId: CategoryId;
  group: ServiceGroup;
  nameEn: string;
  nameDe: string;
  pricing: ServicePricing;
}

export const CATEGORIES: Category[] = [
  {
    id: "women",
    kind: "hair",
    en: ["Women", "Cut, styling, colour and perms, priced by hair length."],
    de: ["Damen", "Schnitt, Styling, Farbe und Dauerwelle, nach Haarlänge."],
  },
  {
    id: "men",
    kind: "hair",
    en: ["Men", "Wash and cut, wet or dry cuts, clipper cuts and contours."],
    de: ["Herren", "Waschen und Schneiden, nass oder trocken, Maschine und Konturen."],
  },
  {
    id: "kids",
    kind: "hair",
    en: ["Children", "Wash, cut and blow-dry for girls and boys up to 14."],
    de: ["Kinder", "Waschen, Schneiden, Föhnen für Mädchen und Knaben bis 14."],
  },
  {
    id: "makeup",
    kind: "beauty",
    en: ["Make-up", "Day, event and stage make-up."],
    de: ["Make-up", "Tages-, Event- und Bühnen-Make-up."],
  },
  {
    id: "brows",
    kind: "beauty",
    en: ["Brows & Lashes", "Brow shaping and tinting for brows and lashes."],
    de: ["Brauen & Wimpern", "Augenbrauen zupfen, Brauen und Wimpern färben."],
  },
];

export const GROUP_NAMES: Record<Exclude<ServiceGroup, null>, [string, string]> = {
  cut: ["Cut & style", "Schneiden & Styling"],
  col: ["Colour", "Farbe"],
  perm: ["Perm", "Dauerwelle"],
  girls: ["Girls", "Mädchen"],
  boys: ["Boys", "Knaben"],
};

const length = (short: number, medium: number, long: number): ServicePricing => ({
  kind: "length",
  short,
  medium,
  long,
});
const fixed = (amount: number): ServicePricing => ({ kind: "fixed", amount });
const hourly = (perHour: number): ServicePricing => ({ kind: "hourly", perHour });

const kidName = (age: string): [string, string] => [
  `Wash, cut, blow-dry · ${age} years`,
  `${age} J Waschen, Schneiden, Föhnen`,
];

export const SERVICES: Service[] = [
  { id: "w1", categoryId: "women", group: "cut", nameEn: "Wash, cut, blow-dry", nameDe: "Waschen, Schneiden, Föhnen", pricing: length(100, 110, 120) },
  { id: "w2", categoryId: "women", group: "cut", nameEn: "Wash, cut", nameDe: "Waschen, Schneiden", pricing: length(80, 85, 90) },
  { id: "w3", categoryId: "women", group: "cut", nameEn: "Wash, blow-dry or set", nameDe: "Waschen, Föhnen oder Legen", pricing: length(60, 70, 75) },
  { id: "w4", categoryId: "women", group: "cut", nameEn: "Updo", nameDe: "Hochsteckfrisur", pricing: hourly(90) },
  { id: "w5", categoryId: "women", group: "col", nameEn: "Root colour", nameDe: "Ansatz Färben", pricing: length(75, 85, 85) },
  { id: "w6", categoryId: "women", group: "col", nameEn: "Full colour", nameDe: "Färben neu", pricing: length(85, 100, 100) },
  { id: "w7", categoryId: "women", group: "col", nameEn: "Intensive toning", nameDe: "Intensivtönung", pricing: length(55, 70, 70) },
  { id: "w8", categoryId: "women", group: "col", nameEn: "Full foil highlights", nameDe: "Mech Folien ganz", pricing: length(120, 130, 140) },
  { id: "w9", categoryId: "women", group: "col", nameEn: "Highlights, balayage", nameDe: "Meches, Balayage", pricing: hourly(90) },
  { id: "w10", categoryId: "women", group: "col", nameEn: "Bleaching", nameDe: "Blondieren", pricing: hourly(90) },
  { id: "w11", categoryId: "women", group: "perm", nameEn: "Perm with cut", nameDe: "Dauerwelle, Schneiden", pricing: fixed(190) },
  { id: "w12", categoryId: "women", group: "perm", nameEn: "Perm without cut", nameDe: "Dauerwelle ohne Schnitt", pricing: fixed(150) },
  { id: "m1", categoryId: "men", group: null, nameEn: "Wash, cut", nameDe: "Waschen, Schneiden", pricing: fixed(55) },
  { id: "m2", categoryId: "men", group: null, nameEn: "Wet cut", nameDe: "Nass Schneiden", pricing: fixed(50) },
  { id: "m3", categoryId: "men", group: null, nameEn: "Dry cut", nameDe: "Trocken Schneiden", pricing: fixed(45) },
  { id: "m4", categoryId: "men", group: null, nameEn: "Clipper cut", nameDe: "Maschine", pricing: fixed(40) },
  { id: "m5", categoryId: "men", group: null, nameEn: "Contours", nameDe: "Konturen", pricing: fixed(30) },
  { id: "k1", categoryId: "kids", group: "girls", nameEn: kidName("0–3")[0], nameDe: kidName("0–3")[1], pricing: fixed(20) },
  { id: "k2", categoryId: "kids", group: "girls", nameEn: kidName("4–6")[0], nameDe: kidName("4–6")[1], pricing: fixed(25) },
  { id: "k3", categoryId: "kids", group: "girls", nameEn: kidName("7–14")[0], nameDe: kidName("7–14")[1], pricing: fixed(45) },
  { id: "k4", categoryId: "kids", group: "boys", nameEn: kidName("0–3")[0], nameDe: kidName("0–3")[1], pricing: fixed(20) },
  { id: "k5", categoryId: "kids", group: "boys", nameEn: kidName("4–6")[0], nameDe: kidName("4–6")[1], pricing: fixed(25) },
  { id: "k6", categoryId: "kids", group: "boys", nameEn: kidName("7–14")[0], nameDe: kidName("7–14")[1], pricing: fixed(40) },
  { id: "u1", categoryId: "makeup", group: null, nameEn: "Day make-up", nameDe: "Tages Make-up", pricing: fixed(90) },
  { id: "u2", categoryId: "makeup", group: null, nameEn: "Festive or event make-up", nameDe: "Festliches oder Event Make-up", pricing: fixed(120) },
  { id: "u3", categoryId: "makeup", group: null, nameEn: "Stage make-up", nameDe: "Bühnen Make-up", pricing: fixed(150) },
  { id: "b1", categoryId: "brows", group: null, nameEn: "Eyebrow shaping", nameDe: "Augenbrauen Zupfen", pricing: fixed(25) },
  { id: "b2", categoryId: "brows", group: null, nameEn: "Lash tint", nameDe: "Wimpern Färben", pricing: fixed(20) },
  { id: "b3", categoryId: "brows", group: null, nameEn: "Brow tint", nameDe: "Brauen Färben", pricing: fixed(20) },
  { id: "b4", categoryId: "brows", group: null, nameEn: "Brow & lash tint", nameDe: "Brauen & Wimpern Färben", pricing: fixed(30) },
];

export function getCategory(id: CategoryId): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getService(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id);
}

export function categoryName(id: CategoryId, lang: Lang): string {
  return getCategory(id)?.[lang][0] ?? "—";
}

export function serviceName(service: Service, lang: Lang): string {
  return lang === "en" ? service.nameEn : service.nameDe;
}

export function minPrice(service: Service): number {
  const p = service.pricing;
  if (p.kind === "length") return Math.min(p.short, p.medium, p.long);
  if (p.kind === "hourly") return p.perHour;
  return p.amount;
}

export function fromPriceForCategory(categoryId: CategoryId): number {
  return Math.min(...SERVICES.filter((s) => s.categoryId === categoryId).map(minPrice));
}

const chf = (n: number) => `${n}.–`;

/** Price for a single selected hair length (0 short / 1 medium / 2 long), or the flat/hourly price. */
export function priceLabel(service: Service, lang: Lang, hairLength: number | null, perHourSuffix: string): string {
  const p = service.pricing;
  if (p.kind === "length") {
    const vals = [p.short, p.medium, p.long];
    return `CHF ${chf(vals[hairLength ?? 0])}`;
  }
  if (p.kind === "hourly") return `CHF ${chf(p.perHour)} ${perHourSuffix}`;
  return `CHF ${chf(p.amount)}`;
}

/** Price range label for list views, e.g. "80.– – 90.–" or "90.– per hour". */
export function priceRangeLabel(service: Service, perHourSuffix: string): string {
  const p = service.pricing;
  if (p.kind === "length") {
    const vals = [p.short, p.medium, p.long];
    return `${chf(Math.min(...vals))} – ${chf(Math.max(...vals))}`;
  }
  if (p.kind === "hourly") return `${chf(p.perHour)} ${perHourSuffix}`;
  return chf(p.amount);
}

export function formatCHF(n: number): string {
  return chf(n);
}

export function groupedServices(categoryId: CategoryId): Array<{ group: ServiceGroup; items: Service[] }> {
  const out: Array<{ group: ServiceGroup; items: Service[] }> = [];
  for (const s of SERVICES.filter((s) => s.categoryId === categoryId)) {
    let bucket = out.find((g) => g.group === s.group);
    if (!bucket) {
      bucket = { group: s.group, items: [] };
      out.push(bucket);
    }
    bucket.items.push(s);
  }
  return out;
}
