import { useEffect, useRef, memo } from 'react'
import { Box } from '@mui/material'
import { STATUS_COLORS, STATUS_ROW_INDEX } from '@/constants/colors'
import type { DailyLog } from '@/types/trip'

// ── Canvas Layout Constants ─────────────────────────────────────────────────
const CANVAS_WIDTH   = 900
const CANVAS_HEIGHT  = 400
const GRID_LEFT      = 120   // px — row labels live in [0, GRID_LEFT]
const GRID_TOP       = 110   // px — hour labels + padding above grid
const PX_PER_HOUR    = 30    // 24h × 30 = 720px wide grid
const ROW_HEIGHT     = 44    // 4 rows × 44 = 176px grid height
const TOTALS_GAP     = 12    // gap between grid right edge and totals column
const TOTALS_WIDTH   = 56    // width of totals column box
const REMARKS_TOP    = GRID_TOP + 4 * ROW_HEIGHT + 22   // below bracket zone
const GRID_WIDTH     = 24 * PX_PER_HOUR                  // 720
const GRID_HEIGHT    = 4 * ROW_HEIGHT                    // 176

// ── Colors ───────────────────────────────────────────────────────────────────
const PAPER_COLOR  = '#FAFAF5'
const GRID_COLOR   = '#CACACA'
const BORDER_COLOR = '#424242'
const LABEL_COLOR  = '#6B7280'

interface LogCanvasProps {
  log: DailyLog
}

export const LogCanvas = memo(function LogCanvas({ log }: LogCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    drawBackground(ctx)
    drawGrid(ctx)
    drawRowLabels(ctx)
    drawStatusLines(ctx, log)
    drawTotals(ctx, log)
    drawRemarks(ctx, log)
  }, [log])

  return (
    <Box sx={{ overflowX: 'auto', bgcolor: PAPER_COLOR }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ display: 'block' }}
        aria-label="ELD daily log chart"
        role="img"
      />
    </Box>
  )
})

// ── 1. Background ─────────────────────────────────────────────────────────────
function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = PAPER_COLOR
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

// ── 2. Grid — outer border, row dividers, hour columns, hour labels ────────────
function drawGrid(ctx: CanvasRenderingContext2D) {
  // Outer border
  ctx.strokeStyle = BORDER_COLOR
  ctx.lineWidth   = 1.5
  ctx.strokeRect(GRID_LEFT, GRID_TOP, GRID_WIDTH, GRID_HEIGHT)

  // Hour column lines (major every 2h, minor every 1h)
  for (let h = 1; h < 24; h++) {
    const x   = GRID_LEFT + h * PX_PER_HOUR
    const isMajor = h % 2 === 0
    ctx.strokeStyle = isMajor ? '#BBBBBB' : GRID_COLOR
    ctx.lineWidth   = isMajor ? 0.75 : 0.4
    ctx.beginPath()
    ctx.moveTo(x, GRID_TOP)
    ctx.lineTo(x, GRID_TOP + GRID_HEIGHT)
    ctx.stroke()
  }

  // Half-hour tick marks at top and bottom of grid
  for (let h = 0; h < 24; h++) {
    const x  = GRID_LEFT + h * PX_PER_HOUR + PX_PER_HOUR / 2
    const tickLen = 4
    ctx.strokeStyle = GRID_COLOR
    ctx.lineWidth   = 0.5
    ctx.beginPath()
    ctx.moveTo(x, GRID_TOP)
    ctx.lineTo(x, GRID_TOP + tickLen)
    ctx.moveTo(x, GRID_TOP + GRID_HEIGHT - tickLen)
    ctx.lineTo(x, GRID_TOP + GRID_HEIGHT)
    ctx.stroke()
  }

  // Row dividers
  ctx.strokeStyle = GRID_COLOR
  ctx.lineWidth   = 0.75
  for (let r = 1; r < 4; r++) {
    const y = GRID_TOP + r * ROW_HEIGHT
    ctx.beginPath()
    ctx.moveTo(GRID_LEFT, y)
    ctx.lineTo(GRID_LEFT + GRID_WIDTH, y)
    ctx.stroke()
  }

  // Hour labels above grid
  ctx.fillStyle  = BORDER_COLOR
  ctx.font       = '9px Inter, sans-serif'
  ctx.textAlign  = 'center'
  for (let h = 0; h <= 24; h += 2) {
    const x     = GRID_LEFT + h * PX_PER_HOUR
    const label = h === 0 || h === 24 ? 'M' : h === 12 ? 'N' : String(h > 12 ? h - 12 : h)
    ctx.fillText(label, x, GRID_TOP - 6)
  }

  // "Midnight" / "Noon" sub-labels
  ctx.font      = '7px Inter, sans-serif'
  ctx.fillStyle = LABEL_COLOR
  ctx.fillText('Midnight', GRID_LEFT, GRID_TOP - 18)
  ctx.fillText('Noon',     GRID_LEFT + 12 * PX_PER_HOUR, GRID_TOP - 18)
  ctx.fillText('Midnight', GRID_LEFT + 24 * PX_PER_HOUR, GRID_TOP - 18)
}

// ── 3. Row labels ─────────────────────────────────────────────────────────────
function drawRowLabels(ctx: CanvasRenderingContext2D) {
  const labels = [
    ['Off Duty'],
    ['Sleeper', 'Berth'],
    ['Driving'],
    ['On Duty', 'Not Drv.'],
  ]

  ctx.font      = '9px Inter, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillStyle = BORDER_COLOR

  labels.forEach((lines, i) => {
    const rowCenterY = GRID_TOP + i * ROW_HEIGHT + ROW_HEIGHT / 2
    if (lines.length === 1) {
      ctx.fillText(lines[0], GRID_LEFT - 6, rowCenterY + 3)
    } else {
      ctx.fillText(lines[0], GRID_LEFT - 6, rowCenterY - 3)
      ctx.fillText(lines[1], GRID_LEFT - 6, rowCenterY + 9)
    }
  })
}

// ── 4. Status lines — 5 FMCSA primitives ─────────────────────────────────────
//
//  Primitive 1: Dot at transition point (start of each segment)
//  Primitive 2: Horizontal status line (colored, spans segment duration)
//  Primitive 3: Vertical connector between rows (dark, at transition x)
//  Primitive 4: Bracket below Row 4 when is_stationary === true
//  Primitive 5: 45° slash flag in Remarks band (drawn in drawRemarks)
//
function drawStatusLines(ctx: CanvasRenderingContext2D, log: DailyLog) {
  let prevRowY: number | null = null

  log.entries.forEach((entry) => {
    const rowIdx = STATUS_ROW_INDEX[entry.status as keyof typeof STATUS_ROW_INDEX] ?? 0
    const color  = STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] ?? '#6B7280'
    const rowY   = GRID_TOP + rowIdx * ROW_HEIGHT + ROW_HEIGHT / 2
    const x1     = GRID_LEFT + entry.start_hour * PX_PER_HOUR
    const x2     = GRID_LEFT + entry.end_hour   * PX_PER_HOUR

    // Primitive 3: Vertical connector (draw first so it sits behind the dot)
    if (prevRowY !== null && prevRowY !== rowY) {
      ctx.strokeStyle = BORDER_COLOR
      ctx.lineWidth   = 1.5
      ctx.beginPath()
      ctx.moveTo(x1, prevRowY)
      ctx.lineTo(x1, rowY)
      ctx.stroke()
    }

    // Primitive 1: Dot at transition point
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x1, rowY, 3, 0, Math.PI * 2)
    ctx.fill()

    // Primitive 2: Horizontal status line
    ctx.strokeStyle = color
    ctx.lineWidth   = 2.5
    ctx.beginPath()
    ctx.moveTo(x1, rowY)
    ctx.lineTo(x2, rowY)
    ctx.stroke()

    // Primitive 4: Bracket below row 4 if stationary activity
    if (entry.is_stationary) {
      const bracketTop = GRID_TOP + GRID_HEIGHT + 4
      const bracketBot = bracketTop + 7
      ctx.strokeStyle  = color
      ctx.lineWidth    = 1.5
      ctx.beginPath()
      ctx.moveTo(x1, bracketTop)
      ctx.lineTo(x1, bracketBot)
      ctx.lineTo(x2, bracketBot)
      ctx.lineTo(x2, bracketTop)
      ctx.stroke()
    }

    prevRowY = rowY
  })

  // Closing dot at final segment end
  if (log.entries.length > 0) {
    const last    = log.entries[log.entries.length - 1]
    const rowIdx  = STATUS_ROW_INDEX[last.status as keyof typeof STATUS_ROW_INDEX] ?? 0
    const color   = STATUS_COLORS[last.status as keyof typeof STATUS_COLORS] ?? '#6B7280'
    const lastY   = GRID_TOP + rowIdx * ROW_HEIGHT + ROW_HEIGHT / 2
    const lastX   = GRID_LEFT + last.end_hour * PX_PER_HOUR
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2)
    ctx.fill()
  }
}

// ── 5. Totals column ─────────────────────────────────────────────────────────
function drawTotals(ctx: CanvasRenderingContext2D, log: DailyLog) {
  const totalsX = GRID_LEFT + GRID_WIDTH + TOTALS_GAP
  const rows = [
    { label: 'Off Duty', value: log.totals.off_duty,            status: 'off_duty' as const },
    { label: 'Sleeper',  value: log.totals.sleeper_berth,       status: 'sleeper_berth' as const },
    { label: 'Driving',  value: log.totals.driving,             status: 'driving' as const },
    { label: 'On Duty',  value: log.totals.on_duty_not_driving, status: 'on_duty_not_driving' as const },
  ]

  // Column header
  ctx.font      = '8px Inter, sans-serif'
  ctx.fillStyle = LABEL_COLOR
  ctx.textAlign = 'center'
  ctx.fillText('Total', totalsX + TOTALS_WIDTH / 2, GRID_TOP - 18)
  ctx.fillText('Hours', totalsX + TOTALS_WIDTH / 2, GRID_TOP - 8)

  rows.forEach((row, i) => {
    const y      = GRID_TOP + i * ROW_HEIGHT
    const color  = STATUS_COLORS[row.status]
    const cellH  = ROW_HEIGHT

    // Cell border
    ctx.strokeStyle = GRID_COLOR
    ctx.lineWidth   = 0.75
    ctx.strokeRect(totalsX, y, TOTALS_WIDTH, cellH)

    // Color accent bar (left edge)
    ctx.fillStyle = color
    ctx.fillRect(totalsX, y, 3, cellH)

    // Value
    ctx.font      = '11px Inter, sans-serif'
    ctx.fillStyle = BORDER_COLOR
    ctx.textAlign = 'center'
    ctx.fillText(`${row.value.toFixed(1)}`, totalsX + TOTALS_WIDTH / 2 + 2, y + cellH / 2 + 4)
  })

  // Total sum row
  const totalSum  = log.totals.off_duty + log.totals.sleeper_berth + log.totals.driving + log.totals.on_duty_not_driving
  const sumY      = GRID_TOP + 4 * ROW_HEIGHT
  ctx.strokeStyle = BORDER_COLOR
  ctx.lineWidth   = 1
  ctx.strokeRect(totalsX, sumY, TOTALS_WIDTH, 18)
  ctx.font        = '9px Inter, sans-serif'
  ctx.fillStyle   = BORDER_COLOR
  ctx.textAlign   = 'center'
  ctx.fillText(`${totalSum.toFixed(1)}h`, totalsX + TOTALS_WIDTH / 2, sumY + 12)
}

// ── 6. Remarks band with 45° slash flags (Primitive 5) ───────────────────────
function drawRemarks(ctx: CanvasRenderingContext2D, log: DailyLog) {
  // Remarks section line
  ctx.strokeStyle = GRID_COLOR
  ctx.lineWidth   = 0.5
  ctx.beginPath()
  ctx.moveTo(GRID_LEFT, REMARKS_TOP)
  ctx.lineTo(GRID_LEFT + GRID_WIDTH, REMARKS_TOP)
  ctx.stroke()

  // Section label
  ctx.font      = '8px Inter, sans-serif'
  ctx.fillStyle = LABEL_COLOR
  ctx.textAlign = 'left'
  ctx.fillText('Remarks', 4, REMARKS_TOP + 14)

  log.remarks.forEach((remark) => {
    const x        = GRID_LEFT + remark.time_hour * PX_PER_HOUR
    const flagSize = 10

    // Primitive 5: 45° slash flag
    ctx.strokeStyle = BORDER_COLOR
    ctx.lineWidth   = 1.2
    ctx.beginPath()
    ctx.moveTo(x - flagSize / 2, REMARKS_TOP + flagSize)
    ctx.lineTo(x + flagSize / 2, REMARKS_TOP + 2)
    ctx.stroke()

    // Tick at base of flag
    ctx.beginPath()
    ctx.moveTo(x - flagSize / 2, REMARKS_TOP + flagSize - 2)
    ctx.lineTo(x - flagSize / 2, REMARKS_TOP + flagSize + 2)
    ctx.stroke()

    // Activity label below flag
    const label = remark.activity ?? remark.location
    ctx.font      = '7px Inter, sans-serif'
    ctx.fillStyle = BORDER_COLOR
    ctx.textAlign = 'center'
    ctx.fillText(label.substring(0, 14), x, REMARKS_TOP + flagSize + 18)

    // Time label
    const timeH   = Math.floor(remark.time_hour)
    const timeM   = Math.round((remark.time_hour % 1) * 60)
    const timeTxt = `${String(timeH).padStart(2, '0')}:${String(timeM).padStart(2, '0')}`
    ctx.font      = '6px Inter, sans-serif'
    ctx.fillStyle = LABEL_COLOR
    ctx.fillText(timeTxt, x, REMARKS_TOP + flagSize + 28)
  })
}
