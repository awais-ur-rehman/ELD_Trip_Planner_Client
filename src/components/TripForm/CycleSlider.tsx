import { Box, Typography, Slider, Chip, Alert } from '@mui/material'
import { cycleSliderColor, formatHours } from '@/lib/utils'
import { MAX_CYCLE_HOURS } from '@/constants/hos'

const QUICK_SET_VALUES = [0, 14, 35, 56, 65]

interface CycleSliderProps {
  value: number
  onChange: (value: number) => void
}

export function CycleSlider({ value, onChange }: CycleSliderProps) {
  const remaining = MAX_CYCLE_HOURS - value
  const sliderColor = cycleSliderColor(value)
  const isAtLimit = value >= MAX_CYCLE_HOURS

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Current Cycle Used
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" fontWeight={500}>
          {formatHours(value)} used
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatHours(remaining)} remaining of 70h
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
        sx={{ mb: 1.5 }}
      />

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {QUICK_SET_VALUES.map((v) => (
          <Chip
            key={v}
            label={`${v}h`}
            variant="outlined"
            size="small"
            onClick={() => onChange(v)}
            sx={{
              cursor: 'pointer',
              borderColor: value === v ? 'primary.main' : 'divider',
              color: value === v ? 'primary.main' : 'text.secondary',
            }}
          />
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
