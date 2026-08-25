import { SectionHeading } from '@/components/ui/SectionHeading'

import { DesktopMediaGallery } from './media-gallery/DesktopMediaGallery'
import {
  GalleryPhoto,
  GalleryVideo,
  type MediaGalleryPhotoData,
} from './media-gallery/MediaGalleryVisuals'

const mediaGalleryContent = {
  title: 'Обзор площадки и игр',
  video: '/videos/paintball-overview.mp4',
  photos: [
    {
      src: '/images/media-gallery/paintball-gallery-01.jpg',
      desktopClassName:
        'left-[13%] top-[234svh] aspect-[4/5] w-[10vw] max-w-[154px]',
    },
    {
      src: '/images/media-gallery/paintball-gallery-02.jpg',
      desktopClassName:
        'right-[13%] top-[234svh] aspect-[4/5] w-[10vw] max-w-[154px]',
    },
    {
      src: '/images/media-gallery/paintball-gallery-03.jpg',
      desktopClassName:
        'left-[34%] top-[253svh] aspect-[3/4] w-[15vw] max-w-[226px]',
    },
    {
      src: '/images/media-gallery/paintball-gallery-04.jpg',
      desktopClassName:
        'right-[36%] top-[260svh] aspect-[3/4] w-[9vw] max-w-[132px]',
    },
  ] satisfies readonly MediaGalleryPhotoData[],
} as const

function StaticMediaGallery() {
  const [firstPhoto, secondPhoto, thirdPhoto, fourthPhoto] =
    mediaGalleryContent.photos

  return (
    <section
      aria-labelledby="media-gallery-title-static"
      className="bg-background text-foreground w-full overflow-hidden xl:hidden xl:motion-reduce:block"
    >
      <div className="max-w-content mx-auto w-full px-4 pt-[50px] pb-6 md:px-8 md:pt-[55px] md:pb-[55px]">
        <GalleryVideo
          src={mediaGalleryContent.video}
          className="aspect-[328/176] w-full rounded-[24px] md:aspect-[16/7]"
        />

        <div className="mt-4 grid grid-cols-[30.793%_48.171%] items-start justify-between md:mt-10 md:grid-cols-[32%_42%]">
          <div className="aspect-[5/7]">
            <GalleryPhoto
              photo={firstPhoto}
              className="size-full rounded-[24px]"
              sizes="(min-width: 768px) 32vw, 31vw"
            />
          </div>
          <div className="mt-[74px] aspect-[5/7] md:mt-16">
            <GalleryPhoto
              photo={secondPhoto}
              className="size-full rounded-[24px]"
              sizes="(min-width: 768px) 42vw, 49vw"
            />
          </div>
        </div>

        <SectionHeading
          decor="media"
          title={mediaGalleryContent.title}
          titleId="media-gallery-title-static"
          className="mx-auto mt-10 max-w-[328px] md:mt-14 md:max-w-[520px]"
        />

        <div className="mt-[52px] grid grid-cols-[30.793%_48.171%] items-start justify-between md:mt-14 md:grid-cols-[32%_42%]">
          <div className="mt-[155px] aspect-[5/7] md:mt-24">
            <GalleryPhoto
              photo={thirdPhoto}
              className="size-full rounded-[24px]"
              sizes="(min-width: 768px) 32vw, 31vw"
            />
          </div>
          <div className="aspect-[5/7]">
            <GalleryPhoto
              photo={fourthPhoto}
              className="size-full rounded-[24px]"
              sizes="(min-width: 768px) 42vw, 49vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export function MediaGallerySection() {
  return (
    <>
      <StaticMediaGallery />
      <DesktopMediaGallery content={mediaGalleryContent} />
    </>
  )
}
