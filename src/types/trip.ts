export type StopType =
  | 'current'
  | 'pickup'
  | 'dropoff'
  | 'fuel'
  | 'rest_10hr'
  | 'break_30min'

export type DutyStatus =
  | 'off_duty'
  | 'sleeper_berth'
  | 'driving'
  | 'on_duty_not_driving'

export interface Stop {
  type: StopType
  label: string
  lat: number
  lng: number
  arrival_time_iso: string
  duration_minutes: number
  location_name: string
}

export interface EldSegment {
  status: DutyStatus
  start_time_iso: string
  end_time_iso: string
  location_name: string
  is_stationary: boolean
  activity_label: string | null
  duration_hours: number
}

export interface DailyLogEntry {
  status: DutyStatus
  start_hour: number
  end_hour: number
  is_stationary: boolean
  activity_label: string | null
  location_name: string
}

export interface DailyLogRemark {
  time_hour: number
  location: string
  activity: string | null
}

export interface DailyLogTotals {
  off_duty: number
  sleeper_berth: number
  driving: number
  on_duty_not_driving: number
}

export interface DailyLog {
  date: string
  day_number: number
  from_location: string
  to_location: string
  total_miles_today: number
  entries: DailyLogEntry[]
  remarks: DailyLogRemark[]
  totals: DailyLogTotals
}

export interface RouteGeometry {
  type: 'LineString'
  coordinates: [number, number][]
}

export interface TripPlan {
  trip_id: string
  total_distance_miles: number
  total_driving_hours: number
  total_days: number
  cached: boolean
  route: RouteGeometry
  stops: Stop[]
  eld_segments: EldSegment[]
  daily_logs: DailyLog[]
}

export interface TripPlanResponse {
  data: TripPlan
  cached: boolean
}

export interface TripPlanErrorResponse {
  data: null
  error: string | Record<string, unknown>
}

export interface TripFormValues {
  current_location: string
  pickup_location: string
  dropoff_location: string
  current_cycle_used_hours: number
}
