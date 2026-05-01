import { Polyline } from 'react-leaflet'
import type { RouteGeometry } from '@/types/trip'
import type { LatLngExpression } from 'leaflet'

interface RoutePolylineProps {
  geometry: RouteGeometry
}

export function RoutePolyline({ geometry }: RoutePolylineProps) {
  const positions = geometry.coordinates.map(
    ([lng, lat]) => [lat, lng] as LatLngExpression,
  )

  return (
    <>
      <Polyline
        positions={positions}
        pathOptions={{ color: '#93B1C2', opacity: 0.4, weight: 8 }}
      />
      <Polyline
        positions={positions}
        pathOptions={{ color: '#93B1C2', weight: 4 }}
      />
    </>
  )
}
