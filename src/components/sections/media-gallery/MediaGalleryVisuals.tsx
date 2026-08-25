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

export function GalleryVideo({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  return (
    <div
      className={twMerge(
        'relative aspect-[16/7] w-full overflow-hidden rounded-[24px]',
        className,
      )}
    >
      <video
        className="absolute inset-0 size-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}
