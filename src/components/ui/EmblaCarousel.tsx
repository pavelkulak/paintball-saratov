'use client'

import useEmblaCarousel from 'embla-carousel-react'
import type { ReactNode } from 'react'
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
  const [emblaRef] = useEmblaCarousel({ ...DEFAULT_EMBLA_OPTIONS, ...options })

  return (
    <div
      ref={emblaRef}
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      role="region"
      tabIndex={0}
      className={twMerge(
        'focus-visible:outline-primary w-full [touch-action:pan-y_pinch-zoom] overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
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
