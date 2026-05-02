import { Box, Typography, Divider } from '@mui/material'
import { formatTime } from '@/lib/utils'
import { STOP_COLORS } from '@/constants/colors'
import type { Stop } from '@/types/trip'

interface StopPopupProps {
  stop: Stop
}

export function StopPopup({ stop }: StopPopupProps) {
  const color = STOP_COLORS[stop.type]

  return (
    <Box sx={{ minWidth: 200, p: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: color,
            flexShrink: 0,
          }}
        />
        <Typography variant="body2" fontWeight={500}>
          {stop.label}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {formatTime(stop.arrival_time_iso)} · {stop.location_name}
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">Duration</Typography>
        <Typography variant="caption">
          {stop.duration_minutes > 0 ? `${stop.duration_minutes} min` : '—'}
        </Typography>
      </Box>
    </Box>
  )
}
