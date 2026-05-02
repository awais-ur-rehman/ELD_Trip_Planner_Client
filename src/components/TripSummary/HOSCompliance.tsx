/**
 * HOS Compliance Panel — right panel, dispatcher-facing.
 * Rule-by-rule verification against 49 CFR Part 395.
 */
import { Box, Typography, LinearProgress } from '@mui/material'
import { CheckCircle as OkIcon, Warning as WarnIcon, Error as ErrIcon } from '@mui/icons-material'
import { format, parseISO, addHours } from 'date-fns'
import { formatHours } from '@/lib/utils'
import type { TripPlan, EldSegment } from '@/types/trip'

type Level = 'ok' | 'warn' | 'error'

const C: Record<Level, string> = { ok: '#10B981', warn: '#F5A524', error: '#EF4444' }

function lv(value: number, limit: number, warnAt = 0.9): Level {
  if (value > limit)              return 'error'
  if (value >= limit * warnAt)    return 'warn'
  return 'ok'
}

function StatusIcon({ l }: { l: Level }) {
  const Icon = l === 'ok' ? OkIcon : l === 'warn' ? WarnIcon : ErrIcon
  return <Icon sx={{ fontSize: 13, color: C[l], flexShrink: 0 }} />
}

// ── Metric computation ───────────────────────────────────────────────────────

function compute(plan: TripPlan, cycleUsedAtStart: number) {
  const segs: EldSegment[] = plan.eld_segments

  const maxShiftDrive = Math.max(0, ...plan.daily_logs.map((d) => d.totals.driving))

  let windowStart: number | null = null
  let maxWindowUsed = 0
  for (const s of segs) {
    const startMs = new Date(s.start_time_iso).getTime()
    const endMs   = new Date(s.end_time_iso).getTime()
    if (s.status === 'off_duty' && s.duration_hours >= 10) { windowStart = null; continue }
    if (s.status !== 'off_duty' && s.status !== 'sleeper_berth') {
      if (!windowStart) windowStart = startMs
      maxWindowUsed = Math.max(maxWindowUsed, (endMs - windowStart) / 3_600_000)
    }
  }

  let maxConsec = 0, cur = 0
  for (const s of segs) {
    if (s.status === 'driving') { cur += s.duration_hours; maxConsec = Math.max(maxConsec, cur) }
    else cur = 0
  }

  const restStops  = plan.stops.filter((s) => s.type === 'rest_10hr')
  const minRestMins = restStops.length ? Math.min(...restStops.map((s) => s.duration_minutes)) : 600

  const totalOnDuty = segs
    .filter((s) => s.status === 'driving' || s.status === 'on_duty_not_driving')
    .reduce((sum, s) => sum + s.duration_hours, 0)
  const cycleAfter    = cycleUsedAtStart + totalOnDuty
  const hoursLeft     = Math.max(0, 70 - cycleAfter)
  const needsRestart  = cycleAfter >= 68

  const lastStop     = plan.stops[plan.stops.length - 1]
  const tripEndISO   = lastStop.arrival_time_iso
  const restartISO   = addHours(parseISO(tripEndISO), 34).toISOString()

  return { maxShiftDrive, maxWindowUsed, maxConsec, minRestMins, cycleAfter, hoursLeft, needsRestart, tripEndISO, restartISO }
}

// ── Row ──────────────────────────────────────────────────────────────────────

function Row({
  tag, title, value, limit, fn, l,
}: {
  tag: string; title: string; value: number; limit: number; fn: (n: number) => string; l: Level
}) {
  return (
    <Box sx={{ px: 2, py: 1.125, borderBottom: '1px solid', borderColor: '#F0F4F6' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <StatusIcon l={l} />
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E2A3A' }}>{title}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.375, flexShrink: 0 }}>
          <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8125rem', fontWeight: 700, color: C[l], lineHeight: 1 }}>
            {fn(value)}
          </Typography>
          <Typography sx={{ fontSize: '0.5625rem', color: '#93B1C2' }}>/ {fn(limit)}</Typography>
        </Box>
      </Box>
      <LinearProgress
        variant="determinate"
        value={Math.min((value / limit) * 100, 100)}
        sx={{ height: 3, bgcolor: '#F0F4F6', borderRadius: 0, '& .MuiLinearProgress-bar': { bgcolor: C[l], borderRadius: 0 } }}
      />
      <Typography sx={{ fontSize: '0.5625rem', color: '#93B1C2', mt: 0.375, letterSpacing: '0.3px' }}>{tag}</Typography>
    </Box>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

export function HOSCompliance({ plan, cycleUsedAtStart }: { plan: TripPlan; cycleUsedAtStart: number }) {
  const m = compute(plan, cycleUsedAtStart)
  const cycLevel = lv(m.cycleAfter, 70, 0.86)

  return (
    <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
      {/* Section header */}
      <Box sx={{ px: 2, py: 1.25, bgcolor: '#FAFCFD', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, color: '#93B1C2', letterSpacing: '1px', textTransform: 'uppercase' }}>
          HOS Compliance · 49 CFR 395
        </Typography>
      </Box>

      {/* Rules */}
      <Row tag="§ 395.3(a)(3) · 11-hr driving limit"     title="Max Shift Drive"   value={m.maxShiftDrive}    limit={11} fn={formatHours} l={lv(m.maxShiftDrive, 11)} />
      <Row tag="§ 395.3(a)(2) · 14-hr duty window"       title="Duty Window"        value={m.maxWindowUsed}    limit={14} fn={formatHours} l={lv(m.maxWindowUsed, 14)} />
      <Row tag="§ 395.3(a)(3)(ii) · break after 8h drive" title="Consec. Drive"     value={m.maxConsec}        limit={8}  fn={formatHours} l={lv(m.maxConsec, 8)} />
      <Row tag="§ 395.3(a)(1) · min 10-hr rest"           title="Shortest Rest"     value={m.minRestMins / 60} limit={10} fn={formatHours} l={m.minRestMins >= 600 ? 'ok' : m.minRestMins >= 540 ? 'warn' : 'error'} />
      <Row tag="§ 395.3(b) · 70-hr/8-day cycle"          title="Cycle After Trip"   value={m.cycleAfter}       limit={70} fn={formatHours} l={cycLevel} />

      {/* Post-trip readiness */}
      <Box
        sx={{
          mx: 2,
          my: 1.25,
          p: 1.25,
          bgcolor: m.needsRestart ? '#FFF8F0' : '#F0FDF8',
          border: `1px solid ${m.needsRestart ? '#F5A52433' : '#10B98133'}`,
          display: 'flex',
          gap: 0.875,
          alignItems: 'flex-start',
        }}
      >
        <StatusIcon l={m.needsRestart ? 'warn' : 'ok'} />
        <Box>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#1E2A3A', lineHeight: 1.3 }}>
            {m.needsRestart
              ? '34-Hr Restart Required'
              : `Next load: up to ~${formatHours(Math.min(m.hoursLeft, 11))} driving`}
          </Typography>
          <Typography sx={{ fontSize: '0.625rem', color: '#7A8FA3', mt: 0.375 }}>
            {m.needsRestart
              ? `Restart done: ${format(parseISO(m.restartISO), 'EEE MMM d · HH:mm')}`
              : `Available after: ${format(parseISO(m.tripEndISO), 'EEE MMM d · HH:mm')}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
