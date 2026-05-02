import { Card, CardContent, Typography, Avatar, Box, Chip } from '@mui/material'

export function DriverCard() {
  return (
    <Card
      sx={{
        bgcolor: '#1E2A3A',
        border: 'none',
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
        <Box>
          <Avatar
            sx={{
              bgcolor: 'secondary.main',
              width: 36,
              height: 36,
              mb: 1.25,
              fontSize: '0.8125rem',
              fontWeight: 600,
            }}
          >
            DR
          </Avatar>
          <Typography
            variant="body2"
            sx={{ color: 'white', fontWeight: 500, lineHeight: 1.3 }}
          >
            Driver
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#93B1C2', fontSize: '0.75rem', mt: 0.25 }}
          >
            TRK-001
          </Typography>
        </Box>

        <Chip
          label="On Duty"
          size="small"
          sx={{
            mt: 1.5,
            alignSelf: 'flex-start',
            height: 18,
            fontSize: '0.625rem',
            fontWeight: 600,
            bgcolor: 'rgba(16,185,129,0.18)',
            color: '#10B981',
            border: '1px solid rgba(16,185,129,0.3)',
            '& .MuiChip-label': { px: 0.75 },
          }}
        />
      </CardContent>
    </Card>
  )
}
