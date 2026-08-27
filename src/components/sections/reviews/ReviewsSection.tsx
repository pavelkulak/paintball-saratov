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
      aria-labelledby="reviews-title"
      className="bg-background text-foreground w-full overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 xl:pt-32 xl:pb-36"
    >
      <div className="max-w-content mx-auto w-full px-4 md:px-8 xl:px-0">
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
        className="mt-[52px] px-4 md:px-8 xl:pr-[max(1rem,calc((100vw-1200px)/2))] xl:pl-[max(0px,calc((100vw-1200px)/2))]"
      >
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </EmblaCarousel>
    </section>
  )
}
