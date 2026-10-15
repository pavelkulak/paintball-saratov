export const russianPhonePattern = '\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}'

export function getRussianPhoneDigits(value: string) {
  const digits = value.replace(/\D/g, '')
  const trimmedValue = value.trimStart()

  if (trimmedValue.startsWith('+7')) return digits.slice(1, 11)
  if (digits.startsWith('8')) return digits.slice(1, 11)
  if (digits.length === 11 && digits.startsWith('7')) {
    return digits.slice(1, 11)
  }

  return digits.slice(0, 10)
}

export function formatRussianPhone(value: string) {
  const localDigits = getRussianPhoneDigits(value)
  if (!localDigits) {
    return /^\s*(?:\+7|8)$/.test(value) ? '+7' : ''
  }

  let formatted = `+7 (${localDigits.slice(0, 3)}`
  if (localDigits.length >= 3) formatted += ')'
  if (localDigits.length > 3) formatted += ` ${localDigits.slice(3, 6)}`
  if (localDigits.length > 6) formatted += `-${localDigits.slice(6, 8)}`
  if (localDigits.length > 8) formatted += `-${localDigits.slice(8, 10)}`

  return formatted
}

export function getPhoneCaretPosition(
  value: string,
  localDigitsBefore: number,
) {
  if (localDigitsBefore === 0) return value === '+7' ? 2 : value.indexOf('(')

  let localDigitsSeen = 0
  for (let index = 3; index < value.length; index += 1) {
    if (/\d/.test(value[index])) {
      localDigitsSeen += 1
      if (localDigitsSeen === localDigitsBefore) return index + 1
    }
  }

  return value.length
}
