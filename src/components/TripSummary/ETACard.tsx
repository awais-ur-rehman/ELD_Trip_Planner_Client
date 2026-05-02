import { Card, CardContent, Typography } from '@mui/material'
import { formatTime, formatDate } from '@/lib/utils'

interface ETACardProps {
  arrivalTimeIso: string | null
}

export function ETACard({ arrivalTimeIso }: ETACardProps) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Estimated Arrival
        </Typography>
        {arrivalTimeIso ? (
          <>
            <Typography sx={{ fontSize: '2rem', fontWeight: 300, lineHeight: 1.1 }}>
              {formatTime(arrivalTimeIso)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(arrivalTimeIso)}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">—</Typography>
        )}
      </CardContent>
    </Card>
  )
}
