"use client";

import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type RouteMapProps = {
  coordinates: Array<[number, number]>; // [lat, lng]
  /** Speed in m/s per coordinate (length should match coordinates). Optional. */
  velocityStream?: number[];
  className?: string;
};

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;

const OSM_STYLE = {
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

const MAPTILER_STYLE_LIGHT = MAPTILER_KEY
  ? `https://api.maptiler.com/maps/streets-v2-light/style.json?key=${MAPTILER_KEY}`
  : null;
const MAPTILER_STYLE_DARK = MAPTILER_KEY
  ? `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}`
  : null;

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

function buildSegmentsGeoJson(
  coords: Array<[number, number]>,
  velocity?: number[],
) {
  if (!velocity || velocity.length === 0) {
    // Single LineString, no speed properties
    return {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "LineString" as const,
            coordinates: coords.map(([lat, lng]) => [lng, lat]),
          },
        },
      ],
    };
  }

  // Per-segment LineString, każdy z avg pace (sec/km) z dwóch krańcowych punktów
  const features = coords.slice(1).map((coord, i) => {
    const v1 = velocity[i] ?? 0;
    const v2 = velocity[i + 1] ?? v1;
    const avgVelocity = (v1 + v2) / 2;
    const paceSecPerKm = avgVelocity > 0.5 ? 1000 / avgVelocity : 600;
    return {
      type: "Feature" as const,
      properties: { pace: paceSecPerKm },
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [coords[i][1], coords[i][0]],
          [coord[1], coord[0]],
        ],
      },
    };
  });

  return { type: "FeatureCollection" as const, features };
}

function paceColorExpression(): unknown[] {
  // Pace breakpoints:
  // 3:00 (180s) — green ; 4:00 (240) — lime ; 5:00 (300) — yellow ;
  // 6:00 (360) — orange ; 7:00 (420) — red
  return [
    "interpolate",
    ["linear"],
    ["get", "pace"],
    180,
    "#22c55e",
    240,
    "#84cc16",
    300,
    "#eab308",
    360,
    "#f97316",
    420,
    "#ef4444",
  ];
}

export function RouteMap({
  coordinates,
  velocityStream,
  className = "",
}: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  const segmentsGeoJson = useMemo(
    () => buildSegmentsGeoJson(coordinates, velocityStream),
    [coordinates, velocityStream],
  );
  const bounds = useMemo(() => computeBounds(coordinates), [coordinates]);
  const hasGradient = !!velocityStream && velocityStream.length > 0;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!containerRef.current || coordinates.length < 2) return;

    const isDark = resolvedTheme === "dark";
    const style = MAPTILER_KEY
      ? isDark
        ? MAPTILER_STYLE_DARK!
        : MAPTILER_STYLE_LIGHT!
      : OSM_STYLE;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style,
      bounds: bounds ?? undefined,
      fitBoundsOptions: { padding: 50 },
      attributionControl: { compact: true },
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.addSource("route", { type: "geojson", data: segmentsGeoJson });

      map.addLayer({
        id: "route-shadow",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#000",
          "line-width": 8,
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
          "line-color": hasGradient
            ? (paceColorExpression() as unknown as string)
            : "#21316a",
          "line-width": 4,
        },
        layout: { "line-cap": "round", "line-join": "round" },
      });

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
  }, [coordinates, segmentsGeoJson, bounds, hasGradient, resolvedTheme]);

  // Fallback dark filter dla OSM raster (gdy nie ma MapTiler dark style)
  const filterClass =
    !MAPTILER_KEY && mounted && resolvedTheme === "dark"
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
    <div className="relative">
      <div
        ref={containerRef}
        className={`overflow-hidden rounded-xl border border-border ${filterClass} ${className}`}
      />
      {hasGradient ? <PaceLegend /> : null}
    </div>
  );
}

function PaceLegend() {
  return (
    <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex flex-col gap-1 rounded-lg border border-border bg-background/90 p-2.5 text-[10px] backdrop-blur sm:bottom-4 sm:left-4 sm:p-3 sm:text-xs">
      <p className="font-semibold uppercase tracking-wider text-muted-foreground">
        Tempo
      </p>
      <div className="flex items-center gap-2">
        <div
          className="h-2 w-24 rounded-full sm:w-28"
          style={{
            background:
              "linear-gradient(90deg, #22c55e 0%, #84cc16 25%, #eab308 50%, #f97316 75%, #ef4444 100%)",
          }}
        />
      </div>
      <div className="flex justify-between font-mono text-[9px] tabular-nums text-muted-foreground sm:text-[10px]">
        <span>3:00</span>
        <span>5:00</span>
        <span>7:00</span>
      </div>
    </div>
  );
}
