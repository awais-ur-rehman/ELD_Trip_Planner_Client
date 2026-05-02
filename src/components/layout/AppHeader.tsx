import { AppBar, Toolbar, Typography, Chip, Box } from '@mui/material'
import { LocalShipping as LocalShippingIcon } from '@mui/icons-material'

export function AppHeader() {
  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main', zIndex: 10 }}>
      <Toolbar sx={{ minHeight: 64, px: 3 }}>
        <LocalShippingIcon sx={{ color: 'secondary.main', mr: 1.5, fontSize: 24 }} />
        <Typography variant="h2" sx={{ color: 'white', flexGrow: 1 }}>
          ELD Trip Planner
        </Typography>
        <Chip
          label="FMCSA HOS Compliant"
          variant="outlined"
          size="small"
          sx={{
            borderColor: 'rgba(147, 177, 194, 0.4)',
            color: 'secondary.main',
            fontSize: '0.6875rem',
            letterSpacing: '0.5px',
          }}
        />
      </Toolbar>
    </AppBar>
  )
}
