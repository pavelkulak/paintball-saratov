'use client'

import clsx from 'clsx'
import { useEffect, useRef } from 'react'

import { SectionHeading } from '@/components/ui/SectionHeading'

import {
  GalleryPhoto,
  GalleryVideo,
  type MediaGalleryPhotoData,
} from './MediaGalleryVisuals'

const SCENE_ID = 'media-gallery-scene'
const DESKTOP_QUERY =
  '(min-width: 1280px) and (prefers-reduced-motion: no-preference)'

type DesktopMediaGalleryProps = {
  content: {
    title: string
    video: string
    photos: readonly MediaGalleryPhotoData[]
  }
}

export function DesktopMediaGallery({ content }: DesktopMediaGalleryProps) {
  const sceneRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let disposed = false
    let refreshFrame = 0
    let revertMedia: (() => void) | undefined

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        const scene = sceneRef.current

        if (disposed || !scene) {
          return
        }

        gsap.registerPlugin(ScrollTrigger)

        const scheduleRefresh = () => {
          if (disposed) {
            return
          }

          window.cancelAnimationFrame(refreshFrame)
          refreshFrame = window.requestAnimationFrame(() => {
            if (!disposed) {
              ScrollTrigger.refresh(true)
            }
          })
        }

        const media = gsap.matchMedia(scene)
        revertMedia = () => media.revert()

        media.add(DESKTOP_QUERY, () => {
          const stage = stageRef.current
          const video = videoRef.current
          const heading = headingRef.current

          if (!stage || !video || !heading) {
            return
          }

          const videoScale = 0.48
          const headerOffset = 153
          const headingGap = 80

          const getStageTravel = () =>
            Math.max(
              0,
              heading.offsetTop -
                headerOffset -
                video.offsetHeight * videoScale -
                headingGap,
            )

          gsap.set(stage, { y: 0 })
          gsap.set(video, {
            scale: 1,
            transformOrigin: '50% 0%',
          })

          gsap.to(stage, {
            y: getStageTravel,
            ease: 'none',
            scrollTrigger: {
              id: `${SCENE_ID}-hold`,
              trigger: scene,
              start: 'top top',
              end: () => `+=${getStageTravel()}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          })

          gsap.to(video, {
            scale: videoScale,
            ease: 'none',
            scrollTrigger: {
              id: SCENE_ID,
              trigger: scene,
              start: 'top top',
              end: () => `+=${getStageTravel()}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          })

          scheduleRefresh()

          return scheduleRefresh
        })
      },
    )

    return () => {
      disposed = true
      window.cancelAnimationFrame(refreshFrame)
      revertMedia?.()
    }
  }, [])

  return (
    <section
      ref={sceneRef}
      data-scroll-trigger-id={SCENE_ID}
      aria-labelledby="media-gallery-title-desktop"
      className="bg-background text-foreground relative hidden h-[380svh] w-full xl:block xl:motion-reduce:hidden"
    >
      <div
        ref={stageRef}
        className="pointer-events-none relative z-30 h-svh w-full overflow-hidden pt-[153px]"
      >
        <div className="mx-auto w-full max-w-[1680px]">
          <div
            ref={videoRef}
            className="relative mx-auto w-full will-change-transform"
          >
            <GalleryVideo src={content.video} />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20">
        <div ref={headingRef} className="absolute inset-x-0 top-[240svh]">
          <SectionHeading
            decor="media"
            title={content.title}
            titleId="media-gallery-title-desktop"
          />
        </div>

        {content.photos.map((photo) => (
          <div
            key={photo.src}
            className={clsx('absolute', photo.desktopClassName)}
          >
            <GalleryPhoto photo={photo} className="size-full" />
          </div>
        ))}
      </div>
    </section>
  )
}
