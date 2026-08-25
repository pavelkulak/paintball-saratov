import { FacilitiesSection } from '@/components/sections/FacilitiesSection'
import { Hero } from '@/components/sections/Hero'
import { EventSupportSection } from '@/components/sections/EventSupportSection'
import { ScrollFormatsSection } from '@/components/sections/ScrollFormatsSection'
import { MediaGallerySection } from '@/components/sections/MediaGallerySection'

export default async function Home() {
  return (
    <main>
      <Hero />
      <ScrollFormatsSection />
      <EventSupportSection />
      <FacilitiesSection />
      <MediaGallerySection />
    </main>
  )
}
