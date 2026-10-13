'use client'

import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

import { SectionHeading } from '@/components/ui/SectionHeading'

import { GalleryVideo } from './GalleryVideo'
import { GalleryPhoto, type MediaGalleryPhotoData } from './MediaGalleryVisuals'

const SCENE_ID = 'media-gallery-scene'
const DESKTOP_QUERY =
  '(min-width: 1280px) and (prefers-reduced-motion: no-preference)'
const SETTLED_PROGRESS = 0.12
const REVEAL_PROGRESS = 0.55
const VIDEO_SCALE = 0.48
const PHOTO_STAGGER = 0.08

type DesktopMediaGalleryProps = {
  content: {
    title: string
    video: string
    photos: readonly MediaGalleryPhotoData[]
  }
}

export function DesktopMediaGallery({ content }: DesktopMediaGalleryProps) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const photoRefs = useRef<Array<HTMLDivElement | null>>([])
  const playbackEnabledRef = useRef(false)
  const [playbackEnabled, setPlaybackEnabled] = useState(false)

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

          const headingGap = 80
          const photos = photoRefs.current.filter(
            (photo): photo is HTMLDivElement => photo !== null,
          )

          const getStageTravel = () =>
            Math.max(
              0,
              heading.offsetTop -
                parseFloat(window.getComputedStyle(stage).paddingTop) -
                video.offsetHeight * VIDEO_SCALE -
                headingGap,
            )

          gsap.set(video, {
            scale: 1,
            transformOrigin: '50% 0%',
          })

          gsap.set(photos, {
            autoAlpha: 0,
            scale: 0.94,
            y: 24,
            transformOrigin: '50% 50%',
          })

          const setPlaybackGate = (enabled: boolean) => {
            if (disposed || playbackEnabledRef.current === enabled) {
              return
            }

            playbackEnabledRef.current = enabled
            setPlaybackEnabled(enabled)
          }

          const timeline = gsap.timeline({
            scrollTrigger: {
              id: SCENE_ID,
              trigger: scene,
              pin: stage,
              pinSpacing: false,
              pinType: 'fixed',
              pinReparent: true,
              start: 'top top',
              end: () => `+=${Math.max(1, getStageTravel())}`,
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                setPlaybackGate(self.progress >= SETTLED_PROGRESS)
              },
              onRefresh: (self) => {
                setPlaybackGate(self.progress >= SETTLED_PROGRESS)
              },
            },
          })

          timeline
            .addLabel('settled', SETTLED_PROGRESS)
            .addLabel('reveal', REVEAL_PROGRESS)
            .to(
              video,
              {
                scale: VIDEO_SCALE,
                duration: 1 - REVEAL_PROGRESS,
                ease: 'none',
              },
              'reveal',
            )
            .to(
              photos,
              {
                autoAlpha: 1,
                scale: 1,
                y: 0,
                // Keep the last photo inside the same scroll interval as
                // the video; stagger must not extend the timeline past 1.
                duration: Math.max(
                  0.01,
                  1 - REVEAL_PROGRESS - PHOTO_STAGGER * (photos.length - 1),
                ),
                ease: 'none',
                stagger: PHOTO_STAGGER,
              },
              'reveal',
            )

          scheduleRefresh()

          return () => {
            setPlaybackGate(false)
            scheduleRefresh()
          }
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
    <div
      ref={sceneRef}
      data-scroll-trigger-id={SCENE_ID}
      className="bg-background text-foreground relative hidden h-[300svh] w-full xl:block xl:motion-reduce:hidden"
    >
      <div
        ref={stageRef}
        className="stage-padding pointer-events-none relative z-30 h-svh w-full overflow-hidden"
      >
        <div className="mx-auto w-full max-w-[min(1680px,calc((100svh-var(--layout-stage-start)-var(--layout-stage-end))*16/7))]">
          <div ref={videoRef} className="relative mx-auto w-full">
            <GalleryVideo src={content.video} playbackGate={playbackEnabled} />
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

        {content.photos.map((photo, index) => (
          <div
            key={photo.src}
            ref={(element) => {
              photoRefs.current[index] = element
            }}
            className={clsx('absolute', photo.desktopClassName)}
          >
            <GalleryPhoto photo={photo} className="size-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
