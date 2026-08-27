import type useEmblaCarousel from 'embla-carousel-react'

export type EmblaCarouselOptions = NonNullable<
  Parameters<typeof useEmblaCarousel>[0]
>

export const DEFAULT_EMBLA_OPTIONS = {
  align: 'start',
  containScroll: 'trimSnaps',
  dragFree: true,
  loop: false,
} satisfies EmblaCarouselOptions

export const MOBILE_ONLY_EMBLA_OPTIONS = {
  breakpoints: {
    '(min-width: 1280px)': { active: false },
  },
} satisfies EmblaCarouselOptions
