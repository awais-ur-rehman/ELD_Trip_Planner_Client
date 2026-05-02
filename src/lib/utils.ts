import { format, parseISO } from 'date-fns'

export function formatHours(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatMiles(miles: number): string {
  return miles.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

export function formatTime(isoString: string): string {
  return format(parseISO(isoString), 'HH:mm')
}

export function formatDate(isoString: string): string {
  return format(parseISO(isoString), 'EEE, MMM d')
}

export function hourToTimeLabel(hour: number): string {
  const h = Math.floor(hour)
  const m = Math.round((hour - h) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatShortLocation(locationName: string): string {
  return locationName.split(',')[0].trim()
}

export function formatDuration(minutes: number): string {
  if (minutes === 0) return ''
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export function cycleSliderColor(hours: number): 'secondary' | 'warning' | 'error' {
  if (hours >= 68) return 'error'
  if (hours >= 60) return 'warning'
  return 'secondary'
}
