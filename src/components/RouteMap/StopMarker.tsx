import { useMemo } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { StopPopup } from './StopPopup'
import { STOP_COLORS } from '@/constants/colors'
import type { Stop, StopType } from '@/types/trip'
import { formatTime } from '@/lib/utils'

const STOP_ICONS: Record<StopType, string> = {
  current: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="5" r="4" stroke="white" stroke-width="1.5" opacity="0.6"/>
    <circle cx="5" cy="5" r="2" fill="white"/>
  </svg>`,

  pickup: `<svg width="13" height="10" viewBox="0 0 13 10" fill="white" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="3" width="9" height="5" rx="1"/>
    <rect x="9" y="5" width="4" height="3" rx="1"/>
    <rect x="2" y="0" width="5" height="4" rx="1"/>
    <circle cx="2.5" cy="8.5" r="1.5" fill="white"/>
    <circle cx="9.5" cy="8.5" r="1.5" fill="white"/>
  </svg>`,

  dropoff: `<svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="1,4.5 4,7.5 10,1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  fuel: `<svg width="10" height="12" viewBox="0 0 10 12" fill="white" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="3" width="6" height="7" rx="1"/>
    <rect x="3.5" y="1" width="1.5" height="3"/>
    <rect x="7" y="4" width="2" height="4" rx="1"/>
    <path d="M9 4 L9 3 L8 3" stroke="white" stroke-width="1" fill="none"/>
  </svg>`,

  rest_10hr: `<svg width="12" height="12" viewBox="0 0 12 12" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 6.5A4 4 0 0 0 9.5 8 4.5 4.5 0 0 1 4 2.5 4 4 0 0 0 2.5 6.5z"/>
  </svg>`,

  break_30min: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="4.5" stroke="white" stroke-width="1.5"/>
    <polyline points="6,3.5 6,6 8,6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
}

function createStopIcon(stop: Stop): L.DivIcon {
  const color = STOP_COLORS[stop.type]
  const svgIcon = STOP_ICONS[stop.type]
  const timeLabel = formatTime(stop.arrival_time_iso)
  const shortName = stop.location_name.split(',')[0]

  return L.divIcon({
    className: '',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;pointer-events:auto;">
        <div style="
          width:28px;height:28px;border-radius:50%;
          background:${color};border:2px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.22);
          display:flex;align-items:center;justify-content:center;
        ">${svgIcon}</div>
        <div style="
          margin-top:4px;
          background:white;border:1px solid #D5DEE3;border-radius:10px;
          padding:2px 7px;white-space:nowrap;
          box-shadow:0 1px 4px rgba(0,0,0,0.08);
        ">
          <div style="font-family:Inter,sans-serif;font-size:10px;font-weight:500;color:#424242;line-height:1.3;">${shortName}</div>
          <div style="font-family:Inter,sans-serif;font-size:9px;font-weight:400;color:#7A8FA3;line-height:1.2;">${timeLabel}</div>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -18],
  })
}

interface StopMarkerProps {
  stop: Stop
}

export function StopMarker({ stop }: StopMarkerProps) {
  const icon = useMemo(() => createStopIcon(stop), [stop])

  return (
    <Marker
      position={[stop.lat, stop.lng]}
      icon={icon}
      aria-label={stop.label}
    >
      <Popup minWidth={220}>
        <StopPopup stop={stop} />
      </Popup>
    </Marker>
  )
}
