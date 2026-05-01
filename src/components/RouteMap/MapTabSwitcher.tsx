import { useState } from 'react'
import { Paper, Box, Typography } from '@mui/material'

const TABS = ['Globe', 'Map', 'Routes'] as const
type MapTab = (typeof TABS)[number]

export function MapTabSwitcher() {
  const [active, setActive] = useState<MapTab>('Map')

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        borderRadius: 50,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        bgcolor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {TABS.map((tab) => (
        <Box
          key={tab}
          onClick={() => setActive(tab)}
          sx={{
            px: 2,
            py: 0.75,
            cursor: 'pointer',
            bgcolor: active === tab ? 'primary.main' : 'transparent',
            transition: 'background 0.15s',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: active === tab ? 'white' : 'text.secondary',
              fontWeight: active === tab ? 500 : 400,
              userSelect: 'none',
            }}
          >
            {tab}
          </Typography>
        </Box>
      ))}
    </Paper>
  )
}
