'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon'
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon'
import { CloseIcon } from '@/components/icons/CloseIcon'

import {
  formatDateTime,
  fromDateKey,
  getCalendarDays,
  normalizeTimePart,
  shiftDate,
  shiftMonth,
  shiftTime,
  toDateKey,
} from './date-time.utils'
import styles from './DateTimePicker.module.css'

const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]
const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const dateLabel = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'full' })
const smallButtonClassName =
  'focus-visible:outline-background hover:bg-primary/40 inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'

type DateTime = { date: string; hours: number; minutes: number }

function TimeUnit({
  label,
  value,
  maximum,
  onChange,
  onStep,
}: {
  label: string
  value: string
  maximum: number
  onChange: (value: string) => void
  onStep: (direction: number) => void
}) {
  const normalize = () =>
    onChange(String(normalizeTimePart(value, maximum)).padStart(2, '0'))

  return (
    <div className="min-w-0">
      <p className="text-background/60 mb-1 text-center text-xs">{label}</p>
      <div
        className={`${styles.timeSteps} bg-background/5 grid items-center rounded-lg`}
      >
        <button
          type="button"
          aria-label={`Уменьшить ${label.toLocaleLowerCase('ru')}`}
          className="focus-visible:outline-background hover:bg-primary/50 min-h-11 rounded-lg text-xl transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2"
          onClick={() => onStep(-1)}
        >
          −
        </button>
        <input
          aria-label={label}
          inputMode="numeric"
          autoComplete="off"
          type="text"
          maxLength={2}
          value={value}
          className="focus-visible:outline-background h-11 w-full min-w-0 rounded-lg bg-transparent text-center text-base tabular-nums outline-none focus-visible:outline-2 focus-visible:-outline-offset-2"
          onChange={(event) =>
            onChange(event.target.value.replace(/\D/g, '').slice(0, 2))
          }
          onBlur={normalize}
          onFocus={(event) => event.currentTarget.select()}
          onKeyDown={(event) => {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
              event.preventDefault()
              onStep(event.key === 'ArrowUp' ? 1 : -1)
            } else if (event.key === 'Enter') {
              event.preventDefault()
              normalize()
              event.currentTarget.blur()
            }
          }}
        />
        <button
          type="button"
          aria-label={`Увеличить ${label.toLocaleLowerCase('ru')}`}
          className="focus-visible:outline-background hover:bg-primary/50 min-h-11 rounded-lg text-xl transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2"
          onClick={() => onStep(1)}
        >
          +
        </button>
      </div>
    </div>
  )
}

export function DateTimePicker({
  name = 'dateTime',
  labelClassName,
  inputClassName,
}: {
  name?: string
  labelClassName: string
  inputClassName: string
}) {
  const fieldId = useId()
  const titleId = `${fieldId}-title`
  const dialogId = `${fieldId}-dialog`
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [selected, setSelected] = useState<DateTime | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<{ year: number; month: number } | null>(null)
  const [showMonths, setShowMonths] = useState(false)
  const [showTimeControls, setShowTimeControls] = useState(false)
  const [draftDate, setDraftDate] = useState('')
  const [focusedDate, setFocusedDate] = useState('')
  const [today, setToday] = useState('')
  const [hours, setHours] = useState('12')
  const [minutes, setMinutes] = useState('00')

  useEffect(() => {
    if (!isOpen) return
    const dialog = dialogRef.current
    const trigger = triggerRef.current
    if (!dialog || !trigger) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()

    const viewport = window.visualViewport
    const mobile = window.matchMedia(
      '(max-width: 639px), (pointer: coarse) and (max-width: 1023px)',
    )
    const position = () => {
      const viewportTop = viewport?.offsetTop ?? 0
      const viewportLeft = viewport?.offsetLeft ?? 0
      const viewportHeight = viewport?.height ?? window.innerHeight
      const viewportWidth = viewport?.width ?? window.innerWidth
      const rect = trigger.getBoundingClientRect()
      const width = mobile.matches
        ? Math.min(400, viewportWidth - 16)
        : Math.min(Math.max(262, rect.width), viewportWidth - 32)
      dialog.style.setProperty('--picker-width', `${width}px`)
      dialog.style.setProperty(
        '--picker-height',
        `${Math.max(120, viewportHeight - 16)}px`,
      )
      const height = dialog.getBoundingClientRect().height
      const below = viewportTop + viewportHeight - rect.bottom - 8
      const above = rect.top - viewportTop - 8
      const placeAbove = below < height && above > below
      if (!mobile.matches) {
        dialog.style.setProperty(
          '--picker-height',
          `${Math.max(120, Math.min(viewportHeight - 16, placeAbove ? above : below))}px`,
        )
      }
      const fittedHeight = dialog.getBoundingClientRect().height
      const top = mobile.matches
        ? viewportTop + viewportHeight - fittedHeight - 8
        : placeAbove
          ? rect.top - fittedHeight
          : rect.bottom
      const left = mobile.matches
        ? viewportLeft + (viewportWidth - width) / 2
        : Math.max(
            viewportLeft + 16,
            Math.min(rect.left, viewportLeft + viewportWidth - width - 16),
          )

      dialog.style.setProperty(
        '--picker-top',
        `${Math.max(viewportTop + 8, Math.min(top, viewportTop + viewportHeight - fittedHeight - 8))}px`,
      )
      dialog.style.setProperty('--picker-left', `${left}px`)
      dialog.style.setProperty(
        '--picker-top-radius',
        placeAbove ? '14px' : '0px',
      )
    }

    position()
    dialog
      .querySelector<HTMLButtonElement>('[data-calendar-focus="true"]')
      ?.focus({ preventScroll: true })
    const observer = new ResizeObserver(position)
    observer.observe(dialog)
    observer.observe(trigger)
    window.addEventListener('resize', position)
    window.addEventListener('scroll', position, true)
    viewport?.addEventListener('resize', position)
    viewport?.addEventListener('scroll', position)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', position)
      window.removeEventListener('scroll', position, true)
      viewport?.removeEventListener('resize', position)
      viewport?.removeEventListener('scroll', position)
      document.body.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
    }
  }, [isOpen])

  function closePicker() {
    dialogRef.current?.close()
    setIsOpen(false)
    triggerRef.current?.focus({ preventScroll: true })
  }

  function openPicker() {
    const now = new Date()
    const initial = selected ? fromDateKey(selected.date) : now
    setToday(toDateKey(now))
    setView({ year: initial.getFullYear(), month: initial.getMonth() })
    setDraftDate(selected?.date ?? '')
    setFocusedDate(toDateKey(initial))
    setHours(String(selected?.hours ?? 12).padStart(2, '0'))
    setMinutes(String(selected?.minutes ?? 0).padStart(2, '0'))
    setShowMonths(false)
    setShowTimeControls(false)
    setIsOpen(true)
  }

  function moveMonth(delta: number) {
    if (!view) return
    const next = new Date(view.year, view.month + delta, 1, 12)
    setView({ year: next.getFullYear(), month: next.getMonth() })
    setFocusedDate(toDateKey(next))
  }

  function focusDay(key: string) {
    const date = fromDateKey(key)
    setFocusedDate(key)
    setView({ year: date.getFullYear(), month: date.getMonth() })
    requestAnimationFrame(() => {
      dialogRef.current
        ?.querySelector<HTMLButtonElement>(`[data-date="${key}"]`)
        ?.focus({ preventScroll: true })
    })
  }

  function handleDayKey(event: KeyboardEvent<HTMLButtonElement>, key: string) {
    const weekday = (fromDateKey(key).getDay() + 6) % 7
    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      Home: -weekday,
      End: 6 - weekday,
    }
    if (event.key in offsets) {
      event.preventDefault()
      focusDay(shiftDate(key, offsets[event.key]))
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault()
      focusDay(
        shiftMonth(
          key,
          (event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1),
        ),
      )
    }
  }

  function changeTime(delta: number) {
    const next = shiftTime(
      normalizeTimePart(hours, 23),
      normalizeTimePart(minutes, 59),
      delta,
    )
    setHours(String(next.hours).padStart(2, '0'))
    setMinutes(String(next.minutes).padStart(2, '0'))
  }

  const days = view ? getCalendarDays(view.year, view.month) : []
  const monthTitle = view ? `${months[view.month]} ${view.year}` : ''

  return (
    <div className={labelClassName}>
      <label htmlFor={fieldId} className="w-fit">
        Дата и время
      </label>
      <input
        type="hidden"
        name={name}
        value={
          selected
            ? `${selected.date}T${String(selected.hours).padStart(2, '0')}:${String(selected.minutes).padStart(2, '0')}`
            : ''
        }
      />
      <div className="relative">
        <button
          ref={triggerRef}
          id={fieldId}
          type="button"
          aria-haspopup="dialog"
          aria-controls={dialogId}
          aria-expanded={isOpen}
          className={`${inputClassName} cursor-pointer pr-11 text-left`}
          onClick={openPicker}
        >
          <span className="block truncate">
            {selected
              ? formatDateTime(selected.date, selected.hours, selected.minutes)
              : ''}
          </span>
        </button>
        <ArrowRightIcon
          aria-hidden="true"
          className={`text-background pointer-events-none absolute top-1/2 right-2.5 size-6 -translate-y-1/2 transition-transform duration-[160ms] motion-reduce:transition-none ${isOpen ? '-rotate-90' : 'rotate-90'}`}
        />
      </div>

      <dialog
        ref={dialogRef}
        id={dialogId}
        className={styles.dialog}
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault()
          closePicker()
        }}
        onClose={() => {
          setIsOpen(false)
          triggerRef.current?.focus({ preventScroll: true })
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return
          const rect = event.currentTarget.getBoundingClientRect()
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            closePicker()
        }}
      >
        <header
          className={`${styles.mobileHeader} border-background/10 flex shrink-0 items-center justify-between gap-2 border-b px-3 py-1`}
        >
          <h3 id={titleId} className="text-sm font-semibold">
            Дата и время
          </h3>
          <button
            type="button"
            aria-label="Закрыть календарь"
            className={smallButtonClassName}
            onClick={closePicker}
          >
            <CloseIcon aria-hidden="true" className="size-5" />
          </button>
        </header>

        <div className="min-h-0 overflow-y-auto overscroll-contain px-3 pb-3">
          <div className="flex items-center justify-between gap-1 py-1">
            <button
              type="button"
              className="focus-visible:outline-background inline-flex min-h-10 min-w-0 items-center gap-1 rounded-lg text-sm font-semibold focus-visible:outline-2"
              onClick={() => setShowMonths(!showMonths)}
              aria-expanded={showMonths}
              aria-label={
                showMonths ? 'Вернуться к дням месяца' : 'Выбрать месяц и год'
              }
            >
              <span aria-live="polite">
                {showMonths ? view?.year : monthTitle}
              </span>
              <ArrowRightIcon
                aria-hidden="true"
                className={`size-4 text-[#869400] ${showMonths ? '-rotate-90' : 'rotate-90'}`}
              />
            </button>
            <div className="flex shrink-0">
              <button
                type="button"
                className={`${styles.monthNavigation} ${smallButtonClassName} text-[#869400]`}
                aria-label={showMonths ? 'Предыдущий год' : 'Предыдущий месяц'}
                onClick={() => moveMonth(showMonths ? -12 : -1)}
              >
                <ArrowLeftIcon aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                className={`${styles.monthNavigation} ${smallButtonClassName} text-[#869400]`}
                aria-label={showMonths ? 'Следующий год' : 'Следующий месяц'}
                onClick={() => moveMonth(showMonths ? 12 : 1)}
              >
                <ArrowRightIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          {showMonths ? (
            <div className="grid grid-cols-3 gap-2 py-2">
              {months.map((month, index) => (
                <button
                  key={month}
                  type="button"
                  className={`focus-visible:outline-background hover:bg-primary/40 min-h-12 rounded-lg px-1 text-xs font-medium transition-colors focus-visible:outline-2 ${view?.month === index ? 'bg-[#869400]/12 text-[#869400]' : ''}`}
                  onClick={() => {
                    if (!view) return
                    setView({ year: view.year, month: index })
                    setFocusedDate(toDateKey(new Date(view.year, index, 1, 12)))
                    setShowMonths(false)
                  }}
                >
                  {month}
                </button>
              ))}
            </div>
          ) : (
            <div role="grid" aria-label={monthTitle}>
              <div role="row" className="grid grid-cols-7">
                {weekdays.map((day) => (
                  <span
                    key={day}
                    role="columnheader"
                    className="text-background/40 py-1 text-center text-[11px] font-semibold"
                  >
                    {day}
                  </span>
                ))}
              </div>
              {Array.from({ length: 6 }, (_, row) => (
                <div key={row} role="row" className="grid grid-cols-7">
                  {days.slice(row * 7, row * 7 + 7).map((day) => (
                    <div
                      key={day.key}
                      role="gridcell"
                      aria-selected={draftDate === day.key}
                    >
                      <button
                        type="button"
                        data-date={day.key}
                        data-calendar-focus={focusedDate === day.key}
                        tabIndex={focusedDate === day.key ? 0 : -1}
                        aria-label={dateLabel.format(fromDateKey(day.key))}
                        aria-current={today === day.key ? 'date' : undefined}
                        className={`${styles.day} focus-visible:outline-background hover:bg-primary/40 flex w-full items-center justify-center rounded-full text-sm tabular-nums transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 ${today === day.key ? 'font-semibold text-[#869400]' : day.inMonth ? 'text-background' : 'text-background/30'}`}
                        onClick={() => {
                          setDraftDate(day.key)
                          setFocusedDate(day.key)
                        }}
                        onKeyDown={(event) => handleDayKey(event, day.key)}
                      >
                        <span
                          className={`flex size-8 items-center justify-center rounded-full ${draftDate === day.key ? 'bg-[#869400]/12 font-semibold text-[#869400]' : ''}`}
                        >
                          {day.day}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <div className="border-background/10 mt-2 border-t pt-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Время</p>
              <button
                type="button"
                aria-label="Изменить время"
                aria-expanded={showTimeControls}
                className={`${styles.timeButton} bg-background/5 focus-visible:outline-background min-h-8 items-center rounded-md px-2 text-base tabular-nums focus-visible:outline-2`}
                onClick={() => setShowTimeControls(!showTimeControls)}
              >
                {String(normalizeTimePart(hours, 23)).padStart(2, '0')}:
                {String(normalizeTimePart(minutes, 59)).padStart(2, '0')}
              </button>
            </div>
            <div
              className={`${showTimeControls ? '' : styles.collapsedTime} grid grid-cols-2 gap-3`}
            >
              <TimeUnit
                label="Часы"
                value={hours}
                maximum={23}
                onChange={setHours}
                onStep={(direction) => changeTime(direction * 60)}
              />
              <TimeUnit
                label="Минуты"
                value={minutes}
                maximum={59}
                onChange={setMinutes}
                onStep={(direction) => changeTime(direction * 5)}
              />
            </div>
          </div>
        </div>

        <footer className="border-background/10 flex shrink-0 gap-2 border-t px-3 pt-2 pb-[max(12px,env(safe-area-inset-bottom))]">
          <button
            type="button"
            className="focus-visible:outline-background hover:bg-background/5 min-h-11 rounded-lg px-3 text-sm transition-colors focus-visible:outline-2"
            onClick={() => {
              setSelected(null)
              closePicker()
            }}
          >
            Сбросить
          </button>
          <button
            type="button"
            disabled={!draftDate}
            className="bg-background focus-visible:outline-background min-h-11 flex-1 rounded-lg px-3 text-sm font-semibold text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => {
              if (!draftDate) return
              setSelected({
                date: draftDate,
                hours: normalizeTimePart(hours, 23),
                minutes: normalizeTimePart(minutes, 59),
              })
              closePicker()
            }}
          >
            Готово
          </button>
        </footer>
      </dialog>
    </div>
  )
}
