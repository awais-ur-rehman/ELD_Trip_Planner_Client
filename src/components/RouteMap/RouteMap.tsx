import { useEffect, useMemo } from "react";
import { Box, Typography, LinearProgress, GlobalStyles } from "@mui/material";
import { LocalShipping as LocalShippingIcon } from "@mui/icons-material";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { RoutePolyline } from "./RoutePolyline";
import { StopMarker } from "./StopMarker";
import { MapTabSwitcher } from "./MapTabSwitcher";
import type { TripPlan, Stop, RouteGeometry } from "@/types/trip";
import "leaflet/dist/leaflet.css";

// ── Leg colors ──────────────────────────────────────────────────────────────
// Leg 1 (empty truck → pickup): green, matching origin stop marker
// Leg 2 (loaded truck → dropoff): amber, matching FeaturedRouteCard + pickup stop
const LEG1_COLOR = "#10B981";
const LEG2_COLOR = "#F5A524";

// ── Route helpers ────────────────────────────────────────────────────────────

/** Split GeoJSON coordinates at the point closest to (pickupLat, pickupLng). */
function splitRouteAtPickup(
  geometry: RouteGeometry,
  pickupLat: number,
  pickupLng: number,
): { leg1: [number, number][]; leg2: [number, number][] } {
  const coords = geometry.coordinates as [number, number][];
  let minDist = Infinity;
  let splitIdx = 0;

  coords.forEach(([lng, lat], i) => {
    const d = Math.hypot(lat - pickupLat, lng - pickupLng);
    if (d < minDist) {
      minDist = d;
      splitIdx = i;
    }
  });

  return {
    leg1: coords.slice(0, splitIdx + 1),
    leg2: coords.slice(splitIdx),
  };
}

/**
 * Walk along GeoJSON [lng, lat] coords and return the interpolated point
 * at the given fraction (0–1) of the total path length.
 */
function pointAtFraction(
  coords: [number, number][],
  frac: number,
): [number, number] {
  if (coords.length === 0) return [0, 0];
  if (frac <= 0) return coords[0];
  if (frac >= 1) return coords[coords.length - 1];

  const lens: number[] = [];
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    const d = Math.hypot(
      coords[i][0] - coords[i - 1][0],
      coords[i][1] - coords[i - 1][1],
    );
    lens.push(d);
    total += d;
  }

  let target = frac * total;
  let cum = 0;
  for (let i = 0; i < lens.length; i++) {
    if (cum + lens[i] >= target) {
      const t = (target - cum) / lens[i];
      return [
        coords[i][0] + t * (coords[i + 1][0] - coords[i][0]),
        coords[i][1] + t * (coords[i + 1][1] - coords[i][1]),
      ];
    }
    cum += lens[i];
  }
  return coords[coords.length - 1];
}

/**
 * Re-project intermediate stops (fuel / rest / break) onto the actual route
 * geometry using their arrival time as a fraction of total trip time.
 *
 * Main stops (current / pickup / dropoff) keep their real geocoded coordinates.
 * This solves the "all intermediates stack at destination" problem that occurs
 * when the HOS engine shares coordinates with a nearby main stop.
 */
function projectIntermediateStops(
  stops: Stop[],
  geometry: RouteGeometry,
): Stop[] {
  if (stops.length < 2) return stops;

  const coords = geometry.coordinates as [number, number][];
  const startMs = new Date(stops[0].arrival_time_iso).getTime();
  const endMs = new Date(stops[stops.length - 1].arrival_time_iso).getTime();
  const totalMs = endMs - startMs;

  if (totalMs <= 0) return stops;

  return stops.map((stop) => {
    if (["current", "pickup", "dropoff"].includes(stop.type)) return stop;

    const elapsed = new Date(stop.arrival_time_iso).getTime() - startMs;
    const frac = Math.max(0, Math.min(1, elapsed / totalMs));
    const [lng, lat] = pointAtFraction(coords, frac);
    return { ...stop, lat, lng };
  });
}

// ── Map tile / popup config ──────────────────────────────────────────────────

const CARTO_TILES =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const CARTO_ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>';

const LEAFLET_POPUP_RESET = (
  <GlobalStyles
    styles={{
      ".leaflet-popup-content-wrapper": {
        padding: 0,
        borderRadius: "0px",
        border: "1px solid #D5DEE3",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        overflow: "hidden",
      },
      ".leaflet-popup-content": {
        margin: 0,
        width: "auto !important",
      },
      ".leaflet-popup-tip-container": {
        display: "none",
      },
      ".leaflet-container": {
        fontFamily: '"Inter", -apple-system, sans-serif',
      },
    }}
  />
);

// ── Component ────────────────────────────────────────────────────────────────

interface RouteMapProps {
  plan: TripPlan | null;
  focusedStop: Stop | null;
  isLoading: boolean;
}

export function RouteMap({ plan, focusedStop, isLoading }: RouteMapProps) {
  // Split route into two colored legs at the pickup point
  const routeLegs = useMemo(() => {
    if (!plan) return null;
    const pickupStop = plan.stops.find((s) => s.type === "pickup");
    if (!pickupStop) {
      return {
        leg1: plan.route.coordinates as [number, number][],
        leg2: [] as [number, number][],
      };
    }
    return splitRouteAtPickup(plan.route, pickupStop.lat, pickupStop.lng);
  }, [plan]);

  // Project intermediate stops onto route geometry so they appear along the path
  const displayStops = useMemo(
    () => (plan ? projectIntermediateStops(plan.stops, plan.route) : []),
    [plan],
  );

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      {LEAFLET_POPUP_RESET}

      {isLoading && (
        <LinearProgress
          color="secondary"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1001,
            height: 3,
          }}
        />
      )}

      <MapContainer
        center={[39.5, -98.35]}
        zoom={4}
        style={{ height: "100%", width: "100%" }}
        zoomControl
      >
        <TileLayer url={CARTO_TILES} attribution={CARTO_ATTRIBUTION} />

        {plan && routeLegs && (
          <>
            <FitBounds stops={plan.stops} />

            {/* Leg 1: origin → pickup (green — empty truck) */}
            <RoutePolyline coordinates={routeLegs.leg1} color={LEG1_COLOR} />

            {/* Leg 2: pickup → dropoff (amber — loaded truck) */}
            <RoutePolyline coordinates={routeLegs.leg2} color={LEG2_COLOR} />

            {/* Stops projected along route geometry */}
            {displayStops.map((stop, i) => (
              <StopMarker key={`${stop.type}-${i}`} stop={stop} />
            ))}
          </>
        )}

        {focusedStop && <FlyToStop stop={focusedStop} />}
      </MapContainer>

      {!plan && !isLoading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(228,236,242,0.72)",
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 500,
            gap: 1.5,
          }}
        >
          <LocalShippingIcon
            sx={{ fontSize: 56, color: "#424242", opacity: 0.22 }}
          />
          <Typography
            variant="body2"
            sx={{ color: "#93B1C2", fontWeight: 500, fontSize: "0.875rem" }}
          >
            Enter trip details to see your ELD plan
          </Typography>
        </Box>
      )}

      <MapTabSwitcher />
    </Box>
  );
}

// ── Map sub-components ───────────────────────────────────────────────────────

function FitBounds({ stops }: { stops: Stop[] }) {
  const map = useMap();

  useEffect(() => {
    if (stops.length === 0) return;
    const bounds = L.latLngBounds(
      stops.map((s) => [s.lat, s.lng] as [number, number]),
    );
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13, animate: true });
  }, [map, stops]);

  return null;
}

function FlyToStop({ stop }: { stop: Stop }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([stop.lat, stop.lng], 12, { duration: 1.2 });
  }, [map, stop]);

  return null;
}
