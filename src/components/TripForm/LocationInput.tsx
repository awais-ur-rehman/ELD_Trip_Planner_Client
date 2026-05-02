import { useState, type ElementType } from 'react'
import {
  Autocomplete,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material'
import {
  LocationOn as LocationOnIcon,
  LocalShipping as LocalShippingIcon,
  Flag as FlagIcon,
} from '@mui/icons-material'
import { STOP_COLORS } from '@/constants/colors'
import { useLocationSearch } from '@/hooks/useLocationSearch'

const ICONS: Record<'current' | 'pickup' | 'dropoff', ElementType> = {
  current: LocationOnIcon,
  pickup: LocalShippingIcon,
  dropoff: FlagIcon,
}

export interface LocationInputProps {
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
  const [inputValue, setInputValue] = useState(value)
  const { options, loading } = useLocationSearch(inputValue)
  const Icon = ICONS[stopType]
  const iconColor = STOP_COLORS[stopType]

  return (
    <Autocomplete
      freeSolo
      options={options.map((o) => o.label)}
      inputValue={inputValue}
      onInputChange={(_, newVal) => {
        setInputValue(newVal)
        onChange(newVal)
      }}
      onChange={(_, selected) => {
        if (selected && typeof selected === 'string') {
          setInputValue(selected)
          onChange(selected)
        }
      }}
      loading={loading}
      filterOptions={(x) => x}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          inputProps={{
            ...params.inputProps,
            'aria-label': label,
            autoComplete: 'off',
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Icon sx={{ color: iconColor, fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading && <CircularProgress size={16} sx={{ mr: 1 }} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
