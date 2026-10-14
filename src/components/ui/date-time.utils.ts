export function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function fromDateKey(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day, 12)
}

export function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1, 12)
  const mondayOffset = (firstDay.getDay() + 6) % 7

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(year, month, index + 1 - mondayOffset, 12)
    return {
      key: toDateKey(date),
      day: date.getDate(),
      inMonth: date.getMonth() === month,
    }
  })
}

export function shiftDate(value: string, days: number) {
  const date = fromDateKey(value)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

export function shiftMonth(value: string, months: number) {
  const date = fromDateKey(value)
  const nextMonth = new Date(
    date.getFullYear(),
    date.getMonth() + months,
    1,
    12,
  )
  const lastDay = new Date(
    nextMonth.getFullYear(),
    nextMonth.getMonth() + 1,
    0,
  ).getDate()
  nextMonth.setDate(Math.min(date.getDate(), lastDay))
  return toDateKey(nextMonth)
}

export function normalizeTimePart(value: string, maximum: number) {
  return Math.max(0, Math.min(maximum, Number(value) || 0))
}

export function shiftTime(hours: number, minutes: number, delta: number) {
  const total = (((hours * 60 + minutes + delta) % 1440) + 1440) % 1440
  return { hours: Math.floor(total / 60), minutes: total % 60 }
}

export function formatDateTime(date: string, hours: number, minutes: number) {
  const [year, month, day] = date.split('-')
  return `${day}.${month}.${year}, ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
