import { useEffect, useRef, memo } from 'react'
import { Box } from '@mui/material'
import { STATUS_COLORS, STATUS_ROW_INDEX } from '@/constants/colors'
import type { DailyLog } from '@/types/trip'

const CANVAS_WIDTH = 840
const CANVAS_HEIGHT = 360
const GRID_LEFT = 120
const PX_PER_HOUR = 30
const ROW_HEIGHT = 44
const GRID_TOP = 80
const PAPER_COLOR = '#FAFAF5'
const GRID_COLOR = '#CACACA'
const BORDER_COLOR = '#424242'

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
    drawRemarks(ctx, log)
    drawTotals(ctx, log)
  }, [log])

  return (
    <Box sx={{ overflowX: 'auto', bgcolor: PAPER_COLOR }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ display: 'block' }}
      />
    </Box>
  )
})

function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = PAPER_COLOR
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  const gridWidth = 24 * PX_PER_HOUR
  const gridHeight = 4 * ROW_HEIGHT

  ctx.strokeStyle = BORDER_COLOR
  ctx.lineWidth = 1.5
  ctx.strokeRect(GRID_LEFT, GRID_TOP, gridWidth, gridHeight)

  ctx.strokeStyle = GRID_COLOR
  ctx.lineWidth = 0.5

  for (let h = 1; h < 24; h++) {
    const x = GRID_LEFT + h * PX_PER_HOUR
    ctx.beginPath()
    ctx.moveTo(x, GRID_TOP)
    ctx.lineTo(x, GRID_TOP + gridHeight)
    ctx.stroke()
  }

  for (let r = 1; r < 4; r++) {
    const y = GRID_TOP + r * ROW_HEIGHT
    ctx.beginPath()
    ctx.moveTo(GRID_LEFT, y)
    ctx.lineTo(GRID_LEFT + gridWidth, y)
    ctx.stroke()
  }

  ctx.fillStyle = '#424242'
  ctx.font = '9px Inter, sans-serif'
  ctx.textAlign = 'center'
  for (let h = 0; h <= 24; h += 2) {
    const x = GRID_LEFT + h * PX_PER_HOUR
    const label = h === 0 ? 'M' : h === 12 ? 'N' : h === 24 ? 'M' : String(h > 12 ? h - 12 : h)
    ctx.fillText(label, x, GRID_TOP - 6)
  }
}

function drawRowLabels(ctx: CanvasRenderingContext2D) {
  const labels = ['Off Duty', 'Sleeper\nBerth', 'Driving', 'On Duty\nNot Drv.']
  ctx.font = '9px Inter, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillStyle = '#424242'

  labels.forEach((label, i) => {
    const y = GRID_TOP + i * ROW_HEIGHT + ROW_HEIGHT / 2
    const lines = label.split('\n')
    if (lines.length === 1) {
      ctx.fillText(label, GRID_LEFT - 6, y + 3)
    } else {
      ctx.fillText(lines[0], GRID_LEFT - 6, y - 3)
      ctx.fillText(lines[1], GRID_LEFT - 6, y + 9)
    }
  })
}

function drawStatusLines(ctx: CanvasRenderingContext2D, log: DailyLog) {
  let prevStatus: string | null = null
  let prevRowY: number | null = null
  let prevX: number | null = null

  log.entries.forEach((entry) => {
    const rowIdx = STATUS_ROW_INDEX[entry.status as keyof typeof STATUS_ROW_INDEX] ?? 0
    const color = STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] ?? '#6B7280'
    const rowY = GRID_TOP + rowIdx * ROW_HEIGHT + ROW_HEIGHT / 2
    const x1 = GRID_LEFT + entry.start_hour * PX_PER_HOUR
    const x2 = GRID_LEFT + entry.end_hour * PX_PER_HOUR

    if (prevRowY !== null && prevX !== null && prevStatus !== entry.status) {
      ctx.strokeStyle = '#424242'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(x1, prevRowY)
      ctx.lineTo(x1, rowY)
      ctx.stroke()
    }

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x1, rowY, 3, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = color
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(x1, rowY)
    ctx.lineTo(x2, rowY)
    ctx.stroke()

    if (entry.is_stationary) {
      const bracketY = GRID_TOP + 4 * ROW_HEIGHT + 8
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(x1, bracketY)
      ctx.lineTo(x1, bracketY + 8)
      ctx.lineTo(x2, bracketY + 8)
      ctx.lineTo(x2, bracketY)
      ctx.stroke()
    }

    prevStatus = entry.status
    prevRowY = rowY
    prevX = x2
  })
}

function drawRemarks(ctx: CanvasRenderingContext2D, log: DailyLog) {
  const remarksY = GRID_TOP + 4 * ROW_HEIGHT + 28

  ctx.strokeStyle = GRID_COLOR
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(GRID_LEFT, remarksY)
  ctx.lineTo(GRID_LEFT + 24 * PX_PER_HOUR, remarksY)
  ctx.stroke()

  ctx.font = '8px Inter, sans-serif'
  ctx.fillStyle = '#6B7280'
  ctx.textAlign = 'left'
  ctx.fillText('Remarks', 4, remarksY + 12)

  log.remarks.forEach((remark) => {
    const x = GRID_LEFT + remark.time_hour * PX_PER_HOUR

    ctx.strokeStyle = '#424242'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x - 4, remarksY + 4)
    ctx.lineTo(x + 4, remarksY + 18)
    ctx.stroke()

    ctx.font = '7px Inter, sans-serif'
    ctx.fillStyle = '#424242'
    ctx.textAlign = 'center'
    const label = remark.activity ?? remark.location
    ctx.fillText(label.substring(0, 12), x, remarksY + 30)
  })
}

function drawTotals(ctx: CanvasRenderingContext2D, log: DailyLog) {
  const totalsX = GRID_LEFT + 24 * PX_PER_HOUR + 10
  const entries = [
    { label: 'Off Duty', value: log.totals.off_duty },
    { label: 'Sleeper', value: log.totals.sleeper_berth },
    { label: 'Driving', value: log.totals.driving },
    { label: 'On Duty', value: log.totals.on_duty_not_driving },
  ]

  entries.forEach((entry, i) => {
    const y = GRID_TOP + i * ROW_HEIGHT + ROW_HEIGHT / 2
    ctx.font = '8px Inter, sans-serif'
    ctx.fillStyle = '#6B7280'
    ctx.textAlign = 'left'
    ctx.fillText(`${entry.value.toFixed(1)}h`, totalsX, y + 3)
  })
}
