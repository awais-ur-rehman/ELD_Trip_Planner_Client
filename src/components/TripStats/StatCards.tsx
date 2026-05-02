import { Box, Card, CardContent, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { formatMiles, formatHours } from '@/lib/utils'
import { MAX_CYCLE_HOURS } from '@/constants/hos'
import type { TripPlan } from '@/types/trip'

interface StatCardsProps {
  plan: TripPlan
  cycleUsedAtStart: number
}

interface StatCell {
  value: string
  label: string
  accent?: string
}

export function StatCards({ plan, cycleUsedAtStart }: StatCardsProps) {
  const totalCycleUsed = cycleUsedAtStart + plan.total_driving_hours
  const cycleRemaining = Math.max(0, MAX_CYCLE_HOURS - totalCycleUsed)

  const cycleAccent =
    cycleRemaining <= 2
      ? '#EF4444'
      : cycleRemaining <= 10
        ? '#F5A524'
        : undefined

  const cells: StatCell[] = [
    { value: formatMiles(plan.total_distance_miles), label: 'Miles' },
    { value: String(plan.total_days), label: plan.total_days === 1 ? 'Day' : 'Days' },
    { value: formatHours(plan.total_driving_hours), label: 'Drive Hours' },
    {
      value: formatHours(cycleRemaining),
      label: 'Hrs Left of 70h',
      accent: cycleAccent,
    },
  ]

  return (
    <Box sx={{ p: 2, pb: 1.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Trip Summary
      </Typography>
      <Grid container spacing={1.5}>
        {cells.map((cell) => (
          <Grid xs={6} key={cell.label}>
            <Card
              sx={{
                bgcolor: cell.accent ? `${cell.accent}10` : '#F4F7FA',
                border: cell.accent ? `1px solid ${cell.accent}30` : 'none',
                transition: 'background 0.2s',
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography
                  variant="h1"
                  sx={{
                    color: cell.accent ?? 'text.primary',
                    mb: 0.25,
                    fontSize: '1.375rem',
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {cell.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: cell.accent ?? 'text.secondary' }}
                >
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
