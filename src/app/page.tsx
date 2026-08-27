import { FacilitiesSection } from '@/components/sections/FacilitiesSection'
import { Hero } from '@/components/sections/Hero'
import { EventSupportSection } from '@/components/sections/EventSupportSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { LeadFormSection } from '@/components/sections/LeadFormSection'
import { ReviewsSection } from '@/components/sections/reviews/ReviewsSection'
import { ScrollFormatsSection } from '@/components/sections/ScrollFormatsSection'
import { MediaGallerySection } from '@/components/sections/MediaGallerySection'
import { getHomeContent } from '@/lib/bitrix/home'

export default async function Home() {
  const home = await getHomeContent()

  return (
    <main>
      <Hero content={home} />
      <ScrollFormatsSection />
      <EventSupportSection />
      <FacilitiesSection />
      <MediaGallerySection />
      <ReviewsSection reviews={home.reviews} />
      <FAQSection />
      <LeadFormSection />
    </main>
  )
}
