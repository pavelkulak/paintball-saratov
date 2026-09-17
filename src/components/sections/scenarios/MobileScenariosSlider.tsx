import { EmblaCarousel } from '@/components/ui/EmblaCarousel'
import { MOBILE_ONLY_EMBLA_OPTIONS } from '@/components/ui/embla-carousel.options'

import { ScenarioCard, type ScenarioCardData } from './ScenarioCard'

type MobileScenariosSliderProps = {
  scenarios: readonly ScenarioCardData[]
}

export function MobileScenariosSlider({
  scenarios,
}: MobileScenariosSliderProps) {
  return (
    <EmblaCarousel
      ariaLabel="Сценарии праздника"
      containerClassName="items-stretch gap-3"
      options={MOBILE_ONLY_EMBLA_OPTIONS}
      className="page-rail mt-10 pb-4 xl:hidden"
    >
      {scenarios.map((scenario) => (
        <li
          className="flex w-[min(calc(100vw-2*var(--layout-gutter)),328px)] self-stretch"
          key={scenario.title}
        >
          <ScenarioCard scenario={scenario} />
        </li>
      ))}
    </EmblaCarousel>
  )
}
