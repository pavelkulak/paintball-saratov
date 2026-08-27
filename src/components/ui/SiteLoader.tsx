'use client'

import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

import { Logo } from '@/components/icons/Logo'

type LoaderPhase = 'assets' | 'motion' | 'geometry' | 'ready'
type ScrollTriggerStatic =
  (typeof import('gsap/ScrollTrigger'))['ScrollTrigger']

const MIN_VISIBLE_TIME = 900
const MAX_PREPARE_TIME = 7000
const TRIGGER_WAIT_TIME = 4500
const SMOOTHER_QUERY =
  '(min-width: 1280px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

const phaseLabels: Record<LoaderPhase, string> = {
  assets: 'Загружаем экипировку',
  motion: 'Настраиваем движение',
  geometry: 'Проверяем площадку',
  ready: 'Всё готово',
}

const phases: LoaderPhase[] = ['assets', 'motion', 'geometry', 'ready']

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve())
  })
}

function waitForWindowLoad() {
  if (document.readyState === 'complete') {
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    window.addEventListener('load', () => resolve(), { once: true })
  })
}

function getVisibleTriggerIds() {
  return Array.from(
    document.querySelectorAll<HTMLElement>('[data-scroll-trigger-id]'),
  )
    .filter((element) => window.getComputedStyle(element).display !== 'none')
    .map((element) => element.dataset.scrollTriggerId)
    .filter((id): id is string => Boolean(id))
}

async function waitForCondition(
  condition: () => boolean,
  timeout: number,
  shouldStop: () => boolean,
) {
  const deadline = window.performance.now() + timeout

  while (!condition() && !shouldStop() && window.performance.now() < deadline) {
    await nextFrame()
  }
}

function refreshScrollTriggers(ScrollTrigger: ScrollTriggerStatic) {
  return new Promise<void>((resolve) => {
    let finished = false

    const finish = () => {
      if (finished) {
        return
      }

      finished = true
      window.clearTimeout(fallback)
      ScrollTrigger.removeEventListener('refresh', finish)
      resolve()
    }

    const fallback = window.setTimeout(finish, 700)
    ScrollTrigger.addEventListener('refresh', finish)
    ScrollTrigger.refresh(true)
  })
}

export function SiteLoader() {
  const loaderRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<LoaderPhase>('assets')
  const [isExiting, setIsExiting] = useState(false)
  const [isRendered, setIsRendered] = useState(true)

  useEffect(() => {
    const loader = loaderRef.current

    if (!loader) {
      return
    }

    let cancelled = false
    let readinessSettled = false
    const startedAt = window.performance.now()
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const body = document.body
    const root = document.documentElement
    const previousBodyOverflow = body.style.overflow
    const previousRootOverscroll = root.style.overscrollBehavior
    const previousBusy = body.getAttribute('aria-busy')
    const blockedElements = Array.from(body.children)
      .filter((element) => element !== loader)
      .map((element) => ({
        element: element as HTMLElement,
        inert: (element as HTMLElement).inert,
      }))
    let pageReleased = false

    const releasePage = () => {
      if (pageReleased) {
        return
      }

      pageReleased = true
      body.style.overflow = previousBodyOverflow
      root.style.overscrollBehavior = previousRootOverscroll

      if (previousBusy === null) {
        body.removeAttribute('aria-busy')
      } else {
        body.setAttribute('aria-busy', previousBusy)
      }

      blockedElements.forEach(({ element, inert }) => {
        element.inert = inert
      })
    }

    body.style.overflow = 'hidden'
    root.style.overscrollBehavior = 'none'
    body.setAttribute('aria-busy', 'true')
    blockedElements.forEach(({ element }) => {
      element.inert = true
    })

    const preparePage = async () => {
      setPhase('assets')

      await Promise.all([
        waitForWindowLoad(),
        'fonts' in document ? document.fonts.ready : Promise.resolve(),
      ])

      if (cancelled || readinessSettled) {
        return
      }

      setPhase('motion')

      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      if (cancelled || readinessSettled) {
        return
      }

      gsap.registerPlugin(ScrollTrigger)

      if (!prefersReducedMotion) {
        const triggerIds = getVisibleTriggerIds()
        const smootherExpected = window.matchMedia(SMOOTHER_QUERY).matches

        await waitForCondition(
          () =>
            triggerIds.every((id) => Boolean(ScrollTrigger.getById(id))) &&
            (!smootherExpected ||
              document.documentElement.classList.contains(
                'has-scroll-smoother',
              )),
          TRIGGER_WAIT_TIME,
          () => cancelled || readinessSettled,
        )
      }

      if (cancelled || readinessSettled) {
        return
      }

      await nextFrame()
      await nextFrame()

      if (cancelled || readinessSettled) {
        return
      }

      setPhase('geometry')
      await refreshScrollTriggers(ScrollTrigger)
    }

    void (async () => {
      try {
        await Promise.race([preparePage(), wait(MAX_PREPARE_TIME)])
      } catch {
        // A non-critical animation failure must never trap the visitor here.
      }

      readinessSettled = true

      if (cancelled) {
        return
      }

      const remainingMinimum =
        MIN_VISIBLE_TIME - (window.performance.now() - startedAt)

      if (remainingMinimum > 0) {
        await wait(remainingMinimum)
      }

      if (cancelled) {
        return
      }

      setPhase('ready')
      await wait(prefersReducedMotion ? 80 : 180)

      if (cancelled) {
        return
      }

      setIsExiting(true)
      await wait(prefersReducedMotion ? 100 : 720)

      if (!cancelled) {
        releasePage()
        setIsRendered(false)
      }
    })()

    return () => {
      cancelled = true
      releasePage()
    }
  }, [])

  if (!isRendered) {
    return null
  }

  const phaseIndex = phases.indexOf(phase)

  return (
    <div
      ref={loaderRef}
      data-site-loader
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Подготовка сайта"
      className={clsx(
        'bg-background text-foreground fixed inset-0 isolate z-[200] [animation:site-loader-failsafe_1ms_12s_forwards] touch-none overflow-hidden transition-[clip-path,opacity] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:duration-100',
        isExiting ? 'opacity-0' : 'opacity-100',
      )}
      style={{
        clipPath: isExiting
          ? 'circle(0% at 50% 50%)'
          : 'circle(150% at 50% 50%)',
      }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="border-primary/10 absolute top-1/2 left-1/2 size-[min(132vw,132svh)] -translate-x-1/2 -translate-y-1/2 rounded-full border" />
        <div className="border-primary/10 absolute top-1/2 left-1/2 size-[min(94vw,94svh)] -translate-x-1/2 -translate-y-1/2 rounded-full border" />
        <div className="border-primary/10 absolute top-1/2 left-1/2 size-[min(66vw,66svh)] -translate-x-1/2 -translate-y-1/2 rounded-full border" />
        <div className="bg-primary/10 absolute top-1/2 left-0 h-px w-full" />
        <div className="bg-primary/10 absolute top-0 left-1/2 h-full w-px" />
        <div className="from-primary/10 absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent" />
      </div>

      <div className="relative flex h-full min-h-0 flex-col items-center justify-center px-5 py-[max(24px,env(safe-area-inset-bottom))]">
        <div className="relative size-[min(58vw,44svh,360px)] shrink-0">
          <div
            aria-hidden="true"
            className="border-primary/20 absolute inset-0 animate-spin rounded-full border [animation-duration:4.8s] motion-reduce:animate-none"
          >
            <span className="bg-primary absolute top-1/2 -right-1.5 size-3 -translate-y-1/2 rounded-full shadow-[0_0_24px_rgba(218,242,0,0.9)]" />
            <span className="bg-primary/50 absolute top-1/2 -left-1 size-2 -translate-y-1/2 rounded-full" />
          </div>

          <div
            aria-hidden="true"
            className="border-primary/40 absolute inset-[9%] animate-spin rounded-full border border-dashed [animation-direction:reverse] [animation-duration:7s] motion-reduce:animate-none"
          />

          <div
            aria-hidden="true"
            className="border-primary/25 absolute inset-[21%] animate-pulse rounded-full border motion-reduce:animate-none"
          />

          <div className="bg-primary text-primary-foreground shadow-primary/30 absolute inset-[31%] flex items-center justify-center rounded-full shadow-[0_0_70px]">
            <Logo className="h-auto w-[58%]" />
          </div>

          <span
            aria-hidden="true"
            className="bg-primary absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          />
        </div>

        <div className="mt-7 flex w-full max-w-[360px] flex-col items-center text-center md:mt-9">
          <p className="font-display text-primary text-[clamp(28px,7vw,42px)] leading-none tracking-[0.05em] uppercase">
            Подготовка к игре
          </p>
          <p className="mt-3 min-h-5 text-sm leading-5 text-white/60 md:text-base">
            {phaseLabels[phase]}
          </p>

          <div
            aria-hidden="true"
            className="mt-5 grid w-full grid-cols-4 gap-2"
          >
            {phases.map((item, index) => (
              <span
                key={item}
                className={clsx(
                  'h-1 rounded-full transition-colors duration-300',
                  index <= phaseIndex ? 'bg-primary' : 'bg-white/15',
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="absolute right-4 bottom-[max(16px,env(safe-area-inset-bottom))] hidden text-[10px] tracking-[0.18em] text-white/35 uppercase sm:block md:right-8"
      >
        Paintball / Domodedovo
      </span>
    </div>
  )
}
