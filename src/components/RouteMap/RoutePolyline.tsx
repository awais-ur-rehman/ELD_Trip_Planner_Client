import { useMemo } from 'react'
import { Polyline } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import type { RouteGeometry } from '@/types/trip'

interface RoutePolylineProps {
  geometry: RouteGeometry
}

export function RoutePolyline({ geometry }: RoutePolylineProps) {
  const positions = useMemo<LatLngExpression[]>(
    () => geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    [geometry],
  )

  return (
    <>
      <Polyline
        positions={positions}
        pathOptions={{ color: '#93B1C2', opacity: 0.35, weight: 10 }}
      />
      <Polyline
        positions={positions}
        pathOptions={{ color: '#93B1C2', weight: 4, opacity: 1 }}
      />
    </>
  )
}
