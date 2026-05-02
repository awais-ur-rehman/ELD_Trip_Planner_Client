import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Box, Tabs, Tab, Typography, Badge, Button, IconButton, GlobalStyles } from '@mui/material'
import { OpenInFull as OpenInFullIcon, Close as CloseIcon, Print as PrintIcon } from '@mui/icons-material'
import { LogSheetHeader } from './LogSheetHeader'
import { LogCanvas } from './LogCanvas'
import type { DailyLog } from '@/types/trip'

// ── Print styles ──────────────────────────────────────────────────────────────
// Injected globally — only active during @media print.
// Uses visibility (not display) so canvas content is preserved.
// #eld-print-zone is portal-mounted directly in <body> so body > * rules don't block it.
const PRINT_STYLES = (
  <GlobalStyles
    styles={{
      '@page': {
        size: 'landscape',
        margin: '0.4in',
      },
      '@media print': {
        'body': {
          visibility: 'hidden',
        },
        '#eld-print-zone': {
          visibility: 'visible !important' as 'visible',
          position: 'absolute !important' as 'absolute',
          inset: '0 !important',
          left: '0 !important',
          top: '0 !important',
          width: '100% !important',
          backgroundColor: 'white',
        },
        '#eld-print-zone *': {
          visibility: 'visible !important' as 'visible',
        },
        '.eld-log-page': {
          pageBreakAfter: 'always',
          pageBreakInside: 'avoid',
          backgroundColor: 'white',
          padding: '16px 0',
        },
        '.eld-log-page:last-child': {
          pageBreakAfter: 'auto',
        },
      },
    }}
  />
)

// ── Print zone portal ─────────────────────────────────────────────────────────
// Rendered off-screen so LogCanvas draws correctly (has real dimensions).
// Becomes the only visible element during printing via CSS above.
function PrintZone({ dailyLogs }: { dailyLogs: DailyLog[] }) {
  return createPortal(
    <div
      id="eld-print-zone"
      style={{
        position: 'absolute',
        left: '-99999px',
        top: 0,
        width: 960,
        backgroundColor: 'white',
        pointerEvents: 'none',
      }}
    >
      {dailyLogs.map((log, i) => (
        <div
          key={`${log.date}-${i}`}
          className="eld-log-page"
        >
          <LogSheetHeader log={log} totalDays={dailyLogs.length} />
          <LogCanvas log={log} />
        </div>
      ))}
    </div>,
    document.body,
  )
}

// ── Overlay ───────────────────────────────────────────────────────────────────
function ELDOverlay({
  dailyLogs,
  initialDay,
  onClose,
}: {
  dailyLogs: DailyLog[]
  initialDay: number
  onClose: () => void
}) {
  const [day, setDay] = useState(initialDay)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const currentLog = dailyLogs[day]

  return (
    <Box
      role="dialog"
      aria-modal
      aria-label="ELD log full view"
      onClick={onClose}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        bgcolor: 'rgba(14,20,30,0.88)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          bgcolor: '#FAFAF5',
          width: 'min(96vw, 920px)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          border: '1.5px solid #424242',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Overlay header */}
        <Box
          sx={{
            bgcolor: '#1E2A3A',
            px: 2,
            py: 1.25,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {dailyLogs.map((_, i) => (
              <Box
                key={i}
                component="button"
                type="button"
                onClick={() => setDay(i)}
                sx={{
                  px: 2,
                  py: 0.625,
                  border: 'none',
                  cursor: 'pointer',
                  bgcolor: day === i ? '#93B1C2' : '#2D3F54',
                  color: day === i ? '#1E2A3A' : '#93B1C2',
                  fontFamily: 'inherit',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  transition: 'all 0.12s',
                }}
              >
                Day {i + 1}
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.625rem', color: '#93B1C2', letterSpacing: '0.5px' }}>
              FMCSA 49 CFR 395.8
            </Typography>
            <IconButton
              size="small"
              onClick={onClose}
              aria-label="Close"
              sx={{ color: '#93B1C2', '&:hover': { color: 'white' }, border: '1px solid #2D3F54' }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Log sheet */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          {currentLog && (
            <>
              <LogSheetHeader log={currentLog} totalDays={dailyLogs.length} />
              <LogCanvas log={currentLog} />
            </>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 3,
            py: 1.25,
            borderTop: '1px solid #D5DEE3',
            bgcolor: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontSize: '0.6875rem', color: '#7A8FA3' }}>
            ELD Trip Planner · Spotter AI · FMCSA Compliant
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => window.print()}
              startIcon={<PrintIcon sx={{ fontSize: 14 }} />}
              sx={{ fontSize: '0.6875rem', color: '#1E2A3A', borderColor: '#1E2A3A' }}
            >
              Print All
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={onClose}
              sx={{ fontSize: '0.6875rem' }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function ELDLogSheet({ dailyLogs }: { dailyLogs: DailyLog[] }) {
  const [selectedDay, setSelectedDay] = useState(0)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const currentLog = dailyLogs[selectedDay]

  const openOverlay  = useCallback(() => setOverlayOpen(true),  [])
  const closeOverlay = useCallback(() => setOverlayOpen(false), [])

  return (
    <>
      {/* Global print styles + off-screen print zone */}
      {PRINT_STYLES}
      <PrintZone dailyLogs={dailyLogs} />

      <Box sx={{ p: 2, pt: 0 }}>
        {/* Section header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#424242', textTransform: 'uppercase', letterSpacing: '0.6px' }}
            >
              Daily ELD Logs
            </Typography>
            <Badge
              badgeContent={dailyLogs.length}
              color="primary"
              sx={{ '& .MuiBadge-badge': { fontSize: '0.5625rem', height: 16, minWidth: 16 } }}
            />
            <Box
              sx={{
                fontSize: '0.5625rem',
                px: 0.875,
                py: 0.25,
                bgcolor: '#D1FAE5',
                color: '#065F46',
                fontWeight: 700,
                letterSpacing: '0.4px',
                borderRadius: '100px',
                ml: 0.5,
              }}
            >
              FMCSA OK
            </Box>
          </Box>

          <IconButton
            size="small"
            onClick={openOverlay}
            aria-label="Expand ELD log"
            sx={{ color: '#7A8FA3', border: '1px solid #D5DEE3', p: 0.5, '&:hover': { color: '#1E2A3A', borderColor: '#1E2A3A' } }}
          >
            <OpenInFullIcon sx={{ fontSize: 13 }} />
          </IconButton>
        </Box>

        {/* Day tabs */}
        <Tabs
          value={selectedDay}
          onChange={(_, v) => setSelectedDay(v as number)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 1.5,
            minHeight: 32,
            '& .MuiTab-root': { minHeight: 32, py: 0.5, fontSize: '0.6875rem' },
            '& .MuiTabs-indicator': { bgcolor: 'primary.main' },
          }}
        >
          {dailyLogs.map((log) => (
            <Tab key={log.date} label={`Day ${log.day_number}`} />
          ))}
        </Tabs>

        {/* Preview thumbnail */}
        {currentLog && (
          <Box
            onClick={openOverlay}
            title="Click to view full size"
            sx={{
              position: 'relative',
              height: 148,
              overflow: 'hidden',
              border: '1px solid #E8EFF5',
              bgcolor: '#FAFAF5',
              cursor: 'zoom-in',
              mb: 1,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 6, right: 6,
                zIndex: 5,
                bgcolor: '#1E2A3A',
                color: '#93B1C2',
                fontSize: '0.5rem',
                px: 1, py: 0.375,
                fontWeight: 700,
                letterSpacing: '0.5px',
                pointerEvents: 'none',
              }}
            >
              ⤢ FULL VIEW
            </Box>
            <Box
              sx={{
                transform: 'scale(0.38)',
                transformOrigin: 'top left',
                width: 'calc(100% / 0.38)',
                pointerEvents: 'none',
              }}
            >
              <LogSheetHeader log={currentLog} totalDays={dailyLogs.length} />
              <LogCanvas log={currentLog} />
            </Box>
          </Box>
        )}

        <Typography sx={{ fontSize: '0.625rem', color: '#A8BCC9', textAlign: 'center', mb: 1.5 }}>
          Click to view full size · Day {selectedDay + 1} of {dailyLogs.length}
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => window.print()}
          startIcon={<PrintIcon sx={{ fontSize: 14 }} />}
          sx={{
            color: '#1E2A3A',
            borderColor: '#1E2A3A',
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.4px',
            textTransform: 'uppercase',
          }}
        >
          Print All Logs ({dailyLogs.length} page{dailyLogs.length !== 1 ? 's' : ''})
        </Button>
      </Box>

      {overlayOpen && (
        <ELDOverlay
          dailyLogs={dailyLogs}
          initialDay={selectedDay}
          onClose={closeOverlay}
        />
      )}
    </>
  )
}
