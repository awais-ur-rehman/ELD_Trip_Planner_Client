import { Box, Typography } from '@mui/material'
import { formatDate, formatShortLocation } from '@/lib/utils'
import type { DailyLog } from '@/types/trip'

interface LogSheetHeaderProps {
  log: DailyLog
  totalDays: number
}

export function LogSheetHeader({ log, totalDays }: LogSheetHeaderProps) {
  const dateStr    = formatDate(log.date)
  const fromShort  = formatShortLocation(log.from_location)
  const toShort    = formatShortLocation(log.to_location)

  return (
    <Box sx={{ bgcolor: '#FAFAF5', fontFamily: '"Inter", sans-serif' }}>
      {/* Dark title bar */}
      <Box
        sx={{
          bgcolor: '#424242',
          px: 2,
          py: 0.75,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            color: 'white',
            fontSize: '0.5rem',
            fontWeight: 600,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          Driver's Daily Log — Original (FMCSA 49 CFR 395.8)
        </Typography>
        {/* Day badge */}
        <Box
          sx={{
            bgcolor: '#E4ECF2',
            px: 1.25,
            py: 0.375,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 36,
          }}
        >
          <Typography sx={{ fontSize: '0.375rem', color: '#7A8FA3', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
            DAY
          </Typography>
          <Typography
            sx={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#424242',
              lineHeight: 1.1,
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            {log.day_number}
          </Typography>
          <Typography sx={{ fontSize: '0.375rem', color: '#7A8FA3' }}>
            / {totalDays}
          </Typography>
        </Box>
      </Box>

      {/* Header fields */}
      <Box sx={{ px: 2, pt: 1, pb: 1.25, borderBottom: '1px solid #CACACA' }}>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box>
            <Typography sx={{ fontSize: '0.4375rem', color: '#7A8FA3', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.25 }}>
              Date
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, color: '#424242' }}>
              {dateStr}
            </Typography>
            <Box sx={{ mt: 0.25, height: '0.5px', bgcolor: '#CACACA', width: 100 }} />
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.4375rem', color: '#7A8FA3', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.25 }}>
              Total Miles
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, color: '#424242', fontFamily: '"JetBrains Mono", monospace' }}>
              {log.total_miles_today}
            </Typography>
            <Box sx={{ mt: 0.25, height: '0.5px', bgcolor: '#CACACA', width: 72 }} />
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.4375rem', color: '#7A8FA3', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.25 }}>
              From
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, color: '#424242' }}>
              {fromShort}
            </Typography>
            <Box sx={{ mt: 0.25, height: '0.5px', bgcolor: '#CACACA', width: 100 }} />
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.4375rem', color: '#7A8FA3', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.25 }}>
              To
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, color: '#424242' }}>
              {toShort}
            </Typography>
            <Box sx={{ mt: 0.25, height: '0.5px', bgcolor: '#CACACA', width: 100 }} />
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.4375rem', color: '#7A8FA3', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.25 }}>
              Carrier/Driver
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, color: '#424242' }}>
              Driver
            </Typography>
            <Box sx={{ mt: 0.25, height: '0.5px', bgcolor: '#CACACA', width: 80 }} />
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.4375rem', color: '#7A8FA3', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.25 }}>
              Truck #
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, color: '#424242', fontFamily: '"JetBrains Mono", monospace' }}>
              TRK-001
            </Typography>
            <Box sx={{ mt: 0.25, height: '0.5px', bgcolor: '#CACACA', width: 60 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
