import { useState, useCallback } from 'react'
import { Box } from '@mui/material'
import { AppHeader } from '@/components/layout/AppHeader'
import { TripBreadcrumb } from '@/components/layout/TripBreadcrumb'
import { TripForm } from '@/components/TripForm/TripForm'
import { RouteMap } from '@/components/RouteMap/RouteMap'
import { StatCards } from '@/components/TripStats/StatCards'
import { StopTimeline } from '@/components/StopTimeline/StopTimeline'
import { TripSummary } from '@/components/TripSummary/TripSummary'
import { ELDLogSheet } from '@/components/ELDLogSheet/ELDLogSheet'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorSnackbar } from '@/components/common/ErrorSnackbar'
import { useTripPlan } from '@/hooks/useTripPlan'
import type { TripFormValues, Stop } from '@/types/trip'

export function PlannerPage() {
  const { mutate, data: tripPlan, isPending, error, reset } = useTripPlan()
  const [focusedStop, setFocusedStop] = useState<Stop | null>(null)
  const [cycleUsedAtStart, setCycleUsedAtStart] = useState(0)

  const hasResults = Boolean(tripPlan)

  const handleSubmit = useCallback(
    (values: TripFormValues) => {
      setCycleUsedAtStart(values.current_cycle_used_hours)
      mutate(values)
    },
    [mutate],
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <AppHeader />

      {hasResults && tripPlan && <TripBreadcrumb plan={tripPlan} />}

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Box
          sx={{
            width: hasResults ? 300 : 380,
            flexShrink: 0,
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            overflowY: 'auto',
            transition: 'width 0.2s ease',
          }}
        >
          {isPending && <LoadingState variant="left-panel" />}

          {!isPending && !hasResults && (
            <TripForm onSubmit={handleSubmit} isLoading={isPending} />
          )}

          {!isPending && hasResults && tripPlan && (
            <>
              <StatCards plan={tripPlan} cycleUsedAtStart={cycleUsedAtStart} />
              <StopTimeline stops={tripPlan.stops} onStopClick={setFocusedStop} />
            </>
          )}
        </Box>

        <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <RouteMap plan={tripPlan ?? null} focusedStop={focusedStop} isLoading={isPending} />
        </Box>

        {hasResults && tripPlan && (
          <Box
            sx={{
              width: 360,
              flexShrink: 0,
              borderLeft: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              overflowY: 'auto',
            }}
          >
            <TripSummary plan={tripPlan} />
            <ELDLogSheet dailyLogs={tripPlan.daily_logs} />
          </Box>
        )}
      </Box>

      <ErrorSnackbar error={error?.message ?? null} onClose={reset} />
    </Box>
  )
}
