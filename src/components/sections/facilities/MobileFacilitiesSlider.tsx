import { SectionHeading } from '@/components/ui/SectionHeading'

import { facilities, facilitiesSectionContent } from './facilities.data'
import { FACILITY_CARD_HEIGHT, FacilityCard } from './FacilityCard'

export function MobileFacilitiesSlider() {
  return (
    <section
      aria-labelledby="facilities-mobile-title"
      className="bg-background text-foreground overflow-hidden xl:hidden"
    >
      <div className="max-w-content mx-auto w-full pt-[9px]">
        <div className="px-4">
          <SectionHeading
            className="mx-auto max-w-[328px]"
            title={facilitiesSectionContent.title}
            titleId="facilities-mobile-title"
            description={facilitiesSectionContent.description}
            decor="comfort"
          />
        </div>

        <ul
          aria-label="Удобства площадки"
          tabIndex={0}
          className="focus-visible:outline-primary mt-10 flex snap-x snap-mandatory [scrollbar-width:none] gap-3 overflow-x-auto px-4 focus-visible:outline-2 focus-visible:outline-offset-[-2px] [&::-webkit-scrollbar]:hidden"
        >
          {facilities.map((facility) => (
            <li
              className="w-[calc(100vw-32px)] max-w-[420px] flex-none snap-center first:snap-start last:snap-end"
              key={facility.title}
              style={{ height: FACILITY_CARD_HEIGHT }}
            >
              <FacilityCard facility={facility} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
