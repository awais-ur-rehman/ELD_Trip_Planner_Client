import { Card, CardContent, Typography, Box } from '@mui/material'
import { formatMiles } from '@/lib/utils'

interface FeaturedRouteCardProps {
  origin: string
  destination: string
  distanceMiles: number
  totalDays: number
}

export function FeaturedRouteCard({
  origin,
  destination,
  distanceMiles,
  totalDays,
}: FeaturedRouteCardProps) {
  return (
    <Card sx={{ bgcolor: '#F5A524', border: 'none', borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Typography variant="h2" sx={{ color: '#1E2A3A', mb: 0.5 }}>
          {origin}
        </Typography>
        <Typography variant="body2" sx={{ color: '#1E2A3A', opacity: 0.7, mb: 1.5 }}>
          → {destination}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#1E2A3A' }}>
            {formatMiles(distanceMiles)} mi
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#1E2A3A' }}>
            {totalDays} {totalDays === 1 ? 'day' : 'days'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
