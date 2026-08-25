import Image from 'next/image'

import { MediaCardCaption, MediaCardFrame } from '@/components/ui/MediaCard'

import type { Facility } from './facilities.data'

export const FACILITY_CARD_HEIGHT = 350

const FACILITY_IMAGE_SIZES =
  '(min-width: 1280px) 592px, (min-width: 768px) 420px, calc(100vw - 32px)'

type FacilityCardProps = {
  facility: Facility
}

export function FacilityCard({ facility }: FacilityCardProps) {
  return (
    <article className="h-full">
      <MediaCardFrame className="h-full w-full">
        <div className="bg-olive absolute inset-0">
          <Image
            src={facility.image}
            alt=""
            fill
            sizes={FACILITY_IMAGE_SIZES}
            className="object-cover"
          />
        </div>

        <MediaCardCaption className="flex min-h-[130px] flex-col justify-center px-6 py-5">
          <h3 className="text-xl leading-[1.2] font-semibold">
            {facility.title}
          </h3>
          <p className="text-muted mt-2 max-w-[441px] text-sm leading-[1.2]">
            {facility.description}
          </p>
        </MediaCardCaption>
      </MediaCardFrame>
    </article>
  )
}
