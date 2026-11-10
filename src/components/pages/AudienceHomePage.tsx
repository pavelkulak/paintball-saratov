import { connection } from 'next/server'

import { EventSupportSection } from '@/components/sections/EventSupportSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { FacilitiesSection } from '@/components/sections/FacilitiesSection'
import { FormatsSection } from '@/components/sections/FormatsSection'
import { Hero } from '@/components/sections/Hero'
import { LeadFormSection } from '@/components/sections/LeadFormSection'
import { MediaGallerySection } from '@/components/sections/MediaGallerySection'
import { ReviewsSection } from '@/components/sections/reviews/ReviewsSection'
import { ScrollFormatsSection } from '@/components/sections/ScrollFormatsSection'
import { ScenariosSection } from '@/components/sections/ScenariosSection'
import { getFormatsForAudience } from '@/components/sections/formats/formats.data'
import { getScenariosForAudience } from '@/components/sections/scenarios/scenarios.data'
import type { AudienceId } from '@/lib/audience'
import { getHomeContent } from '@/lib/bitrix/home'

type AudienceHomePageProps = {
  audience: AudienceId
}

export async function AudienceHomePage({ audience }: AudienceHomePageProps) {
  if (process.env.STATIC_EXPORT !== '1') {
    await connection()
  }

  const home = await getHomeContent()

  return (
    <main data-audience-page={audience}>
      <Hero audience={audience} content={home} />
      <ScenariosSection
        key={`scenarios-${audience}`}
        scenarios={getScenariosForAudience(audience)}
      />
      <FormatsSection
        key={`formats-${audience}`}
        formats={getFormatsForAudience(audience)}
      />
      <ScrollFormatsSection />
      <EventSupportSection audience={audience} />
      <FacilitiesSection />
      <MediaGallerySection />
      <ReviewsSection reviews={home.reviews} />
      <FAQSection />
      <LeadFormSection />
    </main>
  )
}
