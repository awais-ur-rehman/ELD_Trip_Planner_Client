import { AppBar, Toolbar, Typography, Box } from '@mui/material'
import { LocalShipping as LocalShippingIcon } from '@mui/icons-material'

interface AppHeaderProps {
  hasResults?: boolean
  onNewTrip?: () => void
}

export function AppHeader({ hasResults, onNewTrip }: AppHeaderProps) {
  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: '#1E2A3A', zIndex: 10, boxShadow: '0 1px 0 rgba(147,177,194,0.15)', minHeight: 56 }}>
      <Toolbar sx={{ minHeight: '56px !important', px: 2.5 }}>
        <LocalShippingIcon sx={{ color: 'secondary.main', mr: 1.5, fontSize: 22 }} />
        <Typography
          sx={{ color: 'white', fontWeight: 600, fontSize: '0.9375rem', letterSpacing: '0.2px', flexGrow: 1 }}
        >
          ELD Trip Planner
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          {/* New Trip button — only when results are visible */}
          {hasResults && onNewTrip && (
            <Box
              component="button"
              onClick={onNewTrip}
              sx={{
                bgcolor: 'transparent',
                border: '1px solid #2D3F54',
                color: '#93B1C2',
                fontSize: '0.6875rem',
                fontWeight: 500,
                px: 1.5,
                py: 0.625,
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '0.2px',
                transition: 'border-color 0.15s, color 0.15s',
                '&:hover': { borderColor: '#93B1C2', color: 'white' },
              }}
            >
              ← New Trip
            </Box>
          )}

          {/* SPOTTER AI badge */}
          <Box
            sx={{
              bgcolor: '#93B1C2',
              color: '#1E2A3A',
              fontSize: '0.5625rem',
              fontWeight: 700,
              letterSpacing: '0.5px',
              px: 0.875,
              py: 0.25,
              lineHeight: 1.6,
            }}
          >
            SPOTTER AI
          </Box>

          {/* FMCSA pill — hidden on mobile to avoid overflow */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'block' },
              border: '1px solid rgba(147,177,194,0.3)',
              borderRadius: '100px',
              px: 1.25,
              py: 0.5,
              fontSize: '0.5625rem',
              color: '#93B1C2',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            FMCSA HOS Compliant
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
