import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { StopPopup } from './StopPopup'
import { STOP_COLORS } from '@/constants/colors'
import type { Stop } from '@/types/trip'

function createStopIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${color};
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

interface StopMarkerProps {
  stop: Stop
}

export function StopMarker({ stop }: StopMarkerProps) {
  const color = STOP_COLORS[stop.type]
  const icon = createStopIcon(color)

  return (
    <Marker position={[stop.lat, stop.lng]} icon={icon}>
      <Popup>
        <StopPopup stop={stop} />
      </Popup>
    </Marker>
  )
}
