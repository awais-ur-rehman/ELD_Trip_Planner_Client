import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Map as MapIcon,
  FormatListBulleted as ListIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material'
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
  const [focusedStop, setFocusedStop]           = useState<Stop | null>(null)
  const [cycleUsedAtStart, setCycleUsedAtStart] = useState(0)
  const [mobileTab, setMobileTab]               = useState(0)
  const lastValuesRef = useRef<TripFormValues | null>(null)

  const theme    = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const hasResults = Boolean(tripPlan)

  // Jump to map tab when results arrive on mobile
  useEffect(() => {
    if (hasResults && isMobile) setMobileTab(0)
  }, [hasResults, isMobile])

  const handleSubmit = useCallback(
    (values: TripFormValues) => {
      lastValuesRef.current = values
      setCycleUsedAtStart(values.current_cycle_used_hours)
      setMobileTab(0)
      mutate(values)
    },
    [mutate],
  )

  const handleNewTrip = useCallback(() => {
    reset()
    setFocusedStop(null)
    setCycleUsedAtStart(0)
    setMobileTab(0)
    lastValuesRef.current = null
  }, [reset])

  const handleRetry      = useCallback(() => { if (lastValuesRef.current) mutate(lastValuesRef.current) }, [mutate])
  const handleCloseError = useCallback(() => reset(), [reset])

  const snackbar = (
    <ErrorSnackbar
      error={error}
      onClose={handleCloseError}
      onRetry={lastValuesRef.current ? handleRetry : undefined}
    />
  )

  // ── Mobile layout (< md = 900 px) ─────────────────────────────────────────
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
        <AppHeader hasResults={hasResults} onNewTrip={handleNewTrip} />

        {!hasResults ? (
          /* Form / loading */
          <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: 'background.default' }}>
            {isPending
              ? <LoadingState variant="left-panel" />
              : <TripForm onSubmit={handleSubmit} isLoading={isPending} />
            }
          </Box>
        ) : (
          /* Tabbed results */
          <>
            {tripPlan && <TripBreadcrumb plan={tripPlan} />}

            <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              {/* Map – always mounted so Leaflet state is preserved */}
              <Box sx={{ height: '100%', display: mobileTab === 0 ? 'block' : 'none' }}>
                <RouteMap plan={tripPlan ?? null} focusedStop={focusedStop} isLoading={isPending} />
              </Box>

              {mobileTab === 1 && tripPlan && (
                <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'background.default' }}>
                  <StatCards plan={tripPlan} cycleUsedAtStart={cycleUsedAtStart} />
                  <StopTimeline
                    stops={tripPlan.stops}
                    onStopClick={(stop) => { setFocusedStop(stop); setMobileTab(0) }}
                  />
                </Box>
              )}

              {mobileTab === 2 && tripPlan && (
                <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'background.default' }}>
                  <TripSummary plan={tripPlan} cycleUsedAtStart={cycleUsedAtStart} />
                  <ELDLogSheet dailyLogs={tripPlan.daily_logs} />
                </Box>
              )}
            </Box>

            <BottomNavigation
              value={mobileTab}
              onChange={(_, v) => setMobileTab(v as number)}
              sx={{ flexShrink: 0, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
            >
              <BottomNavigationAction label="Map"     icon={<MapIcon />}        />
              <BottomNavigationAction label="Stops"   icon={<ListIcon />}       />
              <BottomNavigationAction label="Summary" icon={<AssignmentIcon />} />
            </BottomNavigation>
          </>
        )}

        {snackbar}
      </Box>
    )
  }

  // ── Desktop layout (≥ md) ──────────────────────────────────────────────────
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <AppHeader hasResults={hasResults} onNewTrip={handleNewTrip} />

      {hasResults && tripPlan && <TripBreadcrumb plan={tripPlan} />}

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left panel */}
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

        {/* Map */}
        <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <RouteMap plan={tripPlan ?? null} focusedStop={focusedStop} isLoading={isPending} />
        </Box>

        {/* Right panel */}
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
            <TripSummary plan={tripPlan} cycleUsedAtStart={cycleUsedAtStart} />
            <ELDLogSheet dailyLogs={tripPlan.daily_logs} />
          </Box>
        )}
      </Box>

      {snackbar}
    </Box>
  )
}
