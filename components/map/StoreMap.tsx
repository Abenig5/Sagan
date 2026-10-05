"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { MapLocation } from "@/lib/settings";
import { OSM_ATTRIBUTION, OSM_TILES, loadLeaflet, logoPin } from "./leaflet";

/** Read-only storefront map for the contact page. */
export default function StoreMap({ location, label }: { location: MapLocation; label: string }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    loadLeaflet().then((L) => {
      if (cancelled || !el.current) return;
      map = L.map(el.current, { scrollWheelZoom: false }).setView([location.lat, location.lng], location.zoom);
      L.tileLayer(OSM_TILES, { maxZoom: 19, attribution: OSM_ATTRIBUTION }).addTo(map);
      L.marker([location.lat, location.lng], { icon: logoPin(L), title: label, keyboard: false }).addTo(map);
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [location.lat, location.lng, location.zoom, label]);

  return <div ref={el} className="store-map" role="img" aria-label={label} />;
}
