import { useCallback, type KeyboardEvent } from 'react'
import { Paper, Box, Typography } from '@mui/material'

export const MAP_TABS = ['Map', 'Routes'] as const
export type MapTab = (typeof MAP_TABS)[number]

interface MapTabSwitcherProps {
  activeTab: MapTab
  onChange: (tab: MapTab) => void
}

export function MapTabSwitcher({ activeTab, onChange }: MapTabSwitcherProps) {
  const handleKeyDown = useCallback(
    (tab: MapTab, e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onChange(tab)
      }
      if (e.key === 'ArrowRight') {
        const idx = MAP_TABS.indexOf(tab)
        onChange(MAP_TABS[(idx + 1) % MAP_TABS.length])
      }
      if (e.key === 'ArrowLeft') {
        const idx = MAP_TABS.indexOf(tab)
        onChange(MAP_TABS[(idx - 1 + MAP_TABS.length) % MAP_TABS.length])
      }
    },
    [onChange],
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
      {MAP_TABS.map((tab) => {
        const isActive = activeTab === tab
        return (
          <Box
            key={tab}
            role="tab"
            tabIndex={isActive ? 0 : -1}
            aria-selected={isActive}
            onClick={() => onChange(tab)}
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
