import { useMutation } from '@tanstack/react-query'
import { planTrip } from '@/lib/api'
import type { TripFormValues, TripPlan } from '@/types/trip'

export function useTripPlan() {
  return useMutation<TripPlan, Error, TripFormValues>({
    mutationFn: async (values) => {
      const response = await planTrip(values)
      return response.data
    },
  })
}
