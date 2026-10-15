'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon'
import { DateTimePicker } from '@/components/ui/DateTimePicker'
import { RussianPhoneInput } from '@/components/ui/RussianPhoneInput'
import { BookingSubmission } from '@/components/booking/BookingSubmission'

const fieldLabelClassName =
  'text-background/60 flex min-w-0 flex-col gap-2 text-base leading-[19px]'
const fieldInputClassName =
  'text-background focus-visible:ring-background/60 h-[51px] w-full min-w-0 rounded-[14px] bg-white px-5 text-base leading-[19px] outline-none focus-visible:ring-2'

// Temporary display options until the source for tariffs and scenarios is agreed.
const demoTariffs = [
  'Компания друзей',
  'Корпоративный формат',
  'Праздник с отдыхом',
] as const
const demoScenarios = ['Захват флага', 'Командный бой', 'Защита базы'] as const

function SelectChevron({ open = false }: { open?: boolean }) {
  return (
    <ArrowRightIcon
      aria-hidden="true"
      className={`text-background pointer-events-none absolute top-1/2 right-2.5 size-6 -translate-y-1/2 transition-transform duration-[160ms] motion-reduce:transition-none ${open ? '-rotate-90' : 'rotate-90'}`}
    />
  )
}

function DemoSelect({
  label,
  name,
  options,
  defaultValue = '',
}: {
  label: string
  name: string
  options: readonly string[]
  defaultValue?: string
}) {
  const fieldId = useId()
  const labelId = `${fieldId}-label`
  const listId = `${fieldId}-list`
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const typeaheadRef = useRef({ query: '', timestamp: 0 })
  const [value, setValue] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const choices = ['', ...options]
  const selectedIndex = Math.max(0, choices.indexOf(value))

  useEffect(() => {
    if (!isOpen) return

    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [isOpen])

  function openMenu() {
    setActiveIndex(selectedIndex)
    typeaheadRef.current = { query: '', timestamp: 0 }
    setIsOpen(true)
  }

  function choose(index: number) {
    setValue(choices[index])
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) {
        openMenu()
      } else {
        const direction = event.key === 'ArrowDown' ? 1 : -1
        setActiveIndex(
          (index) => (index + direction + choices.length) % choices.length,
        )
      }
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setIsOpen(true)
      setActiveIndex(event.key === 'Home' ? 0 : choices.length - 1)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (isOpen) choose(activeIndex)
      else openMenu()
    } else if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      event.stopPropagation()
      setIsOpen(false)
    } else if (event.key === 'Tab') {
      setIsOpen(false)
    } else if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey
    ) {
      event.preventDefault()
      const timestamp = Date.now()
      const previous = typeaheadRef.current
      const query = (
        (timestamp - previous.timestamp < 700 ? previous.query : '') + event.key
      ).toLocaleLowerCase('ru')
      typeaheadRef.current = { query, timestamp }

      const startIndex = isOpen ? activeIndex : selectedIndex
      for (let offset = 1; offset <= choices.length; offset += 1) {
        const index = (startIndex + offset) % choices.length
        if (
          (choices[index] || 'Не выбрано')
            .toLocaleLowerCase('ru')
            .startsWith(query)
        ) {
          setActiveIndex(index)
          setIsOpen(true)
          break
        }
      }
    }
  }

  return (
    <div
      ref={rootRef}
      className={`${fieldLabelClassName} relative transition-[z-index] duration-0 motion-reduce:transition-none ${isOpen ? 'z-20 delay-0' : 'z-0 delay-[160ms]'}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
      }}
    >
      <label id={labelId} htmlFor={fieldId} className="w-fit">
        {label}
      </label>
      <input type="hidden" name={name} value={value} />
      <div className="relative">
        <button
          ref={triggerRef}
          id={fieldId}
          type="button"
          role="combobox"
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-expanded={isOpen}
          aria-activedescendant={
            isOpen ? `${listId}-${activeIndex}` : undefined
          }
          className={`${fieldInputClassName} cursor-pointer pr-11 text-left`}
          onClick={() => {
            if (isOpen) setIsOpen(false)
            else openMenu()
          }}
          onKeyDown={handleKeyDown}
        >
          {value || 'Не выбрано'}
        </button>
        <SelectChevron open={isOpen} />

        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          aria-hidden={!isOpen}
          inert={!isOpen}
          className={`border-background/10 absolute inset-x-0 top-full mt-2 rounded-[14px] border bg-white p-1.5 shadow-[0_12px_32px_rgb(18_24_12_/_16%)] transition-[opacity,transform,translate,visibility] duration-[160ms] ease-out motion-reduce:translate-y-0 motion-reduce:transition-none ${isOpen ? 'visible translate-y-0 opacity-100' : 'pointer-events-none invisible -translate-y-1 opacity-0'}`}
        >
          {choices.map((option, index) => (
            <li
              key={option}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={value === option}
              className={`flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-[10px] px-3 py-2.5 text-base leading-[19px] transition-colors ${
                value === option
                  ? 'bg-background text-primary'
                  : index === activeIndex
                    ? 'bg-primary text-background'
                    : 'text-background hover:bg-primary/50'
              }`}
              onPointerMove={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              <span>{option || 'Не выбрано'}</span>
              {value === option && <span aria-hidden="true">✓</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function LeadFormSection() {
  return (
    <section
      id="lead-form"
      aria-labelledby="lead-form-title"
      className="section-anchor page-container page-section-gap bg-primary text-primary-foreground rounded-[50px] px-4 py-[60px] md:p-12 xl:grid xl:grid-cols-[minmax(0,1fr)_540px] xl:gap-[52px] xl:px-[52px] xl:py-[25px]"
    >
      <header className="mx-auto flex max-w-[451px] flex-col items-center gap-4 text-center xl:mx-0 xl:items-start xl:pt-[27px] xl:text-left">
        <h2
          id="lead-form-title"
          className="font-display max-w-[389px] text-[40px] leading-[0.98] font-bold tracking-[0.03em] uppercase"
        >
          Активный праздник, который запомнится
        </h2>
        <p className="text-background/60 text-base leading-[1.2]">
          Оставьте заявку — поможем подобрать формат, обсудим детали и соберём
          праздник без стресса
        </p>
      </header>

      <form
        className="mx-auto mt-[52px] flex w-full max-w-[540px] flex-col xl:mx-0 xl:mt-0"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
          <label className={fieldLabelClassName}>
            <span>Имя</span>
            <input
              required
              autoComplete="name"
              className={fieldInputClassName}
              name="name"
              type="text"
            />
          </label>

          <RussianPhoneInput
            labelClassName={fieldLabelClassName}
            inputClassName={fieldInputClassName}
          />

          <DemoSelect
            label="Тариф"
            name="tariff"
            options={demoTariffs}
            defaultValue={demoTariffs[0]}
          />
          <DemoSelect
            label="Сценарий"
            name="scenario"
            options={demoScenarios}
          />

          <label className={fieldLabelClassName}>
            <span>Количество участников</span>
            <input
              className={fieldInputClassName}
              name="participants"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
            />
          </label>

          <DateTimePicker
            labelClassName={fieldLabelClassName}
            inputClassName={fieldInputClassName}
          />
        </div>

        <label className="text-background/60 mt-5 flex min-h-[57px] max-w-[530px] items-start gap-2 text-sm leading-[17px]">
          <span className="relative size-6 shrink-0">
            <input
              required
              className="peer focus-visible:outline-background size-6 appearance-none rounded-[4px] border border-[#334a38] bg-white focus-visible:outline-2 focus-visible:outline-offset-2"
              name="consent"
              type="checkbox"
            />
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="pointer-events-none absolute inset-0 hidden size-6 text-[#334a38] peer-checked:block"
            >
              <path
                d="m3 12 5 5L21 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>
            Нажимая на кнопку «Оставить заявку», вы подтверждаете, что
            ознакомлены с политикой конфиденциальности и согласны с обработкой
            персональных данных
          </span>
        </label>

        <BookingSubmission
          className="mt-10"
          buttonClassName="min-h-[68px] rounded-[20px] px-8 py-4 xl:justify-start"
        />
      </form>
    </section>
  )
}
