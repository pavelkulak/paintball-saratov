const monthNames = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
] as const

export function formatReviewDate(value: string) {
  const [, month, day] = value.split('-').map(Number)
  return `${day} ${monthNames[month - 1]}`
}
