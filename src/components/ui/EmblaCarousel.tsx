'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useEffect, useState, type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import {
  DEFAULT_EMBLA_OPTIONS,
  type EmblaCarouselOptions,
} from './embla-carousel.options'

type EmblaCarouselProps = {
  ariaLabel: string
  children: ReactNode
  className?: string
  containerClassName?: string
  options?: EmblaCarouselOptions
}

export function EmblaCarousel({
  ariaLabel,
  children,
  className,
  containerClassName,
  options,
}: EmblaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...DEFAULT_EMBLA_OPTIONS,
    ...options,
  })
  const [cursor, setCursor] = useState<'auto' | 'grab' | 'grabbing'>('auto')

  useEffect(() => {
    if (!emblaApi) {
      return
    }

    const canDrag = () =>
      options?.watchDrag !== false &&
      (emblaApi.canScrollPrev() || emblaApi.canScrollNext())
    const syncCursor = () => setCursor(canDrag() ? 'grab' : 'auto')
    const startDragging = () => setCursor(canDrag() ? 'grabbing' : 'auto')

    syncCursor()
    emblaApi
      .on('reInit', syncCursor)
      .on('pointerDown', startDragging)
      .on('pointerUp', syncCursor)

    return () => {
      emblaApi
        .off('reInit', syncCursor)
        .off('pointerDown', startDragging)
        .off('pointerUp', syncCursor)
    }
  }, [emblaApi, options?.watchDrag])

  return (
    <div
      ref={emblaRef}
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      data-dragging={cursor === 'grabbing' || undefined}
      role="region"
      tabIndex={0}
      className={twMerge(
        'focus-visible:outline-primary w-full [touch-action:pan-y_pinch-zoom] overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-2px] data-[dragging=true]:[&_*]:cursor-grabbing',
        cursor === 'grabbing'
          ? 'cursor-grabbing'
          : cursor === 'grab'
            ? 'cursor-grab'
            : 'cursor-auto',
        className,
      )}
    >
      <ul
        className={twMerge(
          'flex select-none [&>*]:min-w-0 [&>*]:flex-none',
          containerClassName,
        )}
      >
        {children}
      </ul>
    </div>
  )
}
