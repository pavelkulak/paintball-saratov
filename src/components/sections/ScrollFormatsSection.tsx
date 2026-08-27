import { twMerge } from 'tailwind-merge'

import { DesktopPlanetSceneGate } from '@/components/sections/scroll-formats/DesktopPlanetSceneGate'
import { MobilePlanetSlider } from '@/components/sections/scroll-formats/MobilePlanetSlider'
import { planets } from '@/components/sections/scroll-formats/formats.data'

type ScrollFormatsSectionProps = {
  className?: string
}

export function ScrollFormatsSection({ className }: ScrollFormatsSectionProps) {
  return (
    <div className={twMerge('w-full', className)}>
      <DesktopPlanetSceneGate slideCount={planets.length + 1} />
      <MobilePlanetSlider />
    </div>
  )
}
