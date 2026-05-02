import { Box, Card, CardContent, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { formatMiles, formatHours } from '@/lib/utils'
import { MAX_CYCLE_HOURS } from '@/constants/hos'
import type { TripPlan } from '@/types/trip'

interface StatCardsProps {
  plan: TripPlan
}

interface StatCell {
  value: string
  label: string
}

export function StatCards({ plan }: StatCardsProps) {
  const remaining = MAX_CYCLE_HOURS - (MAX_CYCLE_HOURS - plan.total_driving_hours)

  const cells: StatCell[] = [
    { value: formatMiles(plan.total_distance_miles), label: 'Miles' },
    { value: String(plan.total_days), label: 'Days' },
    { value: formatHours(plan.total_driving_hours), label: 'Drive Hours' },
    { value: formatHours(remaining), label: 'Hrs Left of 70h' },
  ]

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={1.5}>
        {cells.map((cell) => (
          <Grid xs={6} key={cell.label}>
            <Card sx={{ bgcolor: '#F4F7FA', border: 'none' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="h1" sx={{ color: 'text.primary', mb: 0.25 }}>
                  {cell.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {cell.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
