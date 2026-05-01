import { Card, CardContent, Typography, Avatar, Box } from '@mui/material'

export function DriverCard() {
  return (
    <Card sx={{ bgcolor: '#1E2A3A', border: 'none', borderRadius: 3 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36, mb: 1, fontSize: '0.875rem' }}>
          DR
        </Avatar>
        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
          Driver
        </Typography>
        <Typography variant="body2" sx={{ color: '#93B1C2' }}>
          TRK-001
        </Typography>
      </CardContent>
    </Card>
  )
}
