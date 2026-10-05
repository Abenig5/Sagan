export interface HoursDay {
  open: boolean;
  from: string; // HH:mm
  to: string; // HH:mm
}

// Index 0 = Sunday, matching JS Date#getDay().
export const DEFAULT_HOURS: HoursDay[] = [
  { open: false, from: "09:00", to: "18:00" }, // Sun
  { open: false, from: "09:00", to: "18:00" }, // Mon
  { open: true, from: "09:00", to: "18:30" }, // Tue
  { open: true, from: "09:00", to: "18:30" }, // Wed
  { open: true, from: "09:00", to: "18:30" }, // Thu
  { open: true, from: "09:00", to: "18:30" }, // Fri
  { open: true, from: "08:00", to: "15:00" }, // Sat
];

export const DEFAULT_SLOT_MINUTES = 30;
export const DEFAULT_LAST_BEFORE_CLOSE_MINUTES = 60;
export const DEFAULT_BOOKING_WINDOW_WEEKS = 8;
export const DEFAULT_HERO_LOGO = "monogram" as const;

export const LOGOS: Record<string, string> = {
  monogram: "/assets/logo-monogram.png",
  dark: "/assets/logo-dark.png",
  script: "/assets/logo-script.png",
};

export const BOOKING_START_TIMES: string[] = (() => {
  const out: string[] = [];
  for (let m = 360; m <= 1320; m += 30) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return out;
})();
