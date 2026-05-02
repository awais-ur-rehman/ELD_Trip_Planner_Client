import { Box, Typography, Divider } from '@mui/material'
import { formatDate, formatShortLocation } from '@/lib/utils'
import type { DailyLog } from '@/types/trip'

interface LogSheetHeaderProps {
  log: DailyLog
}

export function LogSheetHeader({ log }: LogSheetHeaderProps) {
  const dateStr = formatDate(log.date)

  return (
    <Box
      sx={{
        bgcolor: '#FAFAF5',
        px: 2,
        pt: 1.5,
        pb: 1,
        borderBottom: '1px solid #CACACA',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#424242' }}>
            DRIVER'S DAILY LOG
          </Typography>
          <Typography sx={{ fontSize: '0.625rem', color: '#6B7280', mt: 0.25 }}>
            ONE CALENDAR DAY — 24 HOURS
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '0.625rem', color: '#6B7280' }}>
          ORIGINAL — Submit within 13 days
        </Typography>
      </Box>
      <Divider sx={{ my: 1, borderColor: '#CACACA' }} />
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box>
          <Typography sx={{ fontSize: '0.625rem', color: '#6B7280', textTransform: 'uppercase' }}>
            Date
          </Typography>
          <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, color: '#424242' }}>
            {dateStr}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.625rem', color: '#6B7280', textTransform: 'uppercase' }}>
            Total Miles
          </Typography>
          <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, color: '#424242' }}>
            {log.total_miles_today}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.625rem', color: '#6B7280', textTransform: 'uppercase' }}>
            From
          </Typography>
          <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, color: '#424242' }}>
            {formatShortLocation(log.from_location)}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.625rem', color: '#6B7280', textTransform: 'uppercase' }}>
            To
          </Typography>
          <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, color: '#424242' }}>
            {formatShortLocation(log.to_location)}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
