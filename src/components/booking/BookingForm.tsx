'use client'

import { DateTimePicker } from '@/components/ui/DateTimePicker'
import { RussianPhoneInput } from '@/components/ui/RussianPhoneInput'

import { BookingSubmission } from './BookingSubmission'

const labelClassName =
  'text-background/70 flex min-w-0 flex-col gap-2 text-sm leading-[19px]'
const inputClassName =
  'text-ink focus-visible:ring-background/60 h-[51px] w-full min-w-0 rounded-[14px] bg-white px-4 text-base leading-[19px] outline-none focus-visible:ring-2'

export function BookingForm({ showDate = false }: { showDate?: boolean }) {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClassName}>
          <span>Имя</span>
          <input
            required
            autoComplete="name"
            className={inputClassName}
            name="name"
            type="text"
            maxLength={120}
          />
        </label>
        <RussianPhoneInput
          labelClassName={labelClassName}
          inputClassName={inputClassName}
        />
        <label
          className={`${labelClassName} ${showDate ? '' : 'sm:col-span-2'}`}
        >
          <span>Количество игроков</span>
          <input
            className={inputClassName}
            inputMode="numeric"
            min={1}
            name="participants"
            placeholder="Например, 10"
            step={1}
            type="number"
          />
        </label>
        {showDate && (
          <DateTimePicker
            name="desiredDate"
            labelClassName={labelClassName}
            inputClassName={inputClassName}
          />
        )}
      </div>
      <label className="text-background/70 mt-5 flex items-start gap-2 text-sm leading-[1.4]">
        <input
          required
          className="accent-background mt-0.5 size-5 shrink-0"
          name="consent"
          type="checkbox"
        />
        <span>
          Согласен на обработку персональных данных для связи по заявке.
        </span>
      </label>
      <BookingSubmission className="mt-5" />
    </form>
  )
}
