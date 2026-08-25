'use client'

import clsx from 'clsx'
import Image from 'next/image'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from 'react'

import { useSmoothScroll } from '@/components/providers/ScrollSmootherProvider'
import { MediaCardCaption, MediaCardFrame } from '@/components/ui/MediaCard'
import { SectionHeading } from '@/components/ui/SectionHeading'

import { planets } from './formats.data'

const SCENE_ID = 'planet-scene'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const TITLE_ITEM_HEIGHT = 61
const TITLE_OFFSET = 45
const TITLE_VIEWPORT_HEIGHT = 151
const CARD_HEIGHT = 86
const TRANSITION_DURATION = 1.1
const FULL_CLIP = 'inset(0% 0% 0% 0%)'
const HIDDEN_CLIP = 'inset(100% 0% 0% 0%)'
const ACTIVE_TITLE_COLOR = '#02030d'
const INACTIVE_TITLE_COLOR = '#a6a6a6'

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

function clampPlanetIndex(index: number) {
  return Math.max(0, Math.min(planets.length - 1, index))
}

function getStepFromTimelineTime(time: number, slideCount: number) {
  const transitionTime = time - 1

  if (transitionTime <= 0) {
    return 0
  }

  return Math.min(slideCount, clampPlanetIndex(Math.ceil(transitionTime)))
}

function getTitleOpacity(activeIndex: number, titleIndex: number) {
  if (activeIndex === titleIndex) {
    return 1
  }

  return Math.abs(activeIndex - titleIndex) === 1 ? 0.6 : 0.2
}

export function DesktopPlanetScene() {
  const smoothScrollTo = useSmoothScroll()
  const [reducedIndex, setReducedIndex] = useState(0)
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  )
  const sceneRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const titleTrackRef = useRef<HTMLDivElement>(null)
  const cardTrackRef = useRef<HTMLDivElement>(null)
  const imageLayerRefs = useRef<Array<HTMLDivElement | null>>([])
  const cardLayerRefs = useRef<Array<HTMLElement | null>>([])
  const titleButtonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const numberRef = useRef<HTMLSpanElement>(null)
  const activeIndexRef = useRef(0)
  const scrollToIndexRef = useRef<((index: number) => void) | null>(null)

  const syncAccessibleState = useCallback((activeIndex: number) => {
    activeIndexRef.current = activeIndex

    titleButtonRefs.current.forEach((button, index) => {
      button?.setAttribute('aria-pressed', String(index === activeIndex))
    })

    cardLayerRefs.current.forEach((card, index) => {
      card?.setAttribute('aria-hidden', String(index !== activeIndex))
    })

    if (numberRef.current) {
      numberRef.current.textContent = String(activeIndex + 1).padStart(2, '0')
    }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      scrollToIndexRef.current = null
      syncAccessibleState(reducedIndex)
      return
    }

    let disposed = false
    let revertScene: (() => void) | undefined

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (disposed || !sceneRef.current || !stageRef.current) {
          return
        }

        gsap.registerPlugin(ScrollTrigger)

        const context = gsap.context(() => {
          const imageLayers = imageLayerRefs.current.filter(
            (layer): layer is HTMLDivElement => layer !== null,
          )
          const cardLayers = cardLayerRefs.current.filter(
            (layer): layer is HTMLElement => layer !== null,
          )
          const titleButtons = titleButtonRefs.current.filter(
            (button): button is HTMLButtonElement => button !== null,
          )
          const titleTrack = titleTrackRef.current
          const cardTrack = cardTrackRef.current
          const slideCount = planets.length - 1

          if (
            !titleTrack ||
            !cardTrack ||
            imageLayers.length !== planets.length ||
            cardLayers.length !== planets.length
          ) {
            return
          }

          const getCardOffset = (activeIndex: number) =>
            cardLayers[0].getBoundingClientRect().top -
            cardLayers[activeIndex].getBoundingClientRect().top

          const transitionToIndex = (activeIndex: number) => {
            gsap.to(titleTrack, {
              y: TITLE_OFFSET - activeIndex * TITLE_ITEM_HEIGHT,
              duration: TRANSITION_DURATION,
              ease: 'expo.out',
              overwrite: 'auto',
            })
            gsap.to(cardTrack, {
              y: getCardOffset(activeIndex),
              duration: TRANSITION_DURATION,
              ease: 'expo.out',
              overwrite: 'auto',
            })

            titleButtons.forEach((button, titleIndex) => {
              gsap.to(button, {
                color:
                  titleIndex === activeIndex
                    ? ACTIVE_TITLE_COLOR
                    : INACTIVE_TITLE_COLOR,
                opacity: getTitleOpacity(activeIndex, titleIndex),
                duration: TRANSITION_DURATION,
                ease: 'expo.out',
                overwrite: 'auto',
              })
            })
          }

          const setActiveIndex = (nextIndex: number, animate = true) => {
            const activeIndex = clampPlanetIndex(nextIndex)

            if (activeIndex === activeIndexRef.current) {
              syncAccessibleState(activeIndex)
              return
            }

            activeIndexRef.current = activeIndex
            syncAccessibleState(activeIndex)

            if (animate) {
              transitionToIndex(activeIndex)
              return
            }

            gsap.set(titleTrack, {
              y: TITLE_OFFSET - activeIndex * TITLE_ITEM_HEIGHT,
            })
            gsap.set(cardTrack, { y: getCardOffset(activeIndex) })
          }

          gsap.set(imageLayers, { clipPath: HIDDEN_CLIP })
          gsap.set(imageLayers[0], { clipPath: FULL_CLIP })
          gsap.set(titleTrack, { y: TITLE_OFFSET })
          gsap.set(cardTrack, { y: 0 })

          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              id: SCENE_ID,
              trigger: sceneRef.current,
              pin: stageRef.current,
              pinType: 'fixed',
              pinReparent: true,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: () =>
                setActiveIndex(
                  getStepFromTimelineTime(timeline.time(), slideCount),
                  false,
                ),
            },
          })

          timeline.eventCallback('onUpdate', () => {
            setActiveIndex(getStepFromTimelineTime(timeline.time(), slideCount))
          })

          imageLayers.slice(1).forEach((layer, index) => {
            timeline.fromTo(
              layer,
              { clipPath: HIDDEN_CLIP },
              {
                clipPath: FULL_CLIP,
                duration: 1,
                immediateRender: false,
              },
              index + 1,
            )
          })

          syncAccessibleState(0)

          scrollToIndexRef.current = (index) => {
            const trigger = ScrollTrigger.getById(SCENE_ID)

            if (!trigger) {
              const sceneTop =
                window.scrollY +
                (sceneRef.current?.getBoundingClientRect().top ?? 0)
              smoothScrollTo(sceneTop + index * window.innerHeight)
              return
            }

            const progress = index / (slideCount + 1)
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
  }, [prefersReducedMotion, reducedIndex, smoothScrollTo, syncAccessibleState])

  const goToPlanet = useCallback(
    (index: number) => {
      const nextIndex = clampPlanetIndex(index)

      if (prefersReducedMotion) {
        setReducedIndex(nextIndex)
        syncAccessibleState(nextIndex)
        return
      }

      if (scrollToIndexRef.current) {
        scrollToIndexRef.current(nextIndex)
        return
      }

      if (sceneRef.current) {
        const sceneTop =
          window.scrollY + sceneRef.current.getBoundingClientRect().top
        window.scrollTo({
          top: sceneTop + nextIndex * window.innerHeight,
          behavior: 'smooth',
        })
      }
    },
    [prefersReducedMotion, syncAccessibleState],
  )

  const initialIndex = prefersReducedMotion ? reducedIndex : 0
  const initialTitleTrackOffset =
    TITLE_OFFSET - initialIndex * TITLE_ITEM_HEIGHT
  const initialCardTrackOffset = -initialIndex * CARD_HEIGHT

  return (
    <section
      ref={sceneRef}
      data-scroll-trigger-id={SCENE_ID}
      style={{ '--scene-slides': planets.length + 1 } as CSSProperties}
      className={clsx(
        'bg-background text-foreground relative hidden w-full xl:block',
        prefersReducedMotion
          ? 'min-h-svh'
          : 'h-[calc(100svh*var(--scene-slides))]',
      )}
    >
      <div
        ref={stageRef}
        className="flex min-h-svh w-full flex-col px-4 pt-[148px] pb-[55px] md:px-8 xl:px-0 xl:pt-[153px] xl:pb-[60px]"
      >
        <div className="max-w-content mx-auto flex min-h-0 w-full flex-1 flex-col">
          <SectionHeading
            title="Что можно добавить к празднику"
            description="Дополните игровую программу, чтобы праздник запомнился надолго"
            decor="additions"
          />

          <div className="mt-[50px] grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-[24px] bg-white px-5 md:min-h-[520px] md:px-8 xl:min-h-0">
              <div
                className="w-full overflow-hidden"
                style={{ height: `${TITLE_VIEWPORT_HEIGHT}px` }}
              >
                <div
                  ref={titleTrackRef}
                  className="flex flex-col"
                  style={{
                    transform: `translate3d(0, ${initialTitleTrackOffset}px, 0)`,
                  }}
                >
                  {planets.map((planet, index) => {
                    const isActive = initialIndex === index
                    const isNearActive = Math.abs(initialIndex - index) === 1

                    return (
                      <button
                        key={planet.title}
                        ref={(element) => {
                          titleButtonRefs.current[index] = element
                        }}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => goToPlanet(index)}
                        className={clsx(
                          'flex h-[61px] shrink-0 items-center justify-center text-center text-2xl leading-none tracking-[-0.04em]',
                          isActive && 'text-ink opacity-100',
                          !isActive &&
                            isNearActive &&
                            'text-[#a6a6a6] opacity-60',
                          !isActive &&
                            !isNearActive &&
                            'text-[#a6a6a6] opacity-20',
                        )}
                      >
                        {planet.navLabel}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <MediaCardFrame className="min-h-[420px] md:min-h-[520px] xl:min-h-0">
              {planets.map((planet, index) => (
                <div
                  key={planet.image}
                  ref={(element) => {
                    imageLayerRefs.current[index] = element
                  }}
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    clipPath: prefersReducedMotion
                      ? index === reducedIndex
                        ? FULL_CLIP
                        : HIDDEN_CLIP
                      : index === 0
                        ? FULL_CLIP
                        : HIDDEN_CLIP,
                  }}
                >
                  <Image
                    src={planet.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 592px, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}

              <span
                ref={numberRef}
                className="bg-primary text-primary-foreground absolute top-2 left-2 z-10 rounded-full px-4 py-3 text-base leading-none"
              >
                {String(initialIndex + 1).padStart(2, '0')}
              </span>

              <MediaCardCaption
                aria-live="polite"
                className="pointer-events-none h-[86px]"
              >
                <div
                  ref={cardTrackRef}
                  className="flex flex-col"
                  style={{
                    transform: `translate3d(0, ${initialCardTrackOffset}px, 0)`,
                  }}
                >
                  {planets.map((planet, index) => (
                    <article
                      key={planet.title}
                      ref={(element) => {
                        cardLayerRefs.current[index] = element
                      }}
                      aria-hidden={index !== initialIndex}
                      className="flex h-[86px] shrink-0 flex-col justify-center px-4 py-3 md:px-6"
                    >
                      <p className="text-base leading-[1.2] font-medium">
                        {planet.title}
                      </p>
                      <p className="text-ink/60 mt-1 line-clamp-2 text-sm leading-[1.3]">
                        {planet.description}
                      </p>
                    </article>
                  ))}
                </div>
              </MediaCardCaption>
            </MediaCardFrame>
          </div>
        </div>
      </div>
    </section>
  )
}
