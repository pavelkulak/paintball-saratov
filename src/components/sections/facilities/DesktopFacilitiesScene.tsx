'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

import { SectionHeading } from '@/components/ui/SectionHeading'

import { facilities, facilitiesSectionContent } from './facilities.data'
import { FACILITY_CARD_HEIGHT, FacilityCard } from './FacilityCard'

const SCENE_ID = 'facilities-scene'
const DESKTOP_CARD_GAP = 16
const CARD_SCROLL_STEP = FACILITY_CARD_HEIGHT + DESKTOP_CARD_GAP
const DESKTOP_MOTION_QUERY =
  '(min-width: 1280px) and (prefers-reduced-motion: no-preference)'

export function DesktopFacilitiesScene() {
  const sceneRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)

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

        media.add(DESKTOP_MOTION_QUERY, () => {
          const stage = stageRef.current
          const viewport = viewportRef.current
          const track = trackRef.current

          if (!stage || !viewport || !track) {
            return
          }

          const getTravel = () =>
            Math.max(0, track.scrollHeight - viewport.clientHeight)

          gsap.set(track, { y: 0 })

          gsap.to(track, {
            y: () => -getTravel(),
            ease: 'none',
            scrollTrigger: {
              id: SCENE_ID,
              trigger: scene,
              pin: stage,
              pinType: 'fixed',
              pinReparent: true,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })

          scheduleRefresh()

          return () => {
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
    <section
      ref={sceneRef}
      data-scroll-trigger-id={SCENE_ID}
      aria-labelledby="facilities-title"
      style={
        {
          '--facilities-scroll-distance':
            String((facilities.length - 1) * CARD_SCROLL_STEP) + 'px',
        } as CSSProperties
      }
      className="bg-background text-foreground relative hidden h-[calc(100svh+var(--facilities-scroll-distance))] w-full motion-reduce:h-auto xl:block"
    >
      <div
        ref={stageRef}
        className="bg-background text-foreground flex h-svh w-full px-4 pt-[153px] pb-[60px] motion-reduce:h-auto motion-reduce:min-h-svh md:px-8 xl:px-0"
      >
        <div className="max-w-content mx-auto grid min-h-0 w-full grid-cols-[525px_592px] justify-between gap-16">
          <div className="self-start">
            <SectionHeading
              align="start"
              title={facilitiesSectionContent.title}
              titleId="facilities-title"
              description={facilitiesSectionContent.description}
              decor="infrastructure"
            />
          </div>

          <div
            ref={viewportRef}
            className="min-h-0 overflow-hidden motion-reduce:overflow-visible"
          >
            <ul
              ref={trackRef}
              aria-label="Удобства площадки"
              className="flex flex-col"
              style={{ gap: DESKTOP_CARD_GAP }}
            >
              {facilities.map((facility) => (
                <li
                  className="shrink-0"
                  key={facility.title}
                  style={{ height: FACILITY_CARD_HEIGHT }}
                >
                  <FacilityCard facility={facility} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
