import { EmblaCarousel } from '@/components/ui/EmblaCarousel'
import { MOBILE_ONLY_EMBLA_OPTIONS } from '@/components/ui/embla-carousel.options'
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

        <EmblaCarousel
          ariaLabel="Удобства площадки"
          containerClassName="gap-3"
          options={MOBILE_ONLY_EMBLA_OPTIONS}
          className="mt-10 px-4"
        >
          {facilities.map((facility) => (
            <li
              className="w-[calc(100vw-32px)] max-w-[420px]"
              key={facility.title}
              style={{ height: FACILITY_CARD_HEIGHT }}
            >
              <FacilityCard facility={facility} />
            </li>
          ))}
        </EmblaCarousel>
      </div>
    </section>
  )
}
