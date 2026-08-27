import { EmblaCarousel } from '@/components/ui/EmblaCarousel'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Review } from '@/lib/bitrix/home-schema'

import { ReviewCard } from './ReviewCard'

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return null
  }

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="section-anchor page-section-gap bg-background text-foreground w-full overflow-hidden"
    >
      <div className="page-container">
        <SectionHeading
          decor="reviews"
          title={
            <>
              Что говорят
              <br className="md:hidden" /> родители
            </>
          }
          titleId="reviews-title"
        />
      </div>

      <EmblaCarousel
        ariaLabel="Отзывы родителей"
        containerClassName="gap-4"
        className="page-rail mt-[52px]"
      >
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </EmblaCarousel>
    </section>
  )
}
