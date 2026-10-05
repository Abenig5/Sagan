import type { Settings } from "@prisma/client";
import { prisma } from "./prisma";
import {
  DEFAULT_BOOKING_WINDOW_WEEKS,
  DEFAULT_HERO_LOGO,
  DEFAULT_HOURS,
  DEFAULT_LAST_BEFORE_CLOSE_MINUTES,
  DEFAULT_SLOT_MINUTES,
  type HoursDay,
} from "./data/defaults";
import type { AvailabilityConfig } from "./availability";

export interface MapLocation {
  lat: number;
  lng: number;
  zoom: number;
}

export interface SalonSettings extends AvailabilityConfig {
  heroLogo: string;
  /** Storefront pin for the contact page map; null until an admin sets it. */
  map: MapLocation | null;
}

function toSettings(row: Settings): SalonSettings {
  return {
    hours: row.hours as unknown as HoursDay[],
    slotMinutes: row.slotMinutes,
    lastBeforeCloseMinutes: row.lastBeforeCloseMinutes,
    bookingWindowWeeks: row.bookingWindowWeeks,
    heroLogo: row.heroLogo,
    map: row.mapLat !== null && row.mapLng !== null ? { lat: row.mapLat, lng: row.mapLng, zoom: row.mapZoom } : null,
  };
}

/** Reads the single settings row, creating it with defaults on first use. */
export async function getSettings(): Promise<SalonSettings> {
  const row = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      hours: DEFAULT_HOURS as unknown as object,
      slotMinutes: DEFAULT_SLOT_MINUTES,
      lastBeforeCloseMinutes: DEFAULT_LAST_BEFORE_CLOSE_MINUTES,
      bookingWindowWeeks: DEFAULT_BOOKING_WINDOW_WEEKS,
      heroLogo: DEFAULT_HERO_LOGO,
    },
  });
  return toSettings(row);
}

export interface SettingsPatch {
  hours?: HoursDay[];
  slotMinutes?: number;
  lastBeforeCloseMinutes?: number;
  bookingWindowWeeks?: number;
  heroLogo?: string;
  map?: MapLocation | null;
}

function validMap(m: MapLocation): boolean {
  return (
    Number.isFinite(m.lat) && Math.abs(m.lat) <= 90 &&
    Number.isFinite(m.lng) && Math.abs(m.lng) <= 180 &&
    Number.isInteger(m.zoom) && m.zoom >= 3 && m.zoom <= 19
  );
}

export async function updateSettings(patch: SettingsPatch): Promise<SalonSettings> {
  await getSettings(); // ensure row exists
  const row = await prisma.settings.update({
    where: { id: 1 },
    data: {
      ...(patch.hours ? { hours: patch.hours as unknown as object } : {}),
      ...(patch.slotMinutes !== undefined ? { slotMinutes: patch.slotMinutes } : {}),
      ...(patch.lastBeforeCloseMinutes !== undefined
        ? { lastBeforeCloseMinutes: patch.lastBeforeCloseMinutes }
        : {}),
      ...(patch.bookingWindowWeeks !== undefined ? { bookingWindowWeeks: patch.bookingWindowWeeks } : {}),
      ...(patch.heroLogo ? { heroLogo: patch.heroLogo as any } : {}),
      ...(patch.map === null ? { mapLat: null, mapLng: null } : {}),
      ...(patch.map && validMap(patch.map) ? { mapLat: patch.map.lat, mapLng: patch.map.lng, mapZoom: patch.map.zoom } : {}),
    },
  });
  return toSettings(row);
}

export async function resetSettings(): Promise<SalonSettings> {
  const row = await prisma.settings.update({
    where: { id: 1 },
    data: {
      hours: DEFAULT_HOURS as unknown as object,
      slotMinutes: DEFAULT_SLOT_MINUTES,
      lastBeforeCloseMinutes: DEFAULT_LAST_BEFORE_CLOSE_MINUTES,
      bookingWindowWeeks: DEFAULT_BOOKING_WINDOW_WEEKS,
      heroLogo: DEFAULT_HERO_LOGO,
    },
  });
  return toSettings(row);
}
