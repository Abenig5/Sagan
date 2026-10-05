import type * as Leaflet from "leaflet";

export const OSM_TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors';

/** Default view (Zürich) for the admin picker before any location has been set. */
export const FALLBACK_VIEW = { lat: 47.3769, lng: 8.5417, zoom: 13 };

/** Leaflet touches `window` on import, so it is only ever loaded in the browser. */
export async function loadLeaflet(): Promise<typeof Leaflet> {
  const mod = await import("leaflet");
  return (mod as unknown as { default?: typeof Leaflet }).default ?? mod;
}

/** Teardrop map pin carrying the salon monogram. The tip sits on the exact location. */
export function logoPin(L: typeof Leaflet) {
  return L.divIcon({
    className: "map-pin",
    html: '<span class="map-pin__drop"><img src="/assets/monogram-mark.png" alt="" /></span>',
    iconSize: [48, 48],
    iconAnchor: [24, 58],
    popupAnchor: [0, -54],
  });
}

export function osmLink(lat: number, lng: number, zoom = 17) {
  return `https://www.openstreetmap.org/?mlat=${lat.toFixed(6)}&mlon=${lng.toFixed(6)}#map=${zoom}/${lat.toFixed(6)}/${lng.toFixed(6)}`;
}
