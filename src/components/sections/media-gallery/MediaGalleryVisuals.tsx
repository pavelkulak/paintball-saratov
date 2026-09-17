import { twMerge } from 'tailwind-merge'
import Image from 'next/image'

export type MediaGalleryPhotoData = {
  src: string
  desktopClassName: string
}

export function GalleryPhoto({
  photo,
  className,
  sizes = '230px',
}: {
  photo: MediaGalleryPhotoData
  className?: string
  sizes?: string
}) {
  return (
    <div
      className={twMerge('relative overflow-hidden rounded-[18px]', className)}
    >
      <Image
        src={photo.src}
        alt=""
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  )
}
