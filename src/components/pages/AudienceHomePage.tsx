import { connection } from 'next/server'
import { getSiteTheme, isThemePreviewEnabled } from '@/lib/site-theme.server'
import { ThemePreviewToggle } from '@/components/ui/ThemePreviewToggle'
import { SiteThemeProvider } from '@/components/providers/SiteThemeProvider'

import { EventSupportSection } from '@/components/sections/EventSupportSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { FacilitiesSection } from '@/components/sections/FacilitiesSection'
import { FormatsSection } from '@/components/sections/FormatsSection'
import { Hero } from '@/components/sections/Hero'
import { LeadFormSection } from '@/components/sections/LeadFormSection'
import { MediaGallerySection } from '@/components/sections/MediaGallerySection'
import { ReviewsSection } from '@/components/sections/reviews/ReviewsSection'
import { EventAdditionsSection } from '@/components/sections/EventAdditionsSection'
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

  const [home, theme] = await Promise.all([getHomeContent(), getSiteTheme()])

  return (
    <SiteThemeProvider theme={theme}>
      <main data-audience-page={audience} data-site-theme={theme}>
        {isThemePreviewEnabled() && <ThemePreviewToggle theme={theme} />}
        <Hero audience={audience} content={home} theme={theme} />
        <ScenariosSection
          key={`scenarios-${audience}`}
          scenarios={getScenariosForAudience(audience)}
          theme={theme}
        />
        <FormatsSection
          key={`formats-${audience}`}
          formats={getFormatsForAudience(audience)}
          theme={theme}
        />
        <EventAdditionsSection />
        <EventSupportSection audience={audience} theme={theme} />
        <FacilitiesSection />
        <MediaGallerySection />
        <ReviewsSection reviews={home.reviews} />
        {/* The lead artwork extends behind FAQ within this shared background layer. */}
        <div className="relative isolate">
          <FAQSection />
          <LeadFormSection />
        </div>
      </main>
    </SiteThemeProvider>
  )
}
