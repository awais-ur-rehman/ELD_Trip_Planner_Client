import { Box, Typography, Divider, Chip } from '@mui/material'
import { formatTime, formatDate } from '@/lib/utils'
import { STOP_COLORS } from '@/constants/colors'
import type { Stop } from '@/types/trip'

const STOP_TYPE_LABELS: Record<string, string> = {
  current: 'Starting Point',
  pickup: 'Pickup',
  dropoff: 'Delivery',
  fuel: 'Fuel Stop',
  rest_10hr: '10-Hour Rest',
  break_30min: '30-Min Break',
}

interface StopPopupProps {
  stop: Stop
}

export function StopPopup({ stop }: StopPopupProps) {
  const color = STOP_COLORS[stop.type]
  const typeLabel = STOP_TYPE_LABELS[stop.type] ?? stop.type

  return (
    <Box sx={{ p: 1.5, minWidth: 220 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: color,
            flexShrink: 0,
          }}
        />
        <Typography variant="body2" fontWeight={600} sx={{ color: '#424242' }}>
          {typeLabel}
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{ color: '#7A8FA3', mb: 1.25, fontSize: '0.75rem', lineHeight: 1.4 }}
      >
        {formatTime(stop.arrival_time_iso)} · {formatDate(stop.arrival_time_iso)}
        <br />
        {stop.location_name}
      </Typography>

      <Divider sx={{ borderColor: '#D5DEE3', mb: 1.25 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ color: '#7A8FA3', textTransform: 'none' }}>
          Duration
        </Typography>
        <Chip
          label={stop.duration_minutes > 0 ? `${stop.duration_minutes} min` : 'No stop'}
          size="small"
          sx={{
            height: 20,
            fontSize: '0.6875rem',
            bgcolor: stop.duration_minutes > 0 ? `${color}18` : '#F4F7FA',
            color: stop.duration_minutes > 0 ? color : '#7A8FA3',
            fontWeight: 500,
            border: 'none',
          }}
        />
      </Box>
    </Box>
  )
}
