import { Card, CardContent, Typography, Avatar, Box } from '@mui/material'

interface DriverCardProps {
  origin: string
  destination: string
}

export function DriverCard({ origin, destination }: DriverCardProps) {
  return (
    <Card sx={{ bgcolor: '#1E2A3A', border: 'none', flex: 1 }}>
      <CardContent
        sx={{
          p: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
          '&:last-child': { pb: 2 },
        }}
      >
        {/* Driver row */}
        <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
          <Avatar
            sx={{
              bgcolor: 'secondary.main',
              width: 38,
              height: 38,
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: '#1E2A3A',
              flexShrink: 0,
            }}
          >
            D
          </Avatar>
          <Box>
            <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.8125rem', lineHeight: 1.2 }}>
              Driver
            </Typography>
            <Typography
              sx={{
                color: '#93B1C2',
                fontSize: '0.625rem',
                fontFamily: '"JetBrains Mono", monospace',
                mt: 0.125,
              }}
            >
              TRK-001
            </Typography>
          </Box>
        </Box>

        {/* Divider */}
        <Box sx={{ borderTop: '1px solid #2D3F54', pt: 1, display: 'flex', flexDirection: 'column', gap: 0.875 }}>
          {/* From */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.5625rem',
                color: '#93B1C2',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                fontWeight: 600,
                mb: 0.25,
              }}
            >
              From
            </Typography>
            <Typography
              sx={{
                fontSize: '0.6875rem',
                color: 'white',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {origin}
            </Typography>
          </Box>
          {/* To */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.5625rem',
                color: '#93B1C2',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                fontWeight: 600,
                mb: 0.25,
              }}
            >
              To
            </Typography>
            <Typography
              sx={{
                fontSize: '0.6875rem',
                color: 'white',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {destination}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
