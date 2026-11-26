import { SectionHeading } from '@/components/ui/SectionHeading'

import { DesktopScenariosGrid } from './scenarios/DesktopScenariosGrid'
import { MobileScenariosSlider } from './scenarios/MobileScenariosSlider'

import type { ScenarioCardData } from './scenarios/scenarios.types'
import type { SiteTheme } from '@/lib/site-theme'
import { SectionSplatters } from '@/components/sections/SectionSplatters'

type ScenariosSectionProps = {
  scenarios: readonly ScenarioCardData[]
  theme: SiteTheme
}

export function ScenariosSection({ scenarios, theme }: ScenariosSectionProps) {
  return (
    <section
      id="scenarios"
      aria-labelledby="scenarios-title"
      className={`section-anchor bg-background text-foreground relative isolate w-full ${theme === 'new-year' ? 'overflow-x-clip pt-[var(--layout-section-gap)]' : 'page-section-gap overflow-hidden'}`}
    >
      <SectionSplatters section="scenarios" />
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
