import { Box, Typography } from '@mui/material'
import { FeaturedRouteCard } from './FeaturedRouteCard'
import { DriverCard } from './DriverCard'
import { ETACard } from './ETACard'
import { formatShortLocation } from '@/lib/utils'
import type { TripPlan } from '@/types/trip'

interface TripSummaryProps {
  plan: TripPlan
}

export function TripSummary({ plan }: TripSummaryProps) {
  const originStop = plan.stops[0]
  const dropoffStop = plan.stops.find((s) => s.type === 'dropoff') ?? plan.stops.at(-1)

  const origin = formatShortLocation(originStop?.location_name ?? '')
  const destination = formatShortLocation(dropoffStop?.location_name ?? '')

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
        totalDrivingHours={plan.total_driving_hours}
      />

      <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5, alignItems: 'stretch' }}>
        <Box sx={{ flex: 1, display: 'flex' }}>
          <DriverCard />
        </Box>
        <Box sx={{ flex: 1, display: 'flex' }}>
          <ETACard arrivalTimeIso={dropoffStop?.arrival_time_iso ?? null} />
        </Box>
      </Box>
    </Box>
  )
}
