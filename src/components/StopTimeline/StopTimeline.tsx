import { type KeyboardEvent } from 'react'
import { Box, Typography, Chip, Divider } from '@mui/material'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab'
import { formatTime, formatShortLocation, formatDuration } from '@/lib/utils'
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

interface StopTimelineProps {
  stops: Stop[]
  onStopClick: (stop: Stop) => void
}

export function StopTimeline({ stops, onStopClick }: StopTimelineProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLElement>, stop: Stop) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onStopClick(stop)
    }
  }

  return (
    <Box>
      <Divider />
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Stop Schedule
        </Typography>
      </Box>

      <Timeline
        sx={{
          p: 0,
          m: 0,
          '& .MuiTimelineItem-root': { minHeight: 'unset' },
        }}
      >
        {stops.map((stop, i) => {
          const color = STOP_COLORS[stop.type]
          const isLast = i === stops.length - 1
          const typeLabel = STOP_TYPE_LABELS[stop.type] ?? stop.type
          const shortLocation = formatShortLocation(stop.location_name)
          const durationLabel = formatDuration(stop.duration_minutes)

          return (
            <TimelineItem
              key={`${stop.type}-${i}`}
              role="button"
              tabIndex={0}
              aria-label={`${typeLabel} at ${shortLocation}, ${formatTime(stop.arrival_time_iso)}`}
              onClick={() => onStopClick(stop)}
              onKeyDown={(e) => handleKeyDown(e, stop)}
              sx={{
                cursor: 'pointer',
                borderRadius: 1,
                mx: 0.5,
                outline: 'none',
                '&:hover': { bgcolor: '#F4F7FA' },
                '&:focus-visible': {
                  bgcolor: '#F4F7FA',
                  outline: '2px solid',
                  outlineColor: 'secondary.main',
                  outlineOffset: -2,
                },
                '&::before': { display: 'none' },
              }}
            >
              <TimelineSeparator sx={{ pl: 1.5 }}>
                <TimelineDot
                  sx={{
                    bgcolor: color,
                    m: '10px 0',
                    width: 10,
                    height: 10,
                    boxShadow: `0 0 0 3px ${color}22`,
                  }}
                />
                {!isLast && (
                  <TimelineConnector sx={{ bgcolor: 'divider', width: '1px' }} />
                )}
              </TimelineSeparator>

              <TimelineContent sx={{ py: 0.75, px: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexWrap: 'wrap' }}>
                  <Typography variant="body2" fontWeight={500} sx={{ lineHeight: 1.4 }}>
                    {typeLabel}
                  </Typography>
                  {durationLabel && (
                    <Chip
                      label={durationLabel}
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: '0.625rem',
                        bgcolor: `${color}18`,
                        color,
                        fontWeight: 600,
                        border: 'none',
                        '& .MuiChip-label': { px: 0.75 },
                      }}
                    />
                  )}
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.6875rem', lineHeight: 1.5 }}
                >
                  {formatTime(stop.arrival_time_iso)} · {shortLocation}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          )
        })}
      </Timeline>
    </Box>
  )
}
