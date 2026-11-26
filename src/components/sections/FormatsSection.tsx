import { SectionHeading } from '@/components/ui/SectionHeading'

import { DesktopFormatsGrid } from './formats/DesktopFormatsGrid'
import { MobileFormatsSlider } from './formats/MobileFormatsSlider'

import type { FormatCardData } from './formats/formats.types'
import type { SiteTheme } from '@/lib/site-theme'
import { SectionSplatters } from '@/components/sections/SectionSplatters'

type FormatsSectionProps = {
  formats: readonly FormatCardData[]
  theme: SiteTheme
}

export function FormatsSection({ formats, theme }: FormatsSectionProps) {
  return (
    <section
      id="formats"
      aria-labelledby="formats-title"
      className={`section-anchor page-section-gap text-foreground relative isolate w-full overflow-hidden ${theme === 'new-year' ? 'bg-transparent' : 'bg-background'}`}
    >
      <SectionSplatters section="formats" />
      <div className="page-container">
        <SectionHeading
          className="mx-auto max-w-[328px] gap-7 xl:max-w-[554px]"
          contentClassName="gap-4"
          decor="formats"
          descriptionClassName="font-normal"
          title="Выберите формат игры"
          titleId="formats-title"
          description="Форматы можно совмещать. Поможем подобрать лучшее сочетание под ваш праздник"
        />
      </div>

      <MobileFormatsSlider formats={formats} />
      <DesktopFormatsGrid formats={formats} />
    </section>
  )
}
