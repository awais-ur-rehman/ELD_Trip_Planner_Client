import { useEffect } from "react";
import { Box, Typography, LinearProgress, GlobalStyles } from "@mui/material";
import { LocalShipping as LocalShippingIcon } from "@mui/icons-material";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { RoutePolyline } from "./RoutePolyline";
import { StopMarker } from "./StopMarker";
import { MapTabSwitcher } from "./MapTabSwitcher";
import type { TripPlan, Stop } from "@/types/trip";
import "leaflet/dist/leaflet.css";

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

interface RouteMapProps {
  plan: TripPlan | null;
  focusedStop: Stop | null;
  isLoading: boolean;
}

export function RouteMap({ plan, focusedStop, isLoading }: RouteMapProps) {
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

        {plan && (
          <>
            <FitBounds stops={plan.stops} />
            <RoutePolyline geometry={plan.route} />
            {plan.stops.map((stop, i) => (
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
