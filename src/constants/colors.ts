import type { StopType, DutyStatus } from '@/types/trip'

export const STOP_COLORS: Record<StopType, string> = {
  current: '#10B981',
  pickup: '#F5A524',
  dropoff: '#EF4444',
  fuel: '#3B82F6',
  rest_10hr: '#8B5CF6',
  break_30min: '#6B7280',
}

export const STATUS_COLORS: Record<DutyStatus, string> = {
  off_duty: '#6B7280',
  sleeper_berth: '#8B5CF6',
  driving: '#EF4444',
  on_duty_not_driving: '#F5A524',
}

export const STATUS_ROW_INDEX: Record<DutyStatus, number> = {
  off_duty: 0,
  sleeper_berth: 1,
  driving: 2,
  on_duty_not_driving: 3,
}
