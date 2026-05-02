import { Box, Typography } from '@mui/material'
import { formatMiles, formatShortLocation } from '@/lib/utils'
import type { TripPlan } from '@/types/trip'

interface TripBreadcrumbProps {
  plan: TripPlan
}

export function TripBreadcrumb({ plan }: TripBreadcrumbProps) {
  const originStop  = plan.stops[0]
  const pickupStop  = plan.stops.find((s) => s.type === 'pickup')
  const dropoffStop = plan.stops.find((s) => s.type === 'dropoff') ?? plan.stops.at(-1)

  const origin  = formatShortLocation(originStop?.location_name ?? '')
  const pickup  = pickupStop ? formatShortLocation(pickupStop.location_name) : null
  const dropoff = formatShortLocation(dropoffStop?.location_name ?? '')

  const sep = (
    <Typography
      component="span"
      sx={{ mx: 1, color: '#D5DEE3', fontSize: '0.6875rem', fontWeight: 400 }}
    >
      →
    </Typography>
  )

  const pipe = (
    <Typography
      component="span"
      sx={{ mx: 1.75, color: '#D5DEE3', fontSize: '0.6875rem' }}
    >
      |
    </Typography>
  )

  return (
    <Box
      sx={{
        height: 32,
        bgcolor: '#F4F7FA',
        borderBottom: '1px solid',
        borderColor: 'divider',
        px: 2.5,
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
      }}
    >
      {/* Colored city names */}
      <Typography
        component="span"
        sx={{ color: '#10B981', fontWeight: 600, fontSize: '0.6875rem', fontFamily: '"JetBrains Mono", monospace' }}
      >
        {origin}
      </Typography>

      {pickup && (
        <>
          {sep}
          <Typography
            component="span"
            sx={{ color: '#F5A524', fontWeight: 600, fontSize: '0.6875rem', fontFamily: '"JetBrains Mono", monospace' }}
          >
            {pickup}
          </Typography>
        </>
      )}

      {sep}

      <Typography
        component="span"
        sx={{ color: '#EF4444', fontWeight: 600, fontSize: '0.6875rem', fontFamily: '"JetBrains Mono", monospace' }}
      >
        {dropoff}
      </Typography>

      {pipe}

      <Typography component="span" sx={{ fontSize: '0.6875rem', color: '#7A8FA3' }}>
        {formatMiles(plan.total_distance_miles)} mi
      </Typography>

      <Typography component="span" sx={{ mx: 1, color: '#D5DEE3', fontSize: '0.6875rem' }}>·</Typography>

      <Typography component="span" sx={{ fontSize: '0.6875rem', color: '#7A8FA3' }}>
        {plan.total_days} {plan.total_days === 1 ? 'day' : 'days'}
      </Typography>

      <Typography component="span" sx={{ mx: 1, color: '#D5DEE3', fontSize: '0.6875rem' }}>·</Typography>

      <Typography
        component="span"
        sx={{ fontSize: '0.6875rem', color: '#7A8FA3', fontFamily: '"JetBrains Mono", monospace' }}
      >
        {plan.stops.length} stops
      </Typography>
    </Box>
  )
}
