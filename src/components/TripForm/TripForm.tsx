import { useState, useEffect, type FormEvent } from 'react'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import { LocationInput } from './LocationInput'
import { CycleSlider } from './CycleSlider'
import { HOSReference } from './HOSReference'
import type { TripFormValues } from '@/types/trip'

const LOADING_MESSAGES = [
  'Geocoding your locations...',
  'Fetching route from OSRM...',
  'Running HOS algorithm...',
  'Building ELD log sheets...',
]

interface TripFormProps {
  onSubmit: (values: TripFormValues) => void
  isLoading: boolean
}

export function TripForm({ onSubmit, isLoading }: TripFormProps) {
  const [values, setValues] = useState<TripFormValues>({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_used_hours: 0,
  })
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    if (!isLoading) {
      setMsgIndex(0)
      return
    }
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length)
    }, 1500)
    return () => clearInterval(id)
  }, [isLoading])

  const isDisabled =
    !values.current_location.trim() ||
    !values.pickup_location.trim() ||
    !values.dropoff_location.trim() ||
    isLoading

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSubmit(values)
  }

  function setField<K extends keyof TripFormValues>(key: K, value: TripFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h2" sx={{ mb: 0.5 }}>
        Plan Your Trip
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        FMCSA-compliant ELD log generation
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <LocationInput
          label="Current Location"
          placeholder="e.g. Dallas, TX"
          stopType="current"
          value={values.current_location}
          onChange={(v) => setField('current_location', v)}
        />

        <Box sx={{ height: 16, ml: 2.5, borderLeft: '2px dashed', borderColor: 'divider' }} />

        <LocationInput
          label="Pickup Location"
          placeholder="e.g. Fort Worth, TX"
          stopType="pickup"
          value={values.pickup_location}
          onChange={(v) => setField('pickup_location', v)}
        />

        <Box sx={{ height: 16, ml: 2.5, borderLeft: '2px dashed', borderColor: 'divider' }} />

        <LocationInput
          label="Dropoff Location"
          placeholder="e.g. Memphis, TN"
          stopType="dropoff"
          value={values.dropoff_location}
          onChange={(v) => setField('dropoff_location', v)}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <CycleSlider
          value={values.current_cycle_used_hours}
          onChange={(v) => setField('current_cycle_used_hours', v)}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        disabled={isDisabled}
        startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
        sx={{ mt: 3, height: 52 }}
      >
        {isLoading ? 'Calculating...' : 'Plan My Trip →'}
      </Button>

      {isLoading && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1.5, textAlign: 'center', minHeight: 20 }}
        >
          {LOADING_MESSAGES[msgIndex]}
        </Typography>
      )}

      <Box sx={{ mt: 3 }}>
        <HOSReference />
      </Box>
    </Box>
  )
}
