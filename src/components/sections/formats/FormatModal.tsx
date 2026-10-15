'use client'

import { BookingForm } from '@/components/booking/BookingForm'
import { Dialog } from '@/components/ui/Dialog'
import { FormatInfoIcon } from '@/components/icons/FormatInfoIcon'
import { formatPrice } from '@/lib/format-price'

import type { FormatCardData, FormatTariff } from './formats.types'

export function FormatModal({
  format,
  tariff,
  mode,
  onClose,
}: {
  format: FormatCardData
  tariff?: FormatTariff
  mode: 'info' | 'booking'
  onClose: () => void
}) {
  const isInfo = mode === 'info'

  return (
    <Dialog
      title={
        isInfo ? `Что такое ${format.title.toLowerCase()}?` : 'Заявка на игру'
      }
      subtitle={`Игровые форматы · ${format.title}`}
      onClose={onClose}
    >
      {isInfo ? (
        <div className="grid gap-4">
          <section className="text-ink rounded-[20px] bg-white p-5 sm:p-6">
            <h3 className="text-background/65 text-xs font-semibold tracking-[0.08em] uppercase">
              Об игре
            </h3>
            <p className="mt-2 text-base leading-[1.5] sm:text-lg">
              {format.description}
            </p>
          </section>
          <section className="border-background/20 rounded-[20px] border p-4 sm:p-5">
            <h3 className="text-lg font-semibold">Фото и видео</h3>
            <div className="border-background/25 mt-3 flex min-h-40 flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed px-5 py-8 text-center sm:min-h-52">
              <FormatInfoIcon aria-hidden="true" className="size-9" />
              <p className="text-background/70 max-w-sm text-sm leading-[1.5]">
                Фото и видео формата «{format.title}» скоро появятся.
              </p>
            </div>
          </section>
        </div>
      ) : (
        <>
          <div className="text-ink mb-5 rounded-[16px] bg-white p-4">
            <p className="text-background/65 text-xs">
              Выбранный формат и тариф
            </p>
            <h3 className="mt-1 text-lg leading-[1.2] font-semibold">
              {format.title}
            </h3>
            <p className="text-background/75 mt-2 text-sm leading-[1.5]">
              {tariff
                ? `${tariff.name} · ${formatPrice(tariff.price)} / игрок · ${tariff.duration}`
                : 'Индивидуальный подбор тарифа'}
            </p>
          </div>
          <BookingForm />
        </>
      )}
    </Dialog>
  )
}
