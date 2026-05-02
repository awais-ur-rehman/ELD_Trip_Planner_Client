import { Box, Typography } from '@mui/material'
import { formatMiles } from '@/lib/utils'
import type { TripPlan } from '@/types/trip'

interface TripBreadcrumbProps {
  plan: TripPlan
}

export function TripBreadcrumb({ plan }: TripBreadcrumbProps) {
  const origin = plan.stops[0]?.location_name ?? ''
  const destination = plan.stops[plan.stops.length - 1]?.location_name ?? ''

  return (
    <Box
      sx={{
        height: 32,
        bgcolor: '#F4F7FA',
        borderBottom: '1px solid',
        borderColor: 'divider',
        px: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {origin} → {destination}
      </Typography>
      <Typography variant="body2" color="text.secondary">·</Typography>
      <Typography variant="body2" color="text.secondary">
        {formatMiles(plan.total_distance_miles)} mi
      </Typography>
      <Typography variant="body2" color="text.secondary">·</Typography>
      <Typography variant="body2" color="text.secondary">
        {plan.total_days} {plan.total_days === 1 ? 'day' : 'days'}
      </Typography>
    </Box>
  )
}
