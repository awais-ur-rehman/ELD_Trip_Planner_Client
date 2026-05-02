import { useState } from 'react'
import { Box, Typography, Collapse } from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'

const RULES = [
  { key: '11 HR',  value: 'Max driving per shift' },
  { key: '14 HR',  value: 'On-duty window limit' },
  { key: '10 HR',  value: 'Required off-duty rest' },
  { key: '30 MIN', value: 'Break after 8 hrs driving' },
  { key: '70/8',   value: 'Cycle limit (8 days)' },
]

export function HOSReference() {
  const [open, setOpen] = useState(false)

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Box
        component="button"
        type="button"
        onClick={() => setOpen((p) => !p)}
        sx={{
          width: '100%',
          px: 2,
          py: 1.5,
          bgcolor: 'white',
          border: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#93B1C2', letterSpacing: '0.3px' }}>
          HOS Rules Quick Reference
        </Typography>
        <ExpandMoreIcon
          sx={{
            color: '#93B1C2',
            fontSize: 18,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }}
        />
      </Box>

      <Collapse in={open}>
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
          {RULES.map((rule, i) => (
            <Box
              key={rule.key}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                py: 1,
                bgcolor: i % 2 === 0 ? 'transparent' : '#FAFCFD',
              }}
            >
              <Box
                sx={{
                  bgcolor: '#E4ECF2',
                  color: '#1E2A3A',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  fontFamily: '"JetBrains Mono", monospace',
                  px: 1,
                  py: 0.375,
                  borderRadius: '100px',
                  letterSpacing: '0.2px',
                }}
              >
                {rule.key}
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: '#7A8FA3' }}>
                {rule.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  )
}
