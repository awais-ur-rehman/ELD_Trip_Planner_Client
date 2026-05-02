import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#E4ECF2',
      paper: '#FFFFFF',
    },
    primary: {
      main: '#1E2A3A',
      light: '#2D3F54',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#93B1C2',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#424242',
      secondary: '#7A8FA3',
    },
    divider: '#D5DEE3',
    warning: { main: '#F5A524' },
    error: { main: '#EF4444' },
    success: { main: '#10B981' },
    info: { main: '#3B82F6' },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontSize: '1.5rem', fontWeight: 600 },
    h2: { fontSize: '1.125rem', fontWeight: 500 },
    h3: { fontSize: '0.9375rem', fontWeight: 500 },
    body1: { fontSize: '0.875rem', lineHeight: 1.6 },
    body2: { fontSize: '0.75rem', lineHeight: 1.5 },
    caption: {
      fontSize: '0.6875rem',
      letterSpacing: '0.5px',
      textTransform: 'uppercase' as const,
    },
    button: { fontWeight: 500, textTransform: 'none' as const },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 0, padding: '10px 20px' },
        containedPrimary: {
          backgroundColor: '#1E2A3A',
          '&:hover': { backgroundColor: '#2D3F54' },
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#F4F7FA',
            borderRadius: 0,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#93B1C2',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid #D5DEE3',
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minWidth: 80,
        },
      },
    },
  },
})
