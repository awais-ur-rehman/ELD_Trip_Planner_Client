/**
 * Drive Plan — Routes tab
 *
 * A driver-facing itinerary: the trip as a sequential timeline of
 * drive segments and mandatory stops. Answers "when do I drive,
 * when do I stop, where will I be?"
 */
import { Box, Typography } from '@mui/material'
import {
  LocalShipping as DriveIcon,
  Hotel as RestIcon,
  Coffee as BreakIcon,
  LocalGasStation as FuelIcon,
  FiberManualRecord as DotIcon,
  EmojiFlags as FlagIcon,
} from '@mui/icons-material'
import { format, parseISO } from 'date-fns'
import { formatHours, formatMiles } from '@/lib/utils'
import { STOP_COLORS } from '@/constants/colors'
import type { TripPlan, Stop } from '@/types/trip'

// ── Types ────────────────────────────────────────────────────────────────────

interface DriveSegment {
  fromStop:      Stop
  toStop:        Stop
  departureISO:  string
  durationHours: number
  distanceMiles: number
}

// ── Computation ──────────────────────────────────────────────────────────────

function computeDriveSegments(plan: TripPlan): DriveSegment[] {
  const stops = plan.stops
  const raw: Omit<DriveSegment, 'distanceMiles'>[] = []

  for (let i = 0; i < stops.length - 1; i++) {
    const from = stops[i]
    const to   = stops[i + 1]

    const departMs  = new Date(from.arrival_time_iso).getTime() + from.duration_minutes * 60_000
    const arriveMs  = new Date(to.arrival_time_iso).getTime()
    const durHours  = (arriveMs - departMs) / 3_600_000

    if (durHours < 0.01) continue   // skip zero-length gaps

    raw.push({ fromStop: from, toStop: to, departureISO: new Date(departMs).toISOString(), durationHours: durHours })
  }

  // Distribute total distance proportionally by drive time
  const totalDriveH = raw.reduce((s, r) => s + r.durationHours, 0)
  return raw.map((r) => ({
    ...r,
    distanceMiles: totalDriveH > 0
      ? Math.round((r.durationHours / totalDriveH) * plan.total_distance_miles)
      : 0,
  }))
}

// ── Stop icon / colour helpers ────────────────────────────────────────────────

const STOP_ICON: Record<string, React.ElementType> = {
  current:    DotIcon,
  pickup:     DriveIcon,
  dropoff:    FlagIcon,
  fuel:       FuelIcon,
  rest_10hr:  RestIcon,
  break_30min: BreakIcon,
}

const STOP_LABEL: Record<string, string> = {
  current:    'Depart',
  pickup:     'Pickup',
  dropoff:    'Delivery',
  fuel:       'Fuel Stop',
  rest_10hr:  '10-Hr Rest',
  break_30min: '30-Min Break',
}

// ── Sub-components ────────────────────────────────────────────────────────────

/** One stop node in the timeline */
function StopNode({ stop, isLast }: { stop: Stop; isLast: boolean }) {
  const color  = STOP_COLORS[stop.type] ?? '#93B1C2'
  const Icon   = STOP_ICON[stop.type] ?? DotIcon
  const label  = STOP_LABEL[stop.type] ?? stop.type

  const departMs = new Date(stop.arrival_time_iso).getTime() + stop.duration_minutes * 60_000
  const showDepart = stop.duration_minutes > 0 && !isLast

  return (
    <Box sx={{ display: 'flex', gap: 0, position: 'relative', zIndex: 1 }}>
      {/* Circle node */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 1.5, flexShrink: 0 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: color,
            border: '2.5px solid white',
            boxShadow: `0 0 0 1.5px ${color}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 13, color: 'white' }} />
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, pb: 0.5, pt: 0.25 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#1E2A3A',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: '#424242',
              flexShrink: 0,
              ml: 1,
            }}
          >
            {format(parseISO(stop.arrival_time_iso), 'HH:mm · EEE MMM d')}
          </Typography>
        </Box>

        <Typography sx={{ fontSize: '0.6875rem', color: '#7A8FA3', mt: 0.125, lineHeight: 1.4 }}>
          {stop.location_name.split(',').slice(0, 2).join(',')}
        </Typography>

        {showDepart && (
          <Typography
            sx={{
              fontSize: '0.6rem',
              color: color,
              fontWeight: 600,
              letterSpacing: '0.4px',
              textTransform: 'uppercase',
              mt: 0.375,
            }}
          >
            Back on road {format(new Date(departMs), 'HH:mm')}
            {stop.type === 'rest_10hr'
              ? ` · ${format(new Date(departMs), 'EEE')}`
              : ''}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

/** Connector + drive info between two stops */
function DriveSegmentNode({ segment }: { segment: DriveSegment }) {
  return (
    <Box sx={{ display: 'flex', gap: 0 }}>
      {/* Vertical connector line */}
      <Box
        sx={{
          width: 28,
          mr: 1.5,
          display: 'flex',
          justifyContent: 'center',
          flexShrink: 0,
          py: 0.5,
        }}
      >
        <Box
          sx={{
            width: 2,
            flex: 1,
            bgcolor: '#E4ECF2',
            backgroundImage: 'repeating-linear-gradient(to bottom, #93B1C2 0, #93B1C2 4px, transparent 4px, transparent 8px)',
          }}
        />
      </Box>

      {/* Segment card */}
      <Box
        sx={{
          flex: 1,
          my: 0.625,
          p: 1,
          bgcolor: '#F4F7FA',
          border: '1px solid #E4ECF2',
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
        }}
      >
        <DriveIcon sx={{ fontSize: 14, color: '#93B1C2', flexShrink: 0 }} />
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#1E2A3A',
              lineHeight: 1,
            }}
          >
            {formatHours(segment.durationHours)}
          </Typography>
          <Typography sx={{ fontSize: '0.6rem', color: '#93B1C2', mt: 0.25, fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
            Drive
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#1E2A3A',
              lineHeight: 1,
            }}
          >
            ~{formatMiles(segment.distanceMiles)}
          </Typography>
          <Typography sx={{ fontSize: '0.6rem', color: '#93B1C2', mt: 0.25, fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
            Miles
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: '#7A8FA3',
              lineHeight: 1,
            }}
          >
            {format(parseISO(segment.departureISO), 'HH:mm')}
          </Typography>
          <Typography sx={{ fontSize: '0.6rem', color: '#93B1C2', mt: 0.25, fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
            Depart
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface RoutesBreakdownProps {
  plan:             TripPlan
  cycleUsedAtStart: number
}

export function RoutesBreakdown({ plan }: RoutesBreakdownProps) {
  const segments   = computeDriveSegments(plan)
  const originStop = plan.stops[0]
  const lastStop   = plan.stops[plan.stops.length - 1]

  // Merge stops and segments into a single ordered timeline list
  type TimelineItem =
    | { kind: 'stop'; stop: Stop; isLast: boolean }
    | { kind: 'drive'; segment: DriveSegment }

  const timeline: TimelineItem[] = []
  plan.stops.forEach((stop, i) => {
    timeline.push({ kind: 'stop', stop, isLast: i === plan.stops.length - 1 })
    const seg = segments.find((s) => s.fromStop === stop)
    if (seg) timeline.push({ kind: 'drive', segment: seg })
  })

  const totalDriveSegs = segments.length
  const restCount      = plan.stops.filter((s) => s.type === 'rest_10hr').length
  const breakCount     = plan.stops.filter((s) => s.type === 'break_30min').length
  const fuelCount      = plan.stops.filter((s) => s.type === 'fuel').length

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'background.default' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: '#1E2A3A', px: 2.5, py: 1.75 }}>
        <Typography
          sx={{
            fontSize: '0.5625rem',
            fontWeight: 700,
            color: '#93B1C2',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            mb: 0.375,
          }}
        >
          Drive Plan · Spotter AI
        </Typography>
        <Typography
          sx={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: 'white',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {originStop?.location_name.split(',')[0]}
          <Box component="span" sx={{ color: '#93B1C2', fontWeight: 400, mx: 0.75 }}>→</Box>
          {lastStop?.location_name.split(',')[0]}
        </Typography>
        <Typography sx={{ fontSize: '0.6875rem', color: '#93B1C2', mt: 0.25 }}>
          {plan.total_days} days · {totalDriveSegs} drives · {restCount} rest{restCount !== 1 ? 's' : ''} · {breakCount} break{breakCount !== 1 ? 's' : ''} · {fuelCount} fuel stop{fuelCount !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* ── Trip stats strip ───────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {[
          { v: formatMiles(plan.total_distance_miles), l: 'Total Miles' },
          { v: formatHours(plan.total_driving_hours),  l: 'Drive Time'  },
          { v: String(plan.total_days),                l: 'Days'        },
        ].map((s, i) => (
          <Box
            key={s.l}
            sx={{
              py: 1.25,
              px: 1.5,
              textAlign: 'center',
              borderRight: i < 2 ? '1px solid' : 'none',
              borderColor: 'divider',
            }}
          >
            <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: '1.0625rem', color: '#1E2A3A', lineHeight: 1 }}>
              {s.v}
            </Typography>
            <Typography sx={{ fontSize: '0.5625rem', color: '#93B1C2', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600, mt: 0.375 }}>
              {s.l}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ── Timeline ───────────────────────────────────────────────────────── */}
      <Box sx={{ px: 1.75, pt: 1.75, pb: 3 }}>
        {timeline.map((item, idx) =>
          item.kind === 'stop' ? (
            <StopNode key={`stop-${idx}`} stop={item.stop} isLast={item.isLast} />
          ) : (
            <DriveSegmentNode key={`drive-${idx}`} segment={item.segment} />
          ),
        )}
      </Box>

    </Box>
  )
}
