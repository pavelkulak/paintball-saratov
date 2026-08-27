'use client'

import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const russianPhonePattern = '\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}'

function getRussianPhoneDigits(value: string) {
  const digits = value.replace(/\D/g, '')
  const trimmedValue = value.trimStart()

  if (trimmedValue.startsWith('+7')) return digits.slice(1, 11)
  if (digits.startsWith('8')) return digits.slice(1, 11)
  if (digits.length === 11 && digits.startsWith('7')) {
    return digits.slice(1, 11)
  }

  return digits.slice(0, 10)
}

function formatRussianPhone(value: string) {
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

function getPhoneCaretPosition(value: string, localDigitsBefore: number) {
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

function RussianPhoneInput() {
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
    <label className="bg-surface text-ink/60 block rounded-2xl px-5 py-[18px] text-base">
      <span className="sr-only">Телефон</span>
      <input
        required
        autoComplete="tel"
        className="placeholder:text-ink/60 focus-visible:ring-primary w-full bg-transparent outline-none focus-visible:ring-2"
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

export function LeadFormSection() {
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [formResetKey, setFormResetKey] = useState(0)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')

    const form = event.currentTarget
    const formData = new FormData(form)
    const phoneDigits = getRussianPhoneDigits(
      String(formData.get('phone') ?? ''),
    )

    try {
      const response = await fetch('/api/v1/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          phone: phoneDigits ? `+7${phoneDigits}` : '',
          consent: formData.get('consent') === 'on',
        }),
      })

      if (!response.ok) {
        throw new Error('Lead request failed')
      }

      form.reset()
      setFormResetKey((currentKey) => currentKey + 1)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="lead-form"
      aria-labelledby="lead-form-title"
      className="section-anchor page-container page-section-gap bg-primary text-primary-foreground overflow-hidden rounded-[3rem] px-4 pt-14 pb-14 md:p-12 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] xl:gap-12"
    >
      <header className="mx-auto flex max-w-md flex-col gap-6 text-center xl:mx-0 xl:pt-0 xl:text-left">
        <h2
          id="lead-form-title"
          className="font-display text-[40px] leading-[0.98] font-bold tracking-[0.03em] uppercase"
        >
          Активный праздник, который запомнится
        </h2>
        <p className="text-ink/60 text-sm leading-[1.2] md:text-base">
          Оставьте заявку — поможем подобрать формат, обсудим детали и соберём
          праздник без стресса
        </p>
      </header>

      <form
        className="mx-auto mt-14 flex w-full max-w-xl flex-col gap-14 xl:mx-0 xl:mt-0"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-6">
          <label className="bg-surface text-ink/60 block rounded-2xl px-5 py-[18px] text-base">
            <span className="sr-only">Имя</span>
            <input
              required
              autoComplete="name"
              className="placeholder:text-ink/60 focus-visible:ring-primary w-full bg-transparent outline-none focus-visible:ring-2"
              name="name"
              placeholder="Имя"
              type="text"
            />
          </label>

          <RussianPhoneInput key={formResetKey} />

          <label className="text-ink/60 flex items-start gap-2 text-sm leading-[1.2]">
            <input
              required
              className="accent-ink mt-0.5 size-6 shrink-0"
              name="consent"
              type="checkbox"
            />
            <span>
              Нажимая на кнопку «Оставить заявку», вы подтверждаете, что
              ознакомлены с политикой конфиденциальности и согласны с обработкой
              персональных данных
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-ink text-surface focus-visible:ring-ink focus-visible:ring-offset-primary inline-flex min-h-16 w-full items-center justify-center rounded-2xl px-8 py-4 text-base leading-none font-bold transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 xl:w-fit"
        >
          {status === 'submitting' ? 'Отправляем…' : 'Оставить заявку'}
        </button>

        <p
          aria-live="polite"
          className={`text-ink/70 text-sm leading-[1.2] ${
            status === 'idle' || status === 'submitting' ? 'sr-only' : ''
          }`}
        >
          {status === 'success'
            ? 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.'
            : 'Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами по телефону.'}
        </p>
      </form>
    </section>
  )
}
