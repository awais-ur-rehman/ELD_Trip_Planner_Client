import { useState, useCallback, type KeyboardEvent } from 'react'
import { Paper, Box, Typography } from '@mui/material'

const TABS = ['Globe', 'Map', 'Routes'] as const
type MapTab = (typeof TABS)[number]

export function MapTabSwitcher() {
  const [active, setActive] = useState<MapTab>('Map')

  const handleKeyDown = useCallback(
    (tab: MapTab, e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setActive(tab)
      }
      if (e.key === 'ArrowRight') {
        const idx = TABS.indexOf(tab)
        setActive(TABS[(idx + 1) % TABS.length])
      }
      if (e.key === 'ArrowLeft') {
        const idx = TABS.indexOf(tab)
        setActive(TABS[(idx - 1 + TABS.length) % TABS.length])
      }
    },
    [],
  )

  return (
    <Paper
      elevation={0}
      role="tablist"
      aria-label="Map view"
      sx={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        borderRadius: '9999px',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        bgcolor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab
        return (
          <Box
            key={tab}
            role="tab"
            tabIndex={isActive ? 0 : -1}
            aria-selected={isActive}
            onClick={() => setActive(tab)}
            onKeyDown={(e) => handleKeyDown(tab, e)}
            sx={{
              px: 2,
              py: 0.75,
              cursor: 'pointer',
              bgcolor: isActive ? 'primary.main' : 'transparent',
              transition: 'background-color 0.15s',
              outline: 'none',
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'secondary.main',
                outlineOffset: -2,
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: isActive ? 'white' : 'text.secondary',
                fontWeight: isActive ? 500 : 400,
                userSelect: 'none',
              }}
            >
              {tab}
            </Typography>
          </Box>
        )
      })}
    </Paper>
  )
}
