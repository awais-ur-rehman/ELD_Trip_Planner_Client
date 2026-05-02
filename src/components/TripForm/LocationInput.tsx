import { TextField, InputAdornment } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import FlagIcon from '@mui/icons-material/Flag'
import { STOP_COLORS } from '@/constants/colors'
import type { StopType } from '@/types/trip'

const ICONS: Record<'current' | 'pickup' | 'dropoff', React.ElementType> = {
  current: LocationOnIcon,
  pickup: LocalShippingIcon,
  dropoff: FlagIcon,
}

interface LocationInputProps {
  label: string
  placeholder: string
  stopType: 'current' | 'pickup' | 'dropoff'
  value: string
  onChange: (value: string) => void
  error?: boolean
  helperText?: string
}

export function LocationInput({
  label,
  placeholder,
  stopType,
  value,
  onChange,
  error,
  helperText,
}: LocationInputProps) {
  const Icon = ICONS[stopType]
  const iconColor = STOP_COLORS[stopType]

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      helperText={helperText}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Icon sx={{ color: iconColor, fontSize: 20 }} />
          </InputAdornment>
        ),
      }}
    />
  )
}
