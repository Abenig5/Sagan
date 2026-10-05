"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import type { Dictionary, Lang } from "@/lib/i18n/dictionaries";
import type { MapLocation } from "@/lib/settings";
import { FALLBACK_VIEW, OSM_ATTRIBUTION, OSM_TILES, loadLeaflet, logoPin, osmLink } from "@/components/map/leaflet";

interface SearchHit {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

/**
 * Lets an admin place the storefront pin: search an address (OpenStreetMap Nominatim),
 * click the map, or drag the pin. Every placement is saved straight away via `onChange`.
 */
export default function LocationPicker({
  lang,
  t,
  value,
  onChange,
}: {
  lang: Lang;
  t: Dictionary;
  value: MapLocation | null;
  onChange: (loc: MapLocation | null) => void;
}) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map>();
  const markerRef = useRef<Leaflet.Marker>();
  const leafletRef = useRef<typeof Leaflet>();
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[] | null>(null);
  const [searching, setSearching] = useState(false);

  // Places (or moves) the pin and reports the new location.
  function place(lat: number, lng: number, zoom?: number) {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    if (zoom !== undefined) map.setView([lat, lng], zoom);
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const marker = L.marker([lat, lng], { icon: logoPin(L), draggable: true, autoPan: true }).addTo(map);
      marker.on("dragend", () => {
        const p = marker.getLatLng();
        onChangeRef.current({ lat: p.lat, lng: p.lng, zoom: map.getZoom() });
      });
      markerRef.current = marker;
    }
    onChangeRef.current({ lat, lng, zoom: map.getZoom() });
  }

  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((L) => {
      if (cancelled || !el.current) return;
      leafletRef.current = L;
      const start = value ?? FALLBACK_VIEW;
      const map = L.map(el.current).setView([start.lat, start.lng], start.zoom);
      L.tileLayer(OSM_TILES, { maxZoom: 19, attribution: OSM_ATTRIBUTION }).addTo(map);
      mapRef.current = map;

      if (value) {
        const marker = L.marker([value.lat, value.lng], { icon: logoPin(L), draggable: true, autoPan: true }).addTo(map);
        marker.on("dragend", () => {
          const p = marker.getLatLng();
          onChangeRef.current({ lat: p.lat, lng: p.lng, zoom: map.getZoom() });
        });
        markerRef.current = marker;
      }

      map.on("click", (e: Leaflet.LeafletMouseEvent) => place(e.latlng.lat, e.latlng.lng));
      // Remember the zoom level the admin settles on, so the public map opens the same way.
      map.on("zoomend", () => {
        const m = markerRef.current;
        if (!m) return;
        const p = m.getLatLng();
        onChangeRef.current({ lat: p.lat, lng: p.lng, zoom: map.getZoom() });
      });
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = undefined;
      markerRef.current = undefined;
    };
    // The map is created once; later changes flow from the map to `onChange`, not back.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&accept-language=${lang}&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      setHits(res.ok ? ((await res.json()) as SearchHit[]) : []);
    } catch {
      setHits([]);
    } finally {
      setSearching(false);
    }
  }

  function clear() {
    markerRef.current?.remove();
    markerRef.current = undefined;
    onChange(null);
  }

  return (
    <div className="location-picker">
      <form className="location-search" onSubmit={search}>
        <input
          className="input"
          type="search"
          placeholder={t.mapSearchPh}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHits(null);
          }}
        />
        <button className="btn btn-secondary" type="submit" disabled={searching || !query.trim()}>
          {searching ? "…" : t.mapSearch}
        </button>
      </form>

      {hits && (
        <div className="location-hits">
          {hits.length === 0 ? (
            <p className="vat-note" style={{ margin: 0, padding: "10px 12px" }}>{t.mapNoResults}</p>
          ) : (
            hits.map((h) => (
              <button
                key={h.place_id}
                type="button"
                className="location-hit"
                onClick={() => {
                  place(Number(h.lat), Number(h.lon), 17);
                  setHits(null);
                }}
              >
                {h.display_name}
              </button>
            ))
          )}
        </div>
      )}

      <div ref={el} className="store-map store-map--admin" />

      <div className="location-meta">
        <span className="vat-note tabular-nums" style={{ margin: 0 }}>
          {value ? `${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}` : t.mapNotSet}
        </span>
        {value && (
          <span style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a className="btn btn-ghost btn-sm" href={osmLink(value.lat, value.lng, value.zoom)} target="_blank" rel="noreferrer">
              {t.openMap} ↗
            </a>
            <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>
              {t.mapClear}
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
