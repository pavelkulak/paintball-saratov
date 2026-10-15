import { SectionHeading } from '@/components/ui/SectionHeading'

import { DesktopFormatsGrid } from './formats/DesktopFormatsGrid'
import { MobileFormatsSlider } from './formats/MobileFormatsSlider'

import { formats } from './formats/formats.data'

export function FormatsSection() {
  return (
    <section
      id="formats"
      aria-labelledby="formats-title"
      className="section-anchor page-section-gap bg-background text-foreground w-full overflow-hidden"
    >
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
