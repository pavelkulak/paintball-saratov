'use client'

import Image from 'next/image'
import { useEffect, useRef, type CSSProperties } from 'react'

import { SectionHeading } from '@/components/ui/SectionHeading'

const processSteps = [
  {
    title: 'Оставляете заявку',
    description: 'Через форму на сайте, по телефону или в мессенджере',
    image: '/images/process/process-01.png',
  },
  {
    title: 'Уточняем формат',
    description: 'Состав группы, повод и пожелания занимает 5–10 минут',
    image: '/images/process/process-02.png',
  },
  {
    title: 'Подбираем сценарий',
    description: 'Предлагаем программу и пакет под ваш запрос и бюджет',
    image: '/images/process/process-03.png',
  },
  {
    title: 'Встречаем гостей',
    description: 'Проводим инструктаж и знакомим с площадкой',
    image: '/images/process/process-04.png',
  },
  {
    title: 'Игра с сопровождением',
    description: 'Инструктор ведёт игру — вам не нужно ничего контролировать',
    image: '/images/process/process-05.png',
  },
  {
    title: 'Отдых и продолжение',
    description: 'Зона отдыха, питание, активности по вашему желанию',
    image: '/images/process/process-06.png',
  },
] as const

// GiftPlay uses twelve positions around the full circle in 30-degree steps.
// Repeating our six steps keeps the orbit populated during the half-turn.
const orbitAngles = [
  0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330,
] as const

const PROCESS_MEDIA_CONDITIONS = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1279px)',
  desktop: '(min-width: 1280px)',
  reduceMotion: '(prefers-reduced-motion: reduce)',
} as const

const PROCESS_SCROLL_DISTANCE = 700
const PROCESS_CARD_BOTTOM_GAP = 16
const PROCESS_TOUCH_SCRUB = 0.6
const PROCESS_POINTER_SCRUB = 2

type PinOffsetElements = {
  orbit: HTMLOListElement
  orbitAnchor: HTMLDivElement
  orbitViewport: HTMLDivElement
  viewportHeight: HTMLSpanElement
}

function calculateMobilePinOffset({
  orbit,
  orbitAnchor,
  orbitViewport,
  viewportHeight,
}: PinOffsetElements) {
  if (!window.matchMedia(PROCESS_MEDIA_CONDITIONS.mobile).matches) {
    return 0
  }

  // The orbit starts at 30deg, so its final 330deg card is upright at the top.
  // Measuring that card keeps this calculation independent of transformed bounds.
  const initialCard = orbit.lastElementChild as HTMLElement | null

  if (!initialCard) {
    return 0
  }

  const cardBottom =
    orbitViewport.offsetTop +
    orbitAnchor.offsetTop +
    initialCard.offsetHeight / 2

  return Math.max(
    0,
    Math.ceil(
      cardBottom + PROCESS_CARD_BOTTOM_GAP - viewportHeight.offsetHeight,
    ),
  )
}

function StepDots({ count }: { count: number }) {
  return (
    <span
      aria-hidden="true"
      className="grid grid-cols-2 place-items-center gap-1"
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={`bg-primary-foreground size-1 rounded-full md:size-2 xl:size-3 ${
            count % 2 === 1 && index === count - 1
              ? 'col-span-2 justify-self-center'
              : ''
          }`}
        />
      ))}
    </span>
  )
}

function ProcessCard({
  step,
  index,
  className = '',
  style,
}: {
  step: (typeof processSteps)[number]
  index: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <li className={className} style={style}>
      <article className="text-ink relative size-full overflow-hidden rounded-[24px] bg-white">
        <Image
          src={step.image}
          alt=""
          fill
          sizes="(min-width: 1921px) 520px, (min-width: 1280px) 390px, (min-width: 768px) 374px, calc(100vw - 32px)"
          className="object-cover"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />

        <div className="absolute top-1 right-1 left-1 z-10 flex min-h-[98px] items-center gap-4 rounded-[20px] bg-white p-4 md:top-1.5 md:right-1.5 md:left-1.5 md:rounded-[18px] md:p-2.5 xl:top-2 xl:right-2 xl:left-2 xl:rounded-[16px] xl:p-1">
          <div className="bg-primary flex size-9 shrink-0 items-center justify-center rounded-[14px] md:size-16 xl:size-[90px]">
            <StepDots count={index + 1} />
          </div>

          <div className="flex min-w-0 flex-col gap-2 pr-3">
            <h3 className="text-xl leading-[1.2] font-semibold">
              {step.title}
            </h3>
            <p className="text-muted text-sm leading-[1.2]">
              {step.description}
            </p>
          </div>
        </div>
      </article>
    </li>
  )
}

export function EventProcessOrbit() {
  const sceneRef = useRef<HTMLElement>(null)
  const pinViewportRef = useRef<HTMLDivElement>(null)
  const viewportHeightRef = useRef<HTMLSpanElement>(null)
  const orbitViewportRef = useRef<HTMLDivElement>(null)
  const orbitAnchorRef = useRef<HTMLDivElement>(null)
  const orbitRef = useRef<HTMLOListElement>(null)

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
        ScrollTrigger.config({ ignoreMobileResize: true })

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

        media.add(PROCESS_MEDIA_CONDITIONS, () => {
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            scene.style.removeProperty('--process-pin-offset')
            scheduleRefresh()
            return
          }

          const pinViewport = pinViewportRef.current
          const viewportHeight = viewportHeightRef.current
          const orbitViewport = orbitViewportRef.current
          const orbitAnchor = orbitAnchorRef.current
          const orbit = orbitRef.current

          if (
            !pinViewport ||
            !viewportHeight ||
            !orbitViewport ||
            !orbitAnchor ||
            !orbit
          ) {
            return
          }

          const usesFixedDesktopPin = window.matchMedia(
            PROCESS_MEDIA_CONDITIONS.desktop,
          ).matches

          // Hybrid devices keep the pointer timing; only touch-only scrolling
          // needs the longer catch-up used on phones and tablets.
          const scrub =
            ScrollTrigger.isTouch === 1
              ? PROCESS_TOUCH_SCRUB
              : PROCESS_POINTER_SCRUB
          let pinOffset = -1

          const syncPinOffset = () => {
            const nextPinOffset = calculateMobilePinOffset({
              orbit,
              orbitAnchor,
              orbitViewport,
              viewportHeight,
            })

            if (nextPinOffset === pinOffset) {
              return
            }

            pinOffset = nextPinOffset

            // Keep the extra layout height inside the clipped pin viewport. The
            // inner composition shifts upward without enlarging GSAP's spacer.
            scene.style.setProperty('--process-pin-offset', `${pinOffset}px`)
          }

          syncPinOffset()
          ScrollTrigger.addEventListener('refreshInit', syncPinOffset)

          gsap.fromTo(
            orbit,
            {
              rotation: 30,
              transformOrigin: '50% 50%',
            },
            {
              rotation: -150,
              transformOrigin: '50% 50%',
              ease: 'none',
              scrollTrigger: {
                id: 'event-process-orbit',
                trigger: scene,
                pin: pinViewport,
                // ScrollSmoother transforms its content on desktop. Reparenting
                // gives text one fixed coordinate system instead of two competing
                // transforms. Mobile stays nested inside its clipping viewport.
                ...(usesFixedDesktopPin
                  ? { pinType: 'fixed' as const, pinReparent: true }
                  : {}),
                start: 'top top',
                end: `+=${PROCESS_SCROLL_DISTANCE}`,
                scrub,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            },
          )

          scheduleRefresh()

          return () => {
            ScrollTrigger.removeEventListener('refreshInit', syncPinOffset)
            scene.style.removeProperty('--process-pin-offset')
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
      id="event-process"
      ref={sceneRef}
      data-scroll-trigger-id="event-process-orbit"
      aria-labelledby="event-process-title"
      className="section-anchor relative mt-[50px] min-h-[calc(100lvh+700px)] w-full motion-reduce:min-h-0 md:mt-[55px] xl:mt-32"
    >
      {/* The large viewport stays stable while mobile browser chrome retracts. */}
      <span
        ref={viewportHeightRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-x-0 top-0 h-lvh"
      />
      {/* Pin only the visible viewport; the inner layout absorbs the card offset. */}
      <div
        ref={pinViewportRef}
        className="bg-primary text-primary-foreground relative h-lvh w-full overflow-hidden motion-reduce:h-auto motion-reduce:min-h-0"
      >
        <div className="stage-padding-start relative flex h-[calc(100lvh+var(--process-pin-offset,0px))] min-h-[680px] w-full translate-y-[calc(var(--process-pin-offset,0px)*-1)] flex-col [--process-card-half-height:252px] [--process-card-width:clamp(280px,91.111vw,328px)] [--process-orbit-shift:-32px] [--process-radius:clamp(480px,147vw,668px)] motion-reduce:h-auto motion-reduce:min-h-0 motion-reduce:translate-y-0 md:[--process-card-width:clamp(344px,46vw,374px)] md:[--process-orbit-shift:50px] md:[--process-radius:clamp(580px,82vw,668px)] xl:[--process-card-width:390px] xl:[--process-orbit-shift:100px] xl:[--process-radius:clamp(593px,46.4vw,668px)] 2xl:[--process-card-half-height:calc(var(--process-card-height)/2)] 2xl:[--process-card-height:clamp(504px,26.25vw,672px)] 2xl:[--process-card-width:clamp(390px,20.3125vw,520px)] 2xl:[--process-orbit-shift:clamp(100px,5.2083vw,133px)] 2xl:[--process-radius:clamp(668px,34.7917vw,890px)]">
          <div className="page-container relative z-10 shrink-0">
            <SectionHeading
              title="Как проходит праздник"
              titleId="event-process-title"
              description="Шесть простых шагов от заявки до последней эмоции"
              decor="process"
            />
          </div>

          <ol className="sr-only motion-reduce:hidden">
            {processSteps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>

          <div
            ref={orbitViewportRef}
            className="relative mt-10 min-h-0 flex-1 motion-reduce:hidden md:mt-[45px] xl:mt-[50px]"
          >
            <div
              ref={orbitAnchorRef}
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 motion-reduce:hidden"
              style={{
                top: 'calc(var(--process-card-half-height) + var(--process-orbit-shift))',
              }}
            >
              <ol
                ref={orbitRef}
                aria-hidden="true"
                className="relative will-change-transform"
                style={{
                  width: 'calc(var(--process-radius) + var(--process-radius))',
                  height: 'calc(var(--process-radius) + var(--process-radius))',
                  transform: 'rotate(30deg)',
                  transformOrigin: '50% 50%',
                }}
              >
                {orbitAngles.map((angle, orbitIndex) => {
                  const stepIndex = (orbitIndex + 1) % processSteps.length
                  const step = processSteps[stepIndex]

                  return (
                    <ProcessCard
                      key={`${step.title}-${angle}`}
                      step={step}
                      index={stepIndex}
                      className="absolute top-1/2 left-1/2 h-[504px] 2xl:h-[var(--process-card-height)]"
                      style={{
                        width: 'var(--process-card-width)',
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(var(--process-radius) * -1))`,
                      }}
                    />
                  )
                })}
              </ol>
            </div>
          </div>
          <ol className="page-container hidden grid-cols-1 gap-4 py-[50px] motion-reduce:grid md:grid-cols-2 xl:grid-cols-3">
            {processSteps.map((step, index) => (
              <ProcessCard
                key={step.title}
                step={step}
                index={index}
                className="h-[504px] w-full 2xl:h-[var(--process-card-height)]"
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
