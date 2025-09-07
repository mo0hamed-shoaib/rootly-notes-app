/**
 * Utility functions for time conversion between hours/minutes and total minutes
 */

export interface TimeParts {
  hours: number
  minutes: number
}

/**
 * Convert total minutes to hours and minutes
 */
export function minutesToTimeParts(totalMinutes: number): TimeParts {
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  }
}

/**
 * Convert hours and minutes to total minutes
 */
export function timePartsToMinutes(hours: number, minutes: number): number {
  return hours * 60 + minutes
}

/**
 * Format total minutes as a readable time string
 */
export function formatStudyTime(totalMinutes: number): string {
  const { hours, minutes } = minutesToTimeParts(totalMinutes)
  
  if (hours === 0) {
    return `${minutes}m`
  }
  
  if (minutes === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${minutes}m`
}

/**
 * Format total minutes as decimal hours (for charts/calculations)
 */
export function formatStudyTimeAsHours(totalMinutes: number): string {
  const hours = Math.round((totalMinutes / 60) * 10) / 10
  return `${hours}h`
}
