import { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { RoutePolyline } from './RoutePolyline'
import { StopMarker } from './StopMarker'
import { MapTabSwitcher } from './MapTabSwitcher'
import type { TripPlan, Stop } from '@/types/trip'
import 'leaflet/dist/leaflet.css'

const CARTO_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const CARTO_ATTRIBUTION = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'

interface RouteMapProps {
  plan: TripPlan | null
  focusedStop: Stop | null
  isLoading: boolean
}

export function RouteMap({ plan, focusedStop, isLoading }: RouteMapProps) {
  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={[39.5, -98.35]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer url={CARTO_TILES} attribution={CARTO_ATTRIBUTION} />

        {plan && (
          <>
            <RoutePolyline geometry={plan.route} />
            {plan.stops.map((stop, i) => (
              <StopMarker key={`${stop.type}-${i}`} stop={stop} />
            ))}
          </>
        )}

        {focusedStop && <FocusStop stop={focusedStop} />}
      </MapContainer>

      {!plan && !isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Enter trip details to see your ELD plan →
          </Typography>
        </Box>
      )}

      <MapTabSwitcher />
    </Box>
  )
}

function FocusStop({ stop }: { stop: Stop }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([stop.lat, stop.lng], 10, { duration: 1 })
  }, [map, stop])
  return null
}
