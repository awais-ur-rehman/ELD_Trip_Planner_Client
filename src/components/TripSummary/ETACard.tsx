import { Card, CardContent, Typography, Box } from '@mui/material'
import { formatTime, formatDate } from '@/lib/utils'

function ClockFace({ hour, minute }: { hour: number; minute: number }) {
  const hourAngle = ((hour % 12) + minute / 60) * 30
  const minuteAngle = minute * 6

  const toRad = (deg: number) => (deg - 90) * (Math.PI / 180)
  const cx = 20
  const cy = 20
  const r = 14

  const hx = cx + 8 * Math.cos(toRad(hourAngle))
  const hy = cy + 8 * Math.sin(toRad(hourAngle))
  const mx = cx + 11 * Math.cos(toRad(minuteAngle))
  const my = cy + 11 * Math.sin(toRad(minuteAngle))

  return (
    <Box
      component="svg"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={{ width: 40, height: 40, flexShrink: 0 }}
      aria-hidden
    >
      <circle cx={cx} cy={cy} r={r} stroke="#93B1C2" strokeWidth="1.5" />
      {[0, 90, 180, 270].map((angle) => {
        const tx = cx + (r - 2) * Math.cos(toRad(angle))
        const ty = cy + (r - 2) * Math.sin(toRad(angle))
        return (
          <circle key={angle} cx={tx} cy={ty} r="1" fill="#93B1C2" opacity="0.5" />
        )
      })}
      <line
        x1={cx} y1={cy}
        x2={hx} y2={hy}
        stroke="#93B1C2" strokeWidth="2" strokeLinecap="round"
      />
      <line
        x1={cx} y1={cy}
        x2={mx} y2={my}
        stroke="#93B1C2" strokeWidth="1.5" strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="2" fill="#93B1C2" />
    </Box>
  )
}

interface ETACardProps {
  arrivalTimeIso: string | null
}

export function ETACard({ arrivalTimeIso }: ETACardProps) {
  let hour = 9
  let minute = 0

  if (arrivalTimeIso) {
    const d = new Date(arrivalTimeIso)
    hour = d.getHours()
    minute = d.getMinutes()
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent
        sx={{
          p: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '&:last-child': { pb: 2 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', lineHeight: 1.3 }}
          >
            Estimated
            <br />
            Arrival
          </Typography>
          <ClockFace hour={hour} minute={minute} />
        </Box>

        {arrivalTimeIso ? (
          <Box>
            <Typography
              sx={{
                fontSize: '1.625rem',
                fontWeight: 300,
                lineHeight: 1,
                color: 'text.primary',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatTime(arrivalTimeIso)}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.6875rem', mt: 0.25 }}
            >
              {formatDate(arrivalTimeIso)}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
