import type { TripFormValues, TripPlanResponse } from '@/types/trip'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })

  const body = await res.json()

  if (!res.ok) {
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }

  return body as T
}

export function planTrip(values: TripFormValues): Promise<TripPlanResponse> {
  return request<TripPlanResponse>('/api/trips/plan/', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export function checkHealth(): Promise<{ status: string }> {
  return request<{ status: string }>('/health/')
}
