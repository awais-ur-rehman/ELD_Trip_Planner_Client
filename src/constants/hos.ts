export const HOS_RULES = [
  { label: '11hr driving', detail: '§ 395.3(a)(3)' },
  { label: '14hr window', detail: '§ 395.3(a)(2)' },
  { label: '10hr rest', detail: '§ 395.3(a)(1)' },
  { label: '30min break', detail: '§ 395.3(a)(3)(ii)' },
  { label: '70hr/8-day', detail: '§ 395.3(b)' },
] as const

export const MAX_CYCLE_HOURS = 70
export const CYCLE_WARNING_THRESHOLD = 60
export const CYCLE_ERROR_THRESHOLD = 68
