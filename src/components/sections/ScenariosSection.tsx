import { SectionHeading } from '@/components/ui/SectionHeading'

import { DesktopScenariosGrid } from './scenarios/DesktopScenariosGrid'
import { MobileScenariosSlider } from './scenarios/MobileScenariosSlider'

import type { ScenarioCardData } from './scenarios/scenarios.types'
import splatters from './section-splatters.module.css'

type ScenariosSectionProps = {
  scenarios: readonly ScenarioCardData[]
}

export function ScenariosSection({ scenarios }: ScenariosSectionProps) {
  return (
    <section
      id="scenarios"
      aria-labelledby="scenarios-title"
      className={`section-anchor page-section-gap bg-background text-foreground w-full overflow-hidden ${splatters.scenarios}`}
    >
      <div className="page-container">
        <SectionHeading
          className="mx-auto max-w-[327px] xl:max-w-[633px] xl:gap-7"
          contentClassName="gap-4"
          decor="scenarios"
          descriptionClassName="font-normal"
          title="Быстрый выбор под ваш повод"
          titleId="scenarios-title"
          description="Готовые форматы праздника — выберите подходящий и узнайте, что входит"
        />
      </div>

      <MobileScenariosSlider scenarios={scenarios} />
      <DesktopScenariosGrid scenarios={scenarios} />
    </section>
  )
}
