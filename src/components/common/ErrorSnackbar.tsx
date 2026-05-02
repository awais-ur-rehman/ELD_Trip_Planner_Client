import { useEffect, useRef, useState } from 'react'
import { Box, Typography, IconButton, Slide } from '@mui/material'
import {
  ErrorOutline as ErrorOutlineIcon,
  WarningAmber as WarningAmberIcon,
  WifiOff as WifiOffIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import type { ApiError, ApiErrorCode } from '@/lib/api'

const AUTO_HIDE_MS = 8000

const ERROR_META: Record<
  ApiErrorCode | 'unknown',
  { title: string; severity: 'error' | 'warning' }
> = {
  geocoding:  { title: 'Location Not Found',   severity: 'warning' },
  routing:    { title: 'Route Unavailable',     severity: 'error'   },
  validation: { title: 'Invalid Input',         severity: 'warning' },
  server:     { title: 'Server Error',          severity: 'error'   },
  network:    { title: 'Connection Failed',     severity: 'error'   },
  unknown:    { title: 'Something Went Wrong',  severity: 'error'   },
}

const ACCENT: Record<'error' | 'warning', string> = {
  error:   '#EF4444',
  warning: '#F5A524',
}

interface ErrorSnackbarProps {
  error: Error | null
  onClose: () => void
  onRetry?: () => void
}

export function ErrorSnackbar({ error, onClose, onRetry }: ErrorSnackbarProps) {
  const [progress, setProgress] = useState(100)
  const startRef   = useRef<number>(0)
  const frameRef   = useRef<number>(0)

  useEffect(() => {
    if (!error) {
      setProgress(100)
      cancelAnimationFrame(frameRef.current)
      return
    }

    startRef.current = performance.now()

    function tick(now: number) {
      const elapsed  = now - startRef.current
      const pct      = Math.max(0, 100 - (elapsed / AUTO_HIDE_MS) * 100)
      setProgress(pct)
      if (pct > 0) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        onClose()
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [error, onClose])

  const isApiError = error !== null && 'code' in error
  const code       = isApiError ? (error as ApiError).code : 'unknown'
  const meta       = ERROR_META[code as ApiErrorCode] ?? ERROR_META.unknown
  const accent     = ACCENT[meta.severity]

  const Icon =
    code === 'network'
      ? WifiOffIcon
      : meta.severity === 'warning'
        ? WarningAmberIcon
        : ErrorOutlineIcon

  return (
    <Slide direction="left" in={Boolean(error)} mountOnEnter unmountOnExit>
      <Box
        role="alert"
        aria-live="assertive"
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 2000,
          width: 360,
          bgcolor: '#1E2A3A',
          border: `1px solid ${accent}35`,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        }}
      >
        {/* Left accent bar */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            bgcolor: accent,
          }}
        />

        <Box sx={{ p: 2, pl: 2.5 }}>
          {/* Header row */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
            <Icon sx={{ color: accent, fontSize: 17, mt: 0.15, flexShrink: 0 }} />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{ color: 'white', fontWeight: 600, fontSize: '0.8125rem', lineHeight: 1.3 }}
              >
                {meta.title}
              </Typography>
              <Typography
                sx={{ color: '#93B1C2', fontSize: '0.75rem', mt: 0.5, lineHeight: 1.45 }}
              >
                {error?.message}
              </Typography>
            </Box>

            <IconButton
              size="small"
              onClick={onClose}
              aria-label="Dismiss"
              sx={{
                color: '#93B1C2',
                mt: -0.5,
                mr: -0.5,
                p: 0.5,
                '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.06)' },
              }}
            >
              <CloseIcon sx={{ fontSize: 15 }} />
            </IconButton>
          </Box>

          {/* Retry button */}
          {onRetry && (
            <Box sx={{ mt: 1.5, pl: 3.5 }}>
              <Box
                component="button"
                onClick={() => { onRetry(); onClose() }}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  bgcolor: 'transparent',
                  border: `1px solid ${accent}55`,
                  color: accent,
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  px: 1.25,
                  py: 0.5,
                  cursor: 'pointer',
                  letterSpacing: '0.4px',
                  textTransform: 'uppercase',
                  fontFamily: 'inherit',
                  transition: 'background 0.15s',
                  '&:hover': { bgcolor: `${accent}18` },
                }}
              >
                <RefreshIcon sx={{ fontSize: 12 }} />
                Retry
              </Box>
            </Box>
          )}
        </Box>

        {/* Drain progress bar */}
        <Box sx={{ height: 2, bgcolor: `${accent}25` }}>
          <Box
            sx={{
              height: '100%',
              width: `${progress}%`,
              bgcolor: accent,
              transition: 'width 0.1s linear',
            }}
          />
        </Box>
      </Box>
    </Slide>
  )
}
