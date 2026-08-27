import { EmblaCarousel } from '@/components/ui/EmblaCarousel'
import { MOBILE_ONLY_EMBLA_OPTIONS } from '@/components/ui/embla-carousel.options'
import { SectionHeading } from '@/components/ui/SectionHeading'

import { facilities, facilitiesSectionContent } from './facilities.data'
import { FACILITY_CARD_HEIGHT, FacilityCard } from './FacilityCard'

export function MobileFacilitiesSlider() {
  return (
    <div className="bg-background text-foreground overflow-hidden xl:hidden">
      <div className="pt-[9px]">
        <div className="page-container">
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
          className="page-rail mt-10"
        >
          {facilities.map((facility) => (
            <li
              className="w-[min(calc(100vw-2*var(--layout-gutter)),420px)]"
              key={facility.title}
              style={{ height: FACILITY_CARD_HEIGHT }}
            >
              <FacilityCard facility={facility} />
            </li>
          ))}
        </EmblaCarousel>
      </div>
    </div>
  )
}
