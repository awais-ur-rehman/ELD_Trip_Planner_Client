import { Box, Typography } from '@mui/material'
import { FeaturedRouteCard } from './FeaturedRouteCard'
import { DriverCard } from './DriverCard'
import { ETACard } from './ETACard'
import { formatShortLocation } from '@/lib/utils'
import { MAX_CYCLE_HOURS } from '@/constants/hos'
import type { TripPlan } from '@/types/trip'

interface TripSummaryProps {
  plan: TripPlan
  cycleUsedAtStart: number
}

export function TripSummary({ plan, cycleUsedAtStart }: TripSummaryProps) {
  const originStop  = plan.stops[0]
  const dropoffStop = plan.stops.find((s) => s.type === 'dropoff') ?? plan.stops[plan.stops.length - 1]

  const origin      = formatShortLocation(originStop?.location_name ?? '')
  const destination = formatShortLocation(dropoffStop?.location_name ?? '')

  const totalCycleUsed = cycleUsedAtStart + plan.total_driving_hours
  const cycleRemaining = Math.max(0, MAX_CYCLE_HOURS - totalCycleUsed)
  const cyclePct       = Math.min(100, (totalCycleUsed / MAX_CYCLE_HOURS) * 100)
  const cycleBarColor  = cycleRemaining <= 2 ? '#EF4444' : cycleRemaining <= 10 ? '#F5A524' : '#10B981'

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Trip Overview
      </Typography>

      <FeaturedRouteCard
        origin={origin}
        destination={destination}
        distanceMiles={plan.total_distance_miles}
        totalDays={plan.total_days}
        stopCount={plan.stops.length}
      />

      {/* Driver + Clock bento row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1px',
          mt: '1px',
          bgcolor: '#D5DEE3',
        }}
      >
        <DriverCard origin={origin} destination={destination} />
        <ETACard />
      </Box>

      {/* 70-Hr Cycle bar */}
      <Box sx={{ bgcolor: 'white', px: 2, py: 1.5, border: '1px solid', borderColor: 'divider', borderTop: 'none' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.75 }}>
          <Typography
            sx={{ fontSize: '0.625rem', color: '#7A8FA3', textTransform: 'uppercase', letterSpacing: '0.7px', fontWeight: 600 }}
          >
            70-Hr Cycle
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 700,
                color: cycleRemaining <= 2 ? '#EF4444' : '#424242',
                fontFamily: '"JetBrains Mono", monospace',
                lineHeight: 1,
              }}
            >
              {cycleRemaining.toFixed(1)}
            </Typography>
            <Typography sx={{ fontSize: '0.625rem', color: '#7A8FA3' }}>hr left</Typography>
          </Box>
        </Box>

        {/* Bar */}
        <Box sx={{ height: 6, bgcolor: '#E4ECF2', overflow: 'hidden' }}>
          <Box
            sx={{
              height: '100%',
              width: `${cyclePct}%`,
              bgcolor: cycleBarColor,
              transition: 'width 0.4s',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography sx={{ fontSize: '0.625rem', color: '#A8BCC9' }}>
            {Math.round(cyclePct)}% used
          </Typography>
          <Typography sx={{ fontSize: '0.625rem', color: '#A8BCC9' }}>
            {plan.stops.length} stops
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
