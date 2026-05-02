import { useMemo } from 'react'
import { Polyline } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'

interface RoutePolylineProps {
  /** GeoJSON [lng, lat] pairs */
  coordinates: [number, number][]
  color: string
}

export function RoutePolyline({ coordinates, color }: RoutePolylineProps) {
  const positions = useMemo<LatLngExpression[]>(
    () => coordinates.map(([lng, lat]) => [lat, lng]),
    [coordinates],
  )

  if (positions.length < 2) return null

  return (
    <>
      {/* Soft halo */}
      <Polyline positions={positions} pathOptions={{ color, opacity: 0.18, weight: 12 }} />
      {/* Main line */}
      <Polyline positions={positions} pathOptions={{ color, weight: 3.5, opacity: 0.9 }} />
    </>
  )
}
