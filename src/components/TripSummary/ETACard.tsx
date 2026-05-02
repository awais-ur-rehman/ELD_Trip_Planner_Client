import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'

function toRad(deg: number) {
  return (deg - 90) * (Math.PI / 180)
}

function ClockHands({ date }: { date: Date }) {
  const h = date.getHours()
  const m = date.getMinutes()
  const s = date.getSeconds()

  const hDeg = (h % 12) * 30 + m * 0.5
  const mDeg = m * 6 + s * 0.1
  const sDeg = s * 6

  const cx = 32
  const cy = 32

  const hx = cx + 14 * Math.cos(toRad(hDeg))
  const hy = cy + 14 * Math.sin(toRad(hDeg))
  const mx = cx + 22 * Math.cos(toRad(mDeg))
  const my = cy + 22 * Math.sin(toRad(mDeg))
  const sx2 = cx + 25 * Math.cos(toRad(sDeg))
  const sy  = cy + 25 * Math.sin(toRad(sDeg))

  return (
    <Box
      component="svg"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={{ width: 64, height: 64, display: 'block' }}
      aria-hidden
    >
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r="29" fill="none" stroke="#E4ECF2" strokeWidth="2" />
      {/* Tick marks */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = i * 30
        const isMain = i % 3 === 0
        const r1 = isMain ? 24 : 26
        const r2 = 29
        const x1 = cx + r1 * Math.cos(toRad(a + 90))
        const y1 = cy + r1 * Math.sin(toRad(a + 90))
        const x2 = cx + r2 * Math.cos(toRad(a + 90))
        const y2 = cy + r2 * Math.sin(toRad(a + 90))
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#D5DEE3"
            strokeWidth={isMain ? 2 : 1}
          />
        )
      })}
      {/* Hour hand */}
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#424242" strokeWidth="2.5" strokeLinecap="round" />
      {/* Minute hand */}
      <line x1={cx} y1={cy} x2={mx} y2={my} stroke="#424242" strokeWidth="1.5" strokeLinecap="round" />
      {/* Second hand */}
      <line x1={cx} y1={cy} x2={sx2} y2={sy} stroke="#EF4444" strokeWidth="1" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="2.5" fill="#1E2A3A" />
    </Box>
  )
}

export function ETACard() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <Card sx={{ flex: 1, border: 'none', bgcolor: 'white' }}>
      <CardContent
        sx={{
          p: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          '&:last-child': { pb: 2 },
        }}
      >
        <Typography
          sx={{
            fontSize: '0.5625rem',
            color: '#7A8FA3',
            textTransform: 'uppercase',
            letterSpacing: '0.7px',
            fontWeight: 600,
          }}
        >
          Local Time
        </Typography>

        <ClockHands date={now} />

        <Typography
          sx={{
            fontSize: '1.25rem',
            fontWeight: 300,
            color: '#424242',
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: '-1px',
            lineHeight: 1,
          }}
        >
          {timeStr}
        </Typography>

        <Typography sx={{ fontSize: '0.5625rem', color: '#A8BCC9' }}>
          {dateStr}
        </Typography>
      </CardContent>
    </Card>
  )
}
