import type { TripFormValues, TripPlanResponse } from '@/types/trip'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export type ApiErrorCode = 'geocoding' | 'routing' | 'validation' | 'server' | 'network'

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: ApiErrorCode,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function classifyStatus(status: number): ApiErrorCode {
  if (status === 422) return 'geocoding'
  if (status === 503) return 'routing'
  if (status === 400) return 'validation'
  return 'server'
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      ...init,
    })
  } catch {
    throw new ApiError(
      'Cannot connect to server. Make sure the backend is running.',
      0,
      'network',
    )
  }

  let body: Record<string, unknown>
  try {
    body = await res.json()
  } catch {
    throw new ApiError(`Unexpected response from server (${res.status})`, res.status, 'server')
  }

  if (!res.ok) {
    const code = classifyStatus(res.status)
    const message =
      typeof body.error === 'string' ? body.error : `Request failed (${res.status})`
    throw new ApiError(message, res.status, code)
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
