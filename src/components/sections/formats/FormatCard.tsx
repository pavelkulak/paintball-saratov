'use client'

import { useState } from 'react'

import { FORMAT_CARD_ICONS } from '@/components/icons/FormatIcons'
import { FormatInfoIcon } from '@/components/icons/FormatInfoIcon'
import { Button } from '@/components/ui/Button'

import { FormatModal } from './FormatModal'
import type { FormatCardData } from './formats.types'
import { formatPrice } from '@/lib/format-price'

type FormatCardProps = {
  format: FormatCardData
  iconIndex: number
  variant?: 'mobile' | 'desktop'
}

export function FormatCard({
  format,
  iconIndex,
  variant = 'mobile',
}: FormatCardProps) {
  const FormatIcon = FORMAT_CARD_ICONS[iconIndex]
  const isDark = format.palette === 'dark'
  const isDesktop = variant === 'desktop'
  const bodyTextClass = isDark ? 'text-foreground' : 'text-ink'
  const tariffs = format.tariffs ?? []
  const [activeTariffIndex, setActiveTariffIndex] = useState(
    format.activeTariff ?? 0,
  )
  const [modal, setModal] = useState<'info' | 'booking' | null>(null)
  const selectedTariff = tariffs[activeTariffIndex]

  return (
    <>
      <article
        className={`relative flex h-full min-w-0 flex-col overflow-hidden rounded-[24px] ${isDark ? 'bg-background' : 'bg-primary'} ${isDark ? 'ring-primary ring-2 ring-inset' : ''}`}
      >
        <header
          className={`absolute z-10 flex h-12 items-center justify-between ${isDesktop ? 'inset-x-5 top-5 gap-4' : 'inset-x-4 top-4 gap-3'}`}
        >
          <div
            className={`flex min-w-0 items-center ${isDesktop ? 'gap-5' : 'gap-3'}`}
          >
            <span
              className={`flex size-12 shrink-0 items-center justify-center rounded-[14px] ${isDark ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'}`}
            >
              <FormatIcon aria-hidden="true" />
            </span>
            <h3
              className={`min-w-0 leading-[1.2] font-semibold ${isDesktop ? 'text-2xl' : 'text-xl'} ${isDark ? 'text-primary' : 'text-ink'}`}
            >
              {format.title}
            </h3>
          </div>

          <Button
            type="button"
            variant="light"
            aria-label={`Подробнее о формате «${format.title}»`}
            aria-haspopup="dialog"
            onClick={() => setModal('info')}
            className="text-ink focus-visible:ring-primary h-8 w-8 max-w-none shrink-0 rounded-full p-0 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none"
          >
            <FormatInfoIcon aria-hidden="true" />
          </Button>
        </header>

        <div
          className={`relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] ${isDesktop ? 'mt-[88px] px-5 pt-5 pb-5' : 'mt-20 px-4 pt-7 pb-4'} ${isDark ? 'bg-background ring-primary ring-2 ring-inset' : 'bg-white'}`}
        >
          {format.backgroundImage ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${format.backgroundImage}")` }}
            />
          ) : null}

          <div className="relative z-10 flex min-h-0 flex-1 flex-col">
            <dl
              className={`flex flex-col ${isDesktop ? 'gap-3' : 'gap-6'} ${bodyTextClass}`}
            >
              {tariffs.length ? (
                <div className="flex flex-col gap-2">
                  <dt
                    className={`${isDesktop ? 'text-sm leading-[1.2]' : 'text-xs leading-[1.25]'} text-muted`}
                  >
                    Тариф:
                  </dt>
                  <dd>
                    <ul className="flex flex-wrap gap-1" aria-label="Тарифы">
                      {tariffs.map((tariff, index) => {
                        const isActive = index === activeTariffIndex
                        const tariffClass = isDark
                          ? isActive
                            ? 'bg-white text-ink'
                            : 'bg-background text-foreground ring-1 ring-inset ring-white'
                          : isActive
                            ? 'bg-background text-foreground'
                            : 'bg-white text-ink ring-1 ring-inset ring-background'

                        return (
                          <li key={tariff.name}>
                            <button
                              type="button"
                              aria-pressed={isActive}
                              onClick={() => setActiveTariffIndex(index)}
                              className={`rounded-full px-3 py-2 text-left ${isDesktop ? 'text-sm leading-[1.2]' : 'text-xs leading-[1.2]'} ${tariffClass}`}
                            >
                              {tariff.name}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                    {selectedTariff ? (
                      <p
                        className={`text-muted text-xs leading-[1.35] ${isDesktop ? 'mt-1' : 'mt-2'}`}
                      >
                        {selectedTariff.duration}. {selectedTariff.details}
                      </p>
                    ) : null}
                  </dd>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <dt className="text-muted text-sm">Тариф:</dt>
                  <dd className="text-sm leading-[1.35]">
                    Сочетание игр и стоимость подберём под вашу компанию.
                  </dd>
                </div>
              )}

              <FormatDetail
                desktop={isDesktop}
                label="Возраст:"
                value={format.age}
              />
              <FormatDetail
                desktop={isDesktop}
                label={format.activityLabel}
                value={selectedTariff?.activity ?? format.activity}
              />
              <FormatDetail
                desktop={isDesktop}
                label="Особенность:"
                value={selectedTariff?.feature ?? format.feature}
              />
              <FormatDetail
                desktop={isDesktop}
                label={format.fitLabel}
                value={selectedTariff?.fit ?? format.fit}
              />
            </dl>

            <div
              className={
                isDesktop ? 'mt-auto flex flex-col gap-4 pt-5' : 'mt-auto pt-8'
              }
            >
              <div className="flex flex-col">
                <span
                  className={`text-muted leading-[1.25] font-semibold ${isDesktop ? 'text-sm' : 'text-xs'}`}
                >
                  Цена:
                </span>
                <strong
                  className={`${isDesktop ? 'text-3xl whitespace-nowrap' : 'text-4xl'} leading-none font-extrabold ${bodyTextClass}`}
                >
                  {selectedTariff
                    ? formatPrice(selectedTariff.price)
                    : 'по запросу'}
                </strong>
                {tariffs.length ? (
                  <span className="text-muted mt-1 text-xs">за игрока</span>
                ) : null}
              </div>

              <Button
                type="button"
                variant="primary"
                aria-haspopup="dialog"
                onClick={() => setModal('booking')}
                className={`min-h-[50px] rounded-[20px] px-5 text-base leading-[1.2] font-bold transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:outline-none ${isDesktop ? 'w-full max-w-none shrink-0' : 'mt-4 w-full max-w-none'}`}
              >
                Оставить заявку
              </Button>
            </div>
          </div>
        </div>
      </article>

      {modal ? (
        <FormatModal
          format={format}
          tariff={selectedTariff}
          mode={modal}
          onClose={() => setModal(null)}
        />
      ) : null}
    </>
  )
}

function FormatDetail({
  desktop,
  label,
  value,
}: {
  desktop: boolean
  label: string
  value: string
}) {
  return (
    <div className={`flex flex-col ${desktop ? 'gap-1' : 'gap-2'}`}>
      <dt
        className={`text-muted ${desktop ? 'text-sm leading-[1.2]' : 'text-xs leading-[1.25]'}`}
      >
        {label}
      </dt>
      <dd
        className={
          desktop ? 'text-[15px] leading-[1.15]' : 'text-sm leading-[1.2]'
        }
      >
        {value}
      </dd>
    </div>
  )
}
