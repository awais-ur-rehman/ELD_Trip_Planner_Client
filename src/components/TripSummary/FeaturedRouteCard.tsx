import { Card, CardContent, Typography, Box } from '@mui/material'
import { LocalShipping as LocalShippingIcon } from '@mui/icons-material'
import { formatMiles } from '@/lib/utils'

interface FeaturedRouteCardProps {
  origin: string
  destination: string
  distanceMiles: number
  totalDays: number
  stopCount: number
}

export function FeaturedRouteCard({
  origin,
  destination,
  distanceMiles,
  totalDays,
  stopCount,
}: FeaturedRouteCardProps) {
  return (
    <Card sx={{ bgcolor: '#F5A524', border: 'none' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Subtitle + icon */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
          <Typography
            sx={{
              fontSize: '0.5625rem',
              fontWeight: 700,
              color: 'rgba(30,42,58,0.55)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              lineHeight: 1,
              mt: 0.25,
            }}
          >
            Active Route · Spotter AI
          </Typography>
          <LocalShippingIcon sx={{ fontSize: 22, color: '#1E2A3A', opacity: 0.7, flexShrink: 0 }} />
        </Box>

        {/* Route */}
        <Typography
          sx={{
            fontSize: '1.0625rem',
            fontWeight: 700,
            color: '#1E2A3A',
            lineHeight: 1.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 1.25,
          }}
        >
          {origin}{' '}
          <Box component="span" sx={{ opacity: 0.5, fontWeight: 400 }}>→</Box>{' '}
          {destination}
        </Typography>

        {/* Stats */}
        <Box
          sx={{
            display: 'flex',
            gap: 2.5,
            pt: 1.25,
            borderTop: '1px solid rgba(30,42,58,0.15)',
          }}
        >
          {[
            { v: formatMiles(distanceMiles), l: 'Miles' },
            { v: String(totalDays),          l: totalDays === 1 ? 'Day' : 'Days' },
            { v: String(stopCount),          l: 'Stops' },
          ].map((s) => (
            <Box key={s.l}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: '#1E2A3A',
                  lineHeight: 1,
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                {s.v}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.5625rem',
                  fontWeight: 700,
                  color: 'rgba(30,42,58,0.45)',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  mt: 0.375,
                }}
              >
                {s.l}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
