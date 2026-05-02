import { Box, Typography, Chip, Divider } from '@mui/material'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab'
import { formatTime } from '@/lib/utils'
import { STOP_COLORS } from '@/constants/colors'
import type { Stop } from '@/types/trip'

const STOP_DURATION_LABELS: Partial<Record<string, string>> = {
  rest_10hr: '10 hours',
  break_30min: '30 min',
  fuel: '30 min',
  pickup: '1 hour',
  dropoff: '1 hour',
}

interface StopTimelineProps {
  stops: Stop[]
  onStopClick: (stop: Stop) => void
}

export function StopTimeline({ stops, onStopClick }: StopTimelineProps) {
  return (
    <Box sx={{ px: 1 }}>
      <Divider sx={{ mb: 1 }} />
      <Typography variant="caption" color="text.secondary" sx={{ px: 2, display: 'block', mb: 0.5 }}>
        Stop Schedule
      </Typography>
      <Timeline sx={{ p: 0, m: 0 }}>
        {stops.map((stop, i) => {
          const color = STOP_COLORS[stop.type]
          const durationLabel = STOP_DURATION_LABELS[stop.type]
          const isLast = i === stops.length - 1

          return (
            <TimelineItem
              key={`${stop.type}-${i}`}
              onClick={() => onStopClick(stop)}
              sx={{
                cursor: 'pointer',
                borderRadius: 1,
                '&:hover': { bgcolor: '#F4F7FA' },
                minHeight: 'unset',
                '&::before': { display: 'none' },
              }}
            >
              <TimelineSeparator>
                <TimelineDot sx={{ bgcolor: color, m: 0.5, width: 10, height: 10 }} />
                {!isLast && <TimelineConnector sx={{ bgcolor: 'divider' }} />}
              </TimelineSeparator>
              <TimelineContent sx={{ py: 0.75, px: 1.5 }}>
                <Typography variant="body2" fontWeight={500} sx={{ lineHeight: 1.4 }}>
                  {stop.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
                  {formatTime(stop.arrival_time_iso)} · {stop.location_name}
                </Typography>
                {durationLabel && (
                  <Chip
                    label={durationLabel}
                    size="small"
                    sx={{
                      mt: 0.5,
                      height: 18,
                      fontSize: '0.625rem',
                      bgcolor: `${color}20`,
                      color,
                      fontWeight: 500,
                    }}
                  />
                )}
              </TimelineContent>
            </TimelineItem>
          )
        })}
      </Timeline>
    </Box>
  )
}
