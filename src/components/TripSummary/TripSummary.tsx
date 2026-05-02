import { Box, Typography } from '@mui/material'
import { FeaturedRouteCard } from './FeaturedRouteCard'
import { DriverCard } from './DriverCard'
import { ETACard } from './ETACard'
import type { TripPlan } from '@/types/trip'

interface TripSummaryProps {
  plan: TripPlan
}

export function TripSummary({ plan }: TripSummaryProps) {
  const origin = plan.stops[0]?.location_name ?? ''
  const destination = plan.stops[plan.stops.length - 1]?.location_name ?? ''
  const lastStop = plan.stops[plan.stops.length - 1]

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
      />

      <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5 }}>
        <Box sx={{ flex: 1 }}>
          <DriverCard />
        </Box>
        <Box sx={{ flex: 1 }}>
          <ETACard arrivalTimeIso={lastStop?.arrival_time_iso ?? null} />
        </Box>
      </Box>
    </Box>
  )
}
