import { Box, Typography } from '@mui/material'
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
  const totalCycleUsed  = cycleUsedAtStart + plan.total_driving_hours
  const cycleRemaining  = Math.max(0, MAX_CYCLE_HOURS - totalCycleUsed)

  const cycleAccent =
    cycleRemaining <= 2
      ? '#EF4444'
      : cycleRemaining <= 10
        ? '#F5A524'
        : undefined

  const cells: StatCell[] = [
    { value: formatMiles(plan.total_distance_miles), label: 'Total Miles' },
    { value: String(plan.total_days),                label: plan.total_days === 1 ? 'Day' : 'Days' },
    { value: formatHours(plan.total_driving_hours),  label: 'Drive Hours' },
    { value: formatHours(cycleRemaining),            label: 'Hrs Left of 70h', accent: cycleAccent },
  ]

  return (
    <Box sx={{ pb: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', px: 2, pt: 2, pb: 1.5 }}
      >
        Trip Summary
      </Typography>

      {/* Grid with gap background — matches design's 1px gap grid */}
      <Box sx={{ bgcolor: '#D5DEE3', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={0}>
          {cells.map((cell) => (
            <Grid xs={6} key={cell.label} sx={{ p: '1px' }}>
              <Box
                sx={{
                  bgcolor: cell.accent ? `${cell.accent}10` : 'white',
                  p: 2,
                  height: '100%',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: cell.accent ?? '#424242',
                    lineHeight: 1,
                    fontFamily: '"JetBrains Mono", monospace',
                    letterSpacing: '-0.5px',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {cell.value}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.625rem',
                    color: cell.accent ?? '#7A8FA3',
                    textTransform: 'uppercase',
                    letterSpacing: '0.7px',
                    fontWeight: 600,
                    mt: 0.625,
                    display: 'block',
                  }}
                >
                  {cell.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}
