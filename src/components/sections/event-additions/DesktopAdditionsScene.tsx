'use client'

import clsx from 'clsx'
import Image from 'next/image'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'

import { useSmoothScroll } from '@/components/providers/ScrollSmootherProvider'
import { MediaCardCaption, MediaCardFrame } from '@/components/ui/MediaCard'
import { SectionHeading } from '@/components/ui/SectionHeading'

import { SectionSplatters } from '@/components/sections/SectionSplatters'
import { eventAdditions } from './additions.data'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const TITLE_ITEM_HEIGHT = 61
const TITLE_OFFSET = 45
const TITLE_VIEWPORT_HEIGHT = 151
const CAPTION_HEIGHT = 86

function subscribeToReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY)
  media.addEventListener('change', onStoreChange)

  return () => media.removeEventListener('change', onStoreChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function getServerReducedMotionSnapshot() {
  return false
}

function clampAdditionIndex(index: number) {
  return Math.max(0, Math.min(eventAdditions.length - 1, index))
}

function getTitleOpacity(activeIndex: number, titleIndex: number) {
  if (activeIndex === titleIndex) {
    return 1
  }

  return Math.abs(activeIndex - titleIndex) === 1 ? 0.6 : 0.2
}

export function DesktopAdditionsScene({ sceneId }: { sceneId: string }) {
  const smoothScrollTo = useSmoothScroll()
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  )
  const sceneRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<Array<HTMLImageElement | null>>([])
  const requestedIndexRef = useRef<number | null>(null)
  const scrollToIndexRef = useRef<((index: number) => void) | null>(null)

  const selectAddition = useCallback((index: number) => {
    const nextIndex = clampAdditionIndex(index)
    if (requestedIndexRef.current === nextIndex) return
    requestedIndexRef.current = nextIndex

    const image = imageRefs.current[nextIndex]
    if (!image) return

    // Start the reveal only with decoded pixels. A newer scroll selection
    // takes precedence if this image finishes loading after another step.
    void image.decode().then(
      () => {
        if (image.isConnected && requestedIndexRef.current === nextIndex) {
          setActiveIndex(nextIndex)
        }
      },
      () => {
        // Keep the current card visible if the requested image cannot load.
      },
    )
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    let disposed = false
    let revertScene: (() => void) | undefined

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (disposed || !sceneRef.current || !stageRef.current) return

        gsap.registerPlugin(ScrollTrigger)

        const context = gsap.context(() => {
          const updateFromProgress = ({ progress }: { progress: number }) => {
            selectAddition(
              clampAdditionIndex(Math.floor(progress * eventAdditions.length)),
            )
          }

          const trigger = ScrollTrigger.create({
            id: sceneId,
            trigger: sceneRef.current,
            pin: stageRef.current,
            pinType: 'fixed',
            pinReparent: true,
            start: 'top top',
            end: 'bottom bottom',
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: updateFromProgress,
            onRefresh: updateFromProgress,
          })

          updateFromProgress(trigger)
          scrollToIndexRef.current = (index) => {
            // Land inside the step, away from its boundary during smooth scrolling.
            const progress =
              (clampAdditionIndex(index) + 0.5) / eventAdditions.length
            smoothScrollTo(
              trigger.start + (trigger.end - trigger.start) * progress,
            )
          }
        }, sceneRef)

        revertScene = () => context.revert()
      },
    )

    return () => {
      disposed = true
      scrollToIndexRef.current = null
      revertScene?.()
    }
  }, [prefersReducedMotion, sceneId, selectAddition, smoothScrollTo])

  const goToAddition = useCallback(
    (index: number) => {
      const nextIndex = clampAdditionIndex(index)
      if (scrollToIndexRef.current) {
        scrollToIndexRef.current(nextIndex)
      } else {
        selectAddition(nextIndex)
      }
    },
    [selectAddition],
  )

  return (
    <div
      ref={sceneRef}
      className={clsx(
        'bg-background text-foreground relative hidden w-full xl:block',
        prefersReducedMotion
          ? 'min-h-svh'
          : 'h-[calc(100svh*var(--scene-screens))]',
      )}
    >
      <div
        ref={stageRef}
        className={`stage-padding relative isolate flex min-h-svh w-full flex-col`}
      >
        <SectionSplatters section="additions" />
        <div className="page-container flex min-h-0 flex-1 flex-col">
          <SectionHeading
            title="Что можно добавить к празднику"
            titleId="event-additions-title-desktop"
            description="Дополните игровую программу, чтобы праздник запомнился надолго"
            decor="additions"
          />

          <div className="mt-[50px] grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="flex max-h-[650px] min-h-[420px] items-center justify-center overflow-hidden rounded-[24px] bg-white px-5 md:min-h-[520px] md:px-8 xl:min-h-0">
              <div
                className="w-full overflow-hidden"
                style={{ height: `${TITLE_VIEWPORT_HEIGHT}px` }}
              >
                <div
                  className="flex flex-col transition-transform duration-300 ease-out motion-reduce:transition-none"
                  style={{
                    transform: `translate3d(0, ${TITLE_OFFSET - activeIndex * TITLE_ITEM_HEIGHT}px, 0)`,
                  }}
                >
                  {eventAdditions.map((addition, index) => {
                    const isActive = activeIndex === index

                    return (
                      <button
                        key={addition.title}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => goToAddition(index)}
                        className={clsx(
                          'focus-visible:outline-primary flex h-[61px] shrink-0 items-center justify-center text-center text-2xl leading-none tracking-[-0.04em] transition-[color,opacity] duration-300 ease-out focus-visible:outline-2 focus-visible:-outline-offset-2 motion-reduce:transition-none',
                          isActive ? 'text-ink' : 'text-muted',
                        )}
                        style={{ opacity: getTitleOpacity(activeIndex, index) }}
                      >
                        {addition.navLabel}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <MediaCardFrame className="max-h-[650px] min-h-[420px] md:min-h-[520px] xl:min-h-0">
              {eventAdditions.map((addition, index) => (
                <div
                  key={addition.image}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 transition-[clip-path] duration-300 ease-out motion-reduce:transition-none"
                  style={{
                    clipPath:
                      index <= activeIndex
                        ? 'inset(0% 0% 0% 0%)'
                        : 'inset(100% 0% 0% 0%)',
                  }}
                >
                  <Image
                    ref={(image) => {
                      imageRefs.current[index] = image
                    }}
                    src={addition.image}
                    alt=""
                    fill
                    loading="eager"
                    sizes="(min-width: 1280px) 592px, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
              <span className="bg-primary text-primary-foreground absolute top-2 left-2 z-10 rounded-full px-4 py-3 text-base leading-none">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <MediaCardCaption className="pointer-events-none h-[86px]">
                <div
                  className="flex flex-col transition-transform duration-300 ease-out motion-reduce:transition-none"
                  style={{
                    transform: `translate3d(0, ${-activeIndex * CAPTION_HEIGHT}px, 0)`,
                  }}
                >
                  {eventAdditions.map((addition, index) => (
                    <article
                      key={addition.title}
                      aria-hidden={index !== activeIndex}
                      className="flex h-[86px] shrink-0 flex-col justify-center px-4 py-3 md:px-6"
                    >
                      <p className="text-base leading-[1.2] font-medium">
                        {addition.title}
                      </p>
                      <p className="text-ink/60 mt-1 line-clamp-2 text-sm leading-[1.3]">
                        {addition.description}
                      </p>
                    </article>
                  ))}
                </div>
              </MediaCardCaption>
              <p className="sr-only" aria-live="polite" aria-atomic="true">
                {eventAdditions[activeIndex].title}.{' '}
                {eventAdditions[activeIndex].description}
              </p>
            </MediaCardFrame>
          </div>
        </div>
      </div>
    </div>
  )
}
