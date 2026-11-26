import { twMerge } from 'tailwind-merge'

import { DesktopAdditionsSceneGate } from '@/components/sections/event-additions/DesktopAdditionsSceneGate'
import { MobileAdditionsSlider } from '@/components/sections/event-additions/MobileAdditionsSlider'
import { eventAdditions } from '@/components/sections/event-additions/additions.data'

type EventAdditionsSectionProps = {
  className?: string
}

export function EventAdditionsSection({
  className,
}: EventAdditionsSectionProps) {
  return (
    <section
      id="event-additions"
      aria-label="Дополнения к празднику"
      className={twMerge('section-anchor w-full', className)}
    >
      <DesktopAdditionsSceneGate
        scrollScreens={1 + (eventAdditions.length - 1) * 0.6}
      />
      <MobileAdditionsSlider />
    </section>
  )
}
