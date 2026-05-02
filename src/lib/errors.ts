import type { ApiError } from '@/lib/api'

/**
 * Maps raw API errors to plain-English messages safe to show end users.
 * Backend error strings (stack traces, internal codes, field names) never
 * reach the UI — this is the single place where that translation happens.
 */
export function friendlyMessage(error: Error | null): string {
  if (!error) return ''

  const isApiError = 'code' in error
  if (!isApiError) return 'Something went wrong. Please try again.'

  const { code, message } = error as ApiError

  switch (code) {
    case 'network':
      return "Can't reach the server. Check your internet connection or make sure the backend is running."

    case 'geocoding':
      return _friendlyGeocodingMessage(message)

    case 'routing':
      return "We couldn't calculate a driving route between your locations. This is usually a temporary issue — please try again in a moment."

    case 'validation':
      return _friendlyValidationMessage(message)

    case 'server':
      return 'Something went wrong on our end. Please try again in a moment.'

    default:
      return 'An unexpected error occurred. Please try again.'
  }
}

function _friendlyGeocodingMessage(raw: string): string {
  // "Location not found: 'Dallas, ZZZ'"  →  extract the location name
  const notFoundMatch = raw.match(/Location not found:\s*['"]?([^'"]+)['"]?/i)
  if (notFoundMatch) {
    const loc = notFoundMatch[1].trim()
    return `We couldn't find "${loc}". Try a more specific address — for example, "Dallas, TX" instead of just "Dallas".`
  }

  // "Geocoding request failed for 'X': <httpx noise>"
  const failedMatch = raw.match(/Geocoding request failed for\s*['"]?([^'"]+)['"]?/i)
  if (failedMatch) {
    const loc = failedMatch[1].trim()
    return `There was a problem looking up "${loc}". Please check the address and try again.`
  }

  return "We couldn't look up one of your locations. Try a more specific address and try again."
}

function _friendlyValidationMessage(raw: string): string {
  const lower = raw.toLowerCase()

  if (lower.includes('must all be different') || lower.includes('must be different')) {
    return 'All three locations must be different. Please change one of them and try again.'
  }

  if (lower.includes('cycle') || lower.includes('hours')) {
    return 'Cycle hours must be between 0 and 70. Please enter a valid number.'
  }

  if (lower.includes('required') || lower.includes('blank')) {
    return 'Please fill in all three location fields before planning your trip.'
  }

  // Fallback for raw "Request failed (400)"
  return 'Please check your inputs. Make sure all three locations are filled in, different from each other, and cycle hours are between 0 and 70.'
}
