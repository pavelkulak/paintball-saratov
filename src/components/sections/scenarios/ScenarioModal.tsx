'use client'

import { useEffect, useRef, useState } from 'react'

import { BookingForm } from '@/components/booking/BookingForm'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'

import type { ScenarioCardData, ScenarioBookingOption } from './scenarios.types'

export function ScenarioModal({
  scenario,
  onClose,
}: {
  scenario: ScenarioCardData
  onClose: () => void
}) {
  const [selected, setSelected] = useState<ScenarioBookingOption | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    contentRef.current?.focus({ preventScroll: true })
  }, [selected])

  return (
    <Dialog
      title={selected ? 'Забронировать сценарий' : 'Выберите сценарий'}
      subtitle={scenario.title}
      onClose={onClose}
    >
      <div ref={contentRef} tabIndex={-1} className="outline-none">
        {selected ? (
          <>
            <button
              type="button"
              className="focus-visible:outline-background mb-5 min-h-11 text-sm underline underline-offset-4 focus-visible:outline-2"
              onClick={() => setSelected(null)}
            >
              ← Выбрать другой сценарий
            </button>
            <div className="text-ink mb-5 rounded-[16px] bg-white p-4">
              <p className="text-background/65 text-xs">Выбранный сценарий</p>
              <h3 className="mt-1 text-lg leading-[1.2] font-semibold">
                {selected.name}
              </h3>
              <p className="text-background/75 mt-2 text-sm leading-[1.4]">
                {selected.tariff}
              </p>
              <p className="mt-1 font-semibold">{selected.price}</p>
            </div>
            <BookingForm key={selected.name} showDate />
          </>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {scenario.bookingScenarios.map((option, index) => (
              <article
                key={option.name}
                className="text-ink flex min-w-0 flex-col rounded-[20px] bg-white p-5 sm:p-6"
              >
                <p className="text-background/65 text-xs font-semibold tracking-[0.08em] uppercase">
                  Сценарий {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 text-xl leading-[1.2] font-semibold">
                  {option.name}
                </h3>
                <p className="text-background/75 mt-4 text-sm leading-[1.3]">
                  {option.tariff}
                </p>
                <p className="text-ink mt-2 text-lg font-semibold">
                  {option.price}
                </p>
                <p className="mt-4 flex-1 text-sm leading-[1.5]">
                  {option.description}
                </p>
                <p className="text-background/70 mt-4 border-t border-black/10 pt-3 text-xs leading-[1.5]">
                  {option.note}
                </p>
                <Button
                  type="button"
                  variant="primary"
                  className="mt-5 min-h-12 w-full max-w-none rounded-[16px] px-5 py-3 font-semibold"
                  onClick={() => setSelected(option)}
                >
                  Забронировать
                </Button>
              </article>
            ))}
          </div>
        )}
      </div>
    </Dialog>
  )
}
