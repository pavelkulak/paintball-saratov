'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import {
  getRussianPhoneDigits,
  formatRussianPhone,
  getPhoneCaretPosition,
  russianPhonePattern,
} from '@/lib/leads/phone'

export function RussianPhoneInput({
  labelClassName,
  inputClassName,
}: {
  labelClassName: string
  inputClassName: string
}) {
  const [phone, setPhone] = useState('')
  const phoneInputRef = useRef<HTMLInputElement>(null)

  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const caretPosition = input.selectionStart ?? input.value.length
    const localDigitsBefore = getRussianPhoneDigits(
      input.value.slice(0, caretPosition),
    ).length
    const nextPhone = formatRussianPhone(input.value)

    setPhone(nextPhone)

    requestAnimationFrame(() => {
      const nextCaretPosition = getPhoneCaretPosition(
        nextPhone,
        localDigitsBefore,
      )
      phoneInputRef.current?.setSelectionRange(
        nextCaretPosition,
        nextCaretPosition,
      )
    })
  }

  return (
    <label className={labelClassName}>
      <span>Телефон</span>
      <input
        required
        autoComplete="tel"
        className={`${inputClassName} placeholder:text-background/60`}
        inputMode="tel"
        name="phone"
        pattern={russianPhonePattern}
        placeholder="+7 (___) ___-__-__"
        ref={phoneInputRef}
        type="tel"
        value={phone}
        onChange={handlePhoneChange}
      />
    </label>
  )
}
