import { Card, CardContent, Typography, Box } from '@mui/material'
import { formatMiles, formatHours } from '@/lib/utils'

function TruckIllustration() {
  return (
    <Box
      component="svg"
      viewBox="0 0 80 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={{ width: 72, height: 40, flexShrink: 0, opacity: 0.85 }}
      aria-hidden
    >
      <rect x="1" y="7" width="46" height="24" rx="2" stroke="#1E2A3A" strokeWidth="2" />
      <path d="M47 13 L47 31 L72 31 L72 22 L64 13 Z" stroke="#1E2A3A" strokeWidth="2" />
      <path d="M49 13 L49 21 L68 21 L68 16 L62 13 Z" fill="#1E2A3A" fillOpacity="0.15" />
      <line x1="0" y1="31" x2="78" y2="31" stroke="#1E2A3A" strokeWidth="1.5" strokeOpacity="0.4" />
      <circle cx="16" cy="36" r="5" stroke="#1E2A3A" strokeWidth="2" />
      <circle cx="16" cy="36" r="2" fill="#1E2A3A" fillOpacity="0.3" />
      <circle cx="36" cy="36" r="5" stroke="#1E2A3A" strokeWidth="2" />
      <circle cx="36" cy="36" r="2" fill="#1E2A3A" fillOpacity="0.3" />
      <circle cx="60" cy="36" r="5" stroke="#1E2A3A" strokeWidth="2" />
      <circle cx="60" cy="36" r="2" fill="#1E2A3A" fillOpacity="0.3" />
      <line x1="47" y1="20" x2="47" y2="31" stroke="#1E2A3A" strokeWidth="1.5" />
    </Box>
  )
}

interface FeaturedRouteCardProps {
  origin: string
  destination: string
  distanceMiles: number
  totalDays: number
  totalDrivingHours: number
}

export function FeaturedRouteCard({
  origin,
  destination,
  distanceMiles,
  totalDays,
  totalDrivingHours,
}: FeaturedRouteCardProps) {
  return (
    <Card sx={{ bgcolor: '#F5A524', border: 'none', borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                color: '#1E2A3A',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {origin}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, my: 0.5 }}>
              <Box
                sx={{
                  width: 14,
                  height: 1.5,
                  bgcolor: '#1E2A3A',
                  opacity: 0.4,
                  borderRadius: 1,
                }}
              />
              <Box
                component="span"
                sx={{ fontSize: '0.75rem', color: '#1E2A3A', opacity: 0.6 }}
              >
                →
              </Box>
            </Box>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '0.875rem',
                color: '#1E2A3A',
                opacity: 0.75,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {destination}
            </Typography>
          </Box>
          <TruckIllustration />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mt: 1.5,
            pt: 1.5,
            borderTop: '1px solid rgba(30,42,58,0.15)',
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#1E2A3A', lineHeight: 1 }}>
              {formatMiles(distanceMiles)}
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: '#1E2A3A', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              miles
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#1E2A3A', lineHeight: 1 }}>
              {totalDays}
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: '#1E2A3A', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {totalDays === 1 ? 'day' : 'days'}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#1E2A3A', lineHeight: 1 }}>
              {formatHours(totalDrivingHours)}
            </Typography>
            <Typography sx={{ fontSize: '0.6875rem', color: '#1E2A3A', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              driving
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
