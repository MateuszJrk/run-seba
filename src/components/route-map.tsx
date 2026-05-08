"use client";

import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type RouteMapProps = {
  coordinates: Array<[number, number]>; // [lat, lng]
  className?: string;
};

const LIGHT_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: "raster" as const,
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  layers: [{ id: "osm", type: "raster" as const, source: "osm" }],
};

function computeBounds(
  coords: Array<[number, number]>,
): [[number, number], [number, number]] | null {
  if (coords.length === 0) return null;
  let minLat = coords[0][0],
    maxLat = coords[0][0],
    minLng = coords[0][1],
    maxLng = coords[0][1];
  for (const [lat, lng] of coords) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

export function RouteMap({ coordinates, className = "" }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // GeoJSON LineString z [lat, lng] → [lng, lat]
  const geoJson = useMemo(
    () => ({
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: coordinates.map(([lat, lng]) => [lng, lat]),
      },
    }),
    [coordinates],
  );

  const bounds = useMemo(() => computeBounds(coordinates), [coordinates]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!containerRef.current || coordinates.length < 2) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: LIGHT_STYLE,
      bounds: bounds ?? undefined,
      fitBoundsOptions: { padding: 50 },
      attributionControl: { compact: true },
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.addSource("route", { type: "geojson", data: geoJson });
      map.addLayer({
        id: "route-shadow",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#000",
          "line-width": 7,
          "line-opacity": 0.18,
          "line-blur": 3,
        },
        layout: { "line-cap": "round", "line-join": "round" },
      });
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#21316a",
          "line-width": 4,
        },
        layout: { "line-cap": "round", "line-join": "round" },
      });

      // Markers start/end
      const start = coordinates[0];
      const end = coordinates[coordinates.length - 1];
      const startEl = document.createElement("div");
      startEl.className =
        "size-3 rounded-full bg-running ring-2 ring-white shadow";
      const endEl = document.createElement("div");
      endEl.className =
        "size-3 rounded-full bg-foreground ring-2 ring-white shadow";

      new maplibregl.Marker({ element: startEl })
        .setLngLat([start[1], start[0]])
        .addTo(map);
      new maplibregl.Marker({ element: endEl })
        .setLngLat([end[1], end[0]])
        .addTo(map);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [coordinates, geoJson, bounds]);

  // Dark mode: invert tile colors via CSS filter
  const filterClass =
    mounted && resolvedTheme === "dark"
      ? "[&_.maplibregl-canvas]:invert [&_.maplibregl-canvas]:hue-rotate-180 [&_.maplibregl-canvas]:contrast-90 [&_.maplibregl-canvas]:saturate-50"
      : "";

  if (coordinates.length < 2) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-border bg-muted text-sm text-muted-foreground ${className}`}
      >
        Brak danych mapy dla tej aktywności.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-xl border border-border ${filterClass} ${className}`}
    />
  );
}
