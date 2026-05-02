import { Box, Typography, Slider, Alert } from '@mui/material'
import { cycleSliderColor } from '@/lib/utils'
import { MAX_CYCLE_HOURS } from '@/constants/hos'

const QUICK_SET_VALUES = [0, 14, 35, 56, 65]

interface CycleSliderProps {
  value: number
  onChange: (value: number) => void
}

export function CycleSlider({ value, onChange }: CycleSliderProps) {
  const remaining   = MAX_CYCLE_HOURS - value
  const sliderColor = cycleSliderColor(value)
  const isAtLimit   = value >= MAX_CYCLE_HOURS

  return (
    <Box>
      <Typography
        sx={{ display: 'block', fontSize: '0.625rem', color: '#7A8FA3', letterSpacing: '0.8px', textTransform: 'uppercase', fontWeight: 700, mb: 1.25 }}
      >
        Current Cycle Hours Used
      </Typography>

      {/* Big number + remaining */}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography
          sx={{
            fontSize: '2rem',
            fontWeight: 700,
            color: value >= 68 ? '#EF4444' : value >= 60 ? '#F5A524' : '#424242',
            fontFamily: '"JetBrains Mono", monospace',
            lineHeight: 1,
            letterSpacing: '-0.5px',
          }}
        >
          {value % 1 === 0 ? value : value.toFixed(1)}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#7A8FA3', pb: 0.25 }}>
          {remaining.toFixed(1)} hrs left of 70
        </Typography>
      </Box>

      <Slider
        value={value}
        onChange={(_, v) => onChange(v as number)}
        min={0}
        max={MAX_CYCLE_HOURS}
        step={0.5}
        color={sliderColor}
        disabled={isAtLimit}
        aria-label="Current cycle hours used"
        aria-valuetext={`${value} hours used, ${remaining} remaining`}
        sx={{ mb: 1.25, mt: 0.5 }}
      />

      {/* Quick-set chips */}
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {QUICK_SET_VALUES.map((v) => (
          <Box
            key={v}
            component="button"
            type="button"
            onClick={() => onChange(v)}
            aria-label={`Set cycle hours to ${v}`}
            aria-pressed={value === v}
            sx={{
              px: 1.25,
              py: 0.5,
              border: `1px solid ${value === v ? '#93B1C2' : '#D5DEE3'}`,
              bgcolor: value === v ? '#E4ECF2' : 'white',
              color: value === v ? '#1E2A3A' : '#7A8FA3',
              fontSize: '0.6875rem',
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: value === v ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.1s',
              borderRadius: '100px',
              '&:hover': { borderColor: '#93B1C2' },
            }}
          >
            {v}h
          </Box>
        ))}
      </Box>

      {isAtLimit && (
        <Alert severity="warning" sx={{ mt: 1.5, fontSize: '0.75rem' }}>
          Driver out of hours. A 34-hour restart is required.
        </Alert>
      )}
    </Box>
  )
}
