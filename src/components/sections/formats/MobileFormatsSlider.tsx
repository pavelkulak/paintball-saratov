import { FORMAT_CARD_ICONS } from '@/components/icons/FormatIcons'
import { EmblaCarousel } from '@/components/ui/EmblaCarousel'
import { MOBILE_ONLY_EMBLA_OPTIONS } from '@/components/ui/embla-carousel.options'

import { FormatCard, type FormatCardData } from './FormatCard'

type MobileFormatsSliderProps = {
  formats: readonly FormatCardData[]
}

export function MobileFormatsSlider({ formats }: MobileFormatsSliderProps) {
  return (
    <EmblaCarousel
      ariaLabel="Форматы игры"
      containerClassName="items-stretch gap-3"
      options={MOBILE_ONLY_EMBLA_OPTIONS}
      className="page-rail mt-10 pb-4 xl:hidden"
    >
      {formats.map((format, index) => (
        <li
          className="flex w-[min(calc(100vw-2*var(--layout-gutter)),20rem)] self-stretch"
          key={format.id}
        >
          <FormatCard format={format} icon={FORMAT_CARD_ICONS[index]} />
        </li>
      ))}
    </EmblaCarousel>
  )
}
