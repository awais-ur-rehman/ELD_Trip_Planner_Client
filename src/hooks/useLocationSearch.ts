import { useState, useEffect } from 'react'

interface NominatimResult {
  display_name: string
  place_id: number
}

export interface LocationOption {
  label: string
  placeId: number
}

export function useLocationSearch(query: string, debounceMs = 400) {
  const [options, setOptions] = useState<LocationOption[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setOptions([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          q: query,
          format: 'json',
          limit: '6',
          addressdetails: '0',
          'accept-language': 'en',
        })
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?${params}`,
          { headers: { 'User-Agent': 'SpotterAI-ELDPlanner/1.0' } },
        )
        const data: NominatimResult[] = await res.json()
        setOptions(data.map((r) => ({ label: r.display_name, placeId: r.place_id })))
      } catch {
        setOptions([])
      } finally {
        setLoading(false)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs])

  return { options, loading }
}
