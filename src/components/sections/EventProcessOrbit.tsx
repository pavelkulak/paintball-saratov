'use client'

import Image from 'next/image'
import { useEffect, useRef, type CSSProperties } from 'react'

import { SectionHeading } from '@/components/ui/SectionHeading'

const processSteps = [
  {
    title: 'Оставляете заявку',
    description: 'Через форму на сайте, по телефону или в мессенджере',
    image: '/images/process/updated/step-01.webp',
  },
  {
    title: 'Уточняем формат',
    description: 'Состав группы, повод и пожелания занимает 5–10 минут',
    image: '/images/process/updated/step-02.webp',
  },
  {
    title: 'Подбираем сценарий',
    description: 'Предлагаем программу и пакет под ваш запрос и бюджет',
    image: '/images/process/updated/step-03.webp',
  },
  {
    title: 'Встречаем гостей',
    description: 'Проводим инструктаж и знакомим с площадкой',
    image: '/images/process/updated/step-04.webp',
  },
  {
    title: 'Игра с сопровождением',
    description: 'Инструктор ведёт игру — вам не нужно ничего контролировать',
    image: '/images/process/updated/step-05.webp',
  },
  {
    title: 'Отдых и продолжение',
    description: 'Зона отдыха, питание, активности по вашему желанию',
    image: '/images/process/updated/step-06.webp',
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
const PROCESS_TOUCH_SCRUB = 0.6
const PROCESS_POINTER_SCRUB = 2

function getMobileOrbitLayout(
  width: number,
  height: number,
  expandedHeight: number,
  headerHeight: number,
  headingHeight: number,
  descriptionTop: number,
  radius: number,
) {
  const cardWidth = Math.round(Math.min(width * 0.89, height * 0.46, 380))
  const stageTop = headerHeight + Math.round(Math.min(30, height * 0.035))
  const topGap = Math.round(Math.max(16, cardWidth * 0.07))
  const bottomGap = Math.round(Math.max(24, cardWidth * 0.1))
  const spaceWithHeading =
    height - stageTop - headingHeight - topGap - bottomGap
  // Use the full screen height for this choice so the browser toolbar cannot flip it.
  const showDescriptionOnly =
    expandedHeight <= 700 ||
    spaceWithHeading + expandedHeight - height < cardWidth * 1.2

  // On short phones, align the description below the fixed header.
  const pinOffset = showDescriptionOnly
    ? Math.max(0, Math.round(stageTop + descriptionTop - headerHeight - 12))
    : 0
  const availableHeight = spaceWithHeading + pinOffset
  const cardHeight = Math.max(
    1,
    Math.round(
      Math.min(
        availableHeight,
        Math.max(cardWidth * 1.45, availableHeight - 24),
      ),
    ),
  )
  const cardGap =
    topGap + Math.max(0, Math.round((availableHeight - cardHeight) / 2))

  // The nearest card tilts up to half a step. Reserve its lowest corner.
  const tilt = Math.PI / orbitAngles.length
  const cosTilt = Math.cos(tilt)
  const orbitTop = stageTop + headingHeight - pinOffset + cardGap
  const maxTiltedHeight = Math.floor(
    (height -
      6 -
      orbitTop -
      radius * (1 - cosTilt) -
      (cardWidth / 2) * Math.sin(tilt)) /
      ((1 + cosTilt) / 2),
  )

  return {
    '--process-pin-offset': pinOffset,
    '--process-mobile-top': stageTop,
    '--process-mobile-card-width': cardWidth,
    '--process-mobile-card-height': Math.max(
      1,
      Math.min(cardHeight, maxTiltedHeight),
    ),
    '--process-mobile-card-gap': cardGap,
  }
}

function StepNumber({ value }: { value: number }) {
  return (
    <span
      aria-hidden="true"
      data-process-step-number
      className="font-display text-ink text-lg leading-none max-md:text-[clamp(16px,6cqw,22px)] md:text-[28px] xl:text-[40px]"
    >
      {value}
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
      <article className="text-ink relative size-full overflow-hidden rounded-[24px] bg-white max-md:[container-type:inline-size] max-md:rounded-[clamp(16px,5vw,24px)]">
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

        <div
          data-process-card-header
          className="absolute top-1 right-1 left-1 z-10 flex min-h-[98px] items-center gap-4 rounded-[20px] bg-white p-4 max-md:min-h-0 max-md:gap-[clamp(8px,3cqw,12px)] max-md:rounded-[clamp(12px,5cqw,18px)] max-md:p-[clamp(8px,3.5cqw,14px)] md:top-1.5 md:right-1.5 md:left-1.5 md:rounded-[18px] md:p-2.5 xl:top-2 xl:right-2 xl:left-2 xl:rounded-[16px] xl:p-1"
        >
          <div
            data-process-card-badge
            className="bg-primary flex size-9 shrink-0 items-center justify-center rounded-[14px] max-md:size-[clamp(26px,10cqw,36px)] max-md:rounded-[clamp(8px,3.3cqw,12px)] md:size-16 xl:size-[90px]"
          >
            <StepNumber value={index + 1} />
          </div>

          <div className="flex min-w-0 flex-col gap-2 pr-3 max-md:gap-1 max-md:pr-0">
            <h3
              data-process-card-title
              className="text-xl leading-[1.2] font-semibold max-md:text-[clamp(15px,5.4cqw,21px)]"
            >
              {step.title}
            </h3>
            <p
              data-process-card-description
              className="text-muted max-md:text-ink/65 text-sm leading-[1.2] max-md:text-[clamp(12px,4.1cqw,15px)]"
            >
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
  const headingRef = useRef<HTMLDivElement>(null)
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
          const heading = headingRef.current
          const orbit = orbitRef.current

          if (!pinViewport || !viewportHeight || !heading || !orbit) {
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
          let cleanupMobileLayout: (() => void) | undefined
          if (window.matchMedia(PROCESS_MEDIA_CONDITIONS.mobile).matches) {
            const siteHeader =
              document.querySelector<HTMLElement>('body > header')
            const description = heading.querySelector('p')
            let layoutProperties: string[] = []
            const syncMobileLayout = () => {
              const bounds = heading.getBoundingClientRect()
              const layout = getMobileOrbitLayout(
                viewportHeight.clientWidth,
                viewportHeight.clientHeight,
                pinViewport.clientHeight,
                siteHeader?.offsetHeight ?? 0,
                bounds.height,
                description
                  ? description.getBoundingClientRect().top - bounds.top
                  : 0,
                orbit.offsetWidth / 2,
              )

              layoutProperties = Object.keys(layout)
              for (const [property, value] of Object.entries(layout)) {
                const cssValue = `${value}px`
                if (scene.style.getPropertyValue(property) !== cssValue) {
                  scene.style.setProperty(property, cssValue)
                }
              }
            }

            syncMobileLayout()
            const observer = new ResizeObserver(syncMobileLayout)
            observer.observe(viewportHeight)
            observer.observe(heading)
            if (siteHeader) observer.observe(siteHeader, { box: 'border-box' })
            ScrollTrigger.addEventListener('refreshInit', syncMobileLayout)

            cleanupMobileLayout = () => {
              observer.disconnect()
              ScrollTrigger.removeEventListener('refreshInit', syncMobileLayout)
              for (const property of layoutProperties)
                scene.style.removeProperty(property)
            }
          }

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

          return cleanupMobileLayout
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
      {/* Measure the visible area without changing the pin spacer as browser chrome moves. */}
      <span
        ref={viewportHeightRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-x-0 top-0 h-dvh md:hidden"
      />
      {/* Pin only the visible viewport; the inner layout absorbs the card offset. */}
      <div
        ref={pinViewportRef}
        className="bg-primary text-primary-foreground relative h-lvh w-full overflow-hidden motion-reduce:h-auto motion-reduce:min-h-0"
      >
        <div className="stage-padding-start relative flex h-[calc(100lvh+var(--process-pin-offset,0px))] min-h-[680px] w-full translate-y-[calc(var(--process-pin-offset,0px)*-1)] flex-col [--process-card-half-height:calc(var(--process-card-height)/2)] [--process-card-height:var(--process-card-max-height)] [--process-card-max-height:504px] [--process-card-width:clamp(280px,91.111vw,328px)] [--process-orbit-shift:-32px] [--process-radius:clamp(480px,147vw,668px)] motion-reduce:h-auto motion-reduce:min-h-0 motion-reduce:translate-y-0 max-md:[--process-card-max-height:var(--process-mobile-card-height,420px)] max-md:[--process-card-width:var(--process-mobile-card-width,85vw)] max-md:[--process-orbit-shift:0px] max-md:motion-safe:min-h-0 max-md:motion-safe:[padding-block-start:var(--process-mobile-top,var(--layout-stage-start))] md:min-h-0 md:[--process-card-width:clamp(344px,46vw,374px)] md:[--process-orbit-shift:50px] md:[--process-radius:clamp(580px,82vw,668px)] md:motion-safe:[padding-block-start:clamp(111px,_16lvh,_var(--layout-stage-start))]! md:motion-safe:[--process-badge-size:64px]! md:motion-safe:[--process-number-size:28px]! md:motion-safe:[--process-orbit-gap:clamp(20px,_calc(100lvh_-_865px),_45px)]! md:motion-safe:[--process-orbit-shift:clamp(0px,_calc(100lvh_-_800px),_50px)]! xl:[--process-card-width:390px] xl:[--process-orbit-shift:100px] xl:[--process-radius:clamp(593px,46.4vw,668px)] xl:motion-safe:[--process-badge-size:90px]! xl:motion-safe:[--process-number-size:40px]! xl:motion-safe:[--process-orbit-gap:clamp(20px,_calc(100lvh_-_865px),_50px)]! xl:motion-safe:[--process-orbit-shift:clamp(0px,_calc(100lvh_-_850px),_100px)]! 2xl:[--process-card-max-height:clamp(504px,26.25vw,672px)] 2xl:[--process-card-width:clamp(390px,20.3125vw,520px)] 2xl:[--process-orbit-shift:clamp(100px,5.2083vw,133px)] 2xl:[--process-radius:clamp(668px,34.7917vw,890px)] 2xl:motion-safe:[--process-orbit-shift:clamp(_0px,_calc(100lvh_-_850px),_clamp(100px,_5.2083vw,_133px)_)]! [@media(min-width:768px)_and_(max-height:700px)]:[--process-card-half-height:252px] [@media(min-width:768px)_and_(max-height:700px)]:[--process-card-max-height:420px]">
          <div
            ref={headingRef}
            className="page-container relative z-10 shrink-0"
          >
            <SectionHeading
              className="max-md:gap-2.5 max-md:[&_h2]:text-[clamp(28px,8.4vw,40px)] max-md:[&>img]:h-[clamp(20px,5.8vw,26px)]"
              descriptionClassName="max-md:text-[clamp(12px,3.5vw,14px)]"
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

          <div className="relative mt-10 min-h-0 flex-1 motion-reduce:hidden max-md:mt-[var(--process-mobile-card-gap,24px)] md:mt-[45px] md:motion-safe:[container-type:size]! md:motion-safe:mt-[var(--process-orbit-gap)]! xl:mt-[50px]">
            <div
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 motion-reduce:hidden md:motion-safe:[--process-badge-rendered-size:min(_var(--process-badge-size),_clamp(36px,_calc((var(--process-card-height)_-_216px)_*_5_/_16),_90px)_)]! md:motion-safe:[--process-card-half-height:calc(var(--process-card-height)_/_2)]! md:motion-safe:[--process-card-height:min(_var(--process-card-max-height),_calc((100cqh_-_var(--process-orbit-shift)_-_16px)_/_1.13)_)]! md:motion-safe:[--process-orbit-card-width:min(_var(--process-card-width),_calc(var(--process-card-height)_*_390_/_504)_)]! md:motion-safe:[--process-orbit-radius:min(_var(--process-radius),_calc(var(--process-card-height)_*_668_/_504)_)]! md:motion-safe:[&_[data-process-card-badge]]:h-[var(--process-badge-rendered-size)]! md:motion-safe:[&_[data-process-card-badge]]:w-[var(--process-badge-rendered-size)]! md:motion-safe:[&_[data-process-card-badge]]:rounded-[min(14px,_calc(var(--process-badge-rendered-size)_*_7_/_32))]! md:motion-safe:[&_[data-process-card-description]]:[font-size:clamp(12px,_calc(var(--process-card-height)_*_14_/_504),_14px)]! md:motion-safe:[&_[data-process-card-header]]:min-h-[clamp(64px,_calc(var(--process-card-height)_*_98_/_504),_98px)]! md:motion-safe:[&_[data-process-card-header]]:gap-[clamp(12px,_calc(var(--process-card-height)_*_16_/_504),_16px)]! md:motion-safe:[&_[data-process-card-title]]:[font-size:clamp(16px,_calc(var(--process-card-height)_*_20_/_504),_20px)]! md:motion-safe:[&_[data-process-step-number]]:[font-size:clamp(_20px,_calc(var(--process-badge-rendered-size)_*_40_/_90),_var(--process-number-size)_)]!"
              style={{
                top: 'calc(var(--process-card-half-height) + var(--process-orbit-shift))',
              }}
            >
              <ol
                ref={orbitRef}
                aria-hidden="true"
                className="relative will-change-transform"
                style={{
                  width:
                    'calc(var(--process-orbit-radius, var(--process-radius)) * 2)',
                  height:
                    'calc(var(--process-orbit-radius, var(--process-radius)) * 2)',
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
                      className="absolute top-1/2 left-1/2 h-[var(--process-card-height)]"
                      style={{
                        width:
                          'var(--process-orbit-card-width, var(--process-card-width))',
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(var(--process-orbit-radius, var(--process-radius)) * -1))`,
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
                className="h-[504px] w-full max-md:h-[clamp(340px,115vw,504px)] 2xl:h-[var(--process-card-height)]"
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
