'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { normalizePathname, type AudienceId } from '@/lib/audience'
import { prepareAudienceArtwork } from '@/lib/audience-artwork'
import {
  captureScrollScene,
  captureScrollSection,
  getRestoredSectionScroll,
  loadScrollTrigger,
  nextFrame,
  refreshScrollTriggers,
  restoreScrollScene,
  scrollScenesAreReady,
  waitForCondition,
  type ScrollScenePosition,
  type ScrollSectionPosition,
} from '@/lib/scroll-scenes'

const SMOOTHER_QUERY =
  '(min-width: 1280px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
const SCENE_READY_TIMEOUT = 3500
const NAVIGATION_TIMEOUT = 12000
const REVEAL_DURATION = 540

type ScrollSmootherProviderProps = {
  outsideContent?: ReactNode
  children: ReactNode
}

type ScrollSmootherInstance = {
  kill: () => void
  offset: (target: Element, position: string) => number
  scrollTop: () => number
  scrollTo: (target: number, smooth?: boolean) => void
}

type ScrollTarget = number | HTMLElement

type AudienceNavigation = {
  href: string
  audience: AudienceId
  timeout: number
  scene: ScrollScenePosition | null
  section: ScrollSectionPosition | null
  previousAudience: AudienceId
  startedAt: number
  revealing: boolean
}

const AudienceNavigationContext = createContext<{
  pendingHref: string | null
  artworkAudience: AudienceId | null
  navigate: (href: string, audience: AudienceId) => void
} | null>(null)

export function useAudienceNavigation() {
  return useContext(AudienceNavigationContext)
}

function getAnchorOffset(target: HTMLElement) {
  return Number.parseFloat(getComputedStyle(target).scrollMarginBlockStart) || 0
}

const SmoothScrollContext = createContext<
  (target: ScrollTarget, smooth?: boolean) => void
>((target, smooth = true) => {
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: smooth ? 'smooth' : 'auto' })
    return
  }

  target.scrollIntoView({
    behavior: smooth ? 'smooth' : 'auto',
    block: 'start',
  })
})

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}

export function ScrollSmootherProvider({
  children,
  outsideContent,
}: ScrollSmootherProviderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const previousPathnameRef = useRef(pathname)
  const smootherRef = useRef<ScrollSmootherInstance | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const navigationRef = useRef<AudienceNavigation | null>(null)
  const [pendingHref, setPendingHref] = useState<string | null>(null)
  const [artworkAudience, setArtworkAudience] = useState<AudienceId | null>(
    null,
  )
  const [isRevealing, setIsRevealing] = useState(false)
  const scrollTo = useCallback((target: ScrollTarget, smooth = true) => {
    const smoother = smootherRef.current

    if (smoother && typeof target === 'number') {
      smoother.scrollTo(target, smooth)
      return
    }

    if (smoother && target instanceof HTMLElement) {
      const offset = smoother.offset(target, 'top top')
      smoother.scrollTo(Math.max(0, offset - getAnchorOffset(target)), smooth)
      return
    }

    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: smooth ? 'smooth' : 'auto' })
      return
    }

    target.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'start',
    })
  }, [])

  const finishNavigation = useCallback((navigation: AudienceNavigation) => {
    if (navigationRef.current !== navigation || navigation.revealing) return
    navigation.revealing = true
    window.clearTimeout(navigation.timeout)
    const page = document.querySelector<HTMLElement>('[data-audience-page]')
    setArtworkAudience(
      (page?.dataset.audiencePage as AudienceId) ?? navigation.previousAudience,
    )
    setIsRevealing(true)
    navigation.timeout = window.setTimeout(
      () => {
        if (navigationRef.current !== navigation) return
        navigationRef.current = null
        setPendingHref(null)
        setArtworkAudience(null)
        setIsRevealing(false)
      },
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 0
        : REVEAL_DURATION,
    )
  }, [])

  const navigateToAudience = useCallback(
    (href: string, audience: AudienceId) => {
      if (navigationRef.current) return

      const content = contentRef.current
      const source = document.querySelector<HTMLElement>('[data-audience-page]')
      const previousAudience =
        (source?.dataset.audiencePage as AudienceId) ?? audience
      const navigation: AudienceNavigation = {
        href,
        audience,
        timeout: 0,
        scene: null,
        section: content && captureScrollSection(content),
        previousAudience,
        startedAt: performance.now(),
        revealing: false,
      }
      navigationRef.current = navigation
      navigation.timeout = window.setTimeout(
        () => finishNavigation(navigation),
        NAVIGATION_TIMEOUT,
      )
      setPendingHref(href)
      setArtworkAudience(previousAudience)
      setIsRevealing(false)

      void (async () => {
        if (source) {
          try {
            const ScrollTrigger = await loadScrollTrigger()
            navigation.scene = captureScrollScene(ScrollTrigger, source)
          } catch {
            // Navigation can still proceed if the optional animation module fails.
          }
        }

        if (navigationRef.current === navigation) {
          router.push(href, { scroll: false })
        }
      })()
    },
    [finishNavigation, router],
  )

  useEffect(() => {
    return () => {
      const navigation = navigationRef.current
      if (navigation) window.clearTimeout(navigation.timeout)
      navigationRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!pendingHref) return
    const preventScroll = (event: Event) => event.preventDefault()
    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })
    return () => {
      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
    }
  }, [pendingHref])

  useEffect(() => {
    if (previousPathnameRef.current === pathname) {
      return
    }

    previousPathnameRef.current = pathname

    let disposed = false
    const navigation = navigationRef.current
    if (
      navigation &&
      normalizePathname(pathname) === normalizePathname(navigation.href)
    ) {
      const shouldStop = () => disposed || navigationRef.current !== navigation
      const findPage = () =>
        document.querySelector<HTMLElement>(
          `[data-audience-page="${navigation.audience}"]`,
        )

      void (async () => {
        try {
          const ScrollTrigger = await loadScrollTrigger()
          await waitForCondition(
            () => {
              const page = findPage()
              return Boolean(page && scrollScenesAreReady(ScrollTrigger, page))
            },
            SCENE_READY_TIMEOUT,
            shouldStop,
          )

          await nextFrame()
          if (shouldStop()) return

          await refreshScrollTriggers(ScrollTrigger, false)
          if (shouldStop()) return

          const page = findPage()
          const restoredScene =
            page &&
            navigation.scene &&
            restoreScrollScene(ScrollTrigger, page, navigation.scene, (top) =>
              scrollTo(top, false),
            )

          const content = contentRef.current
          if (page && !restoredScene && content && navigation.section) {
            const top = getRestoredSectionScroll(
              content,
              navigation.section,
              smootherRef.current?.scrollTop() ?? window.scrollY,
            )
            if (top !== null) {
              scrollTo(top, false)
              ScrollTrigger.update()
            }
          }

          await nextFrame()
          if (page) {
            await prepareAudienceArtwork(
              page,
              navigation.audience,
              navigation.previousAudience,
            )
          }
          // Let the dimmer enter even when a cached route resolves immediately.
          await waitForCondition(
            () => performance.now() - navigation.startedAt >= 220,
            220,
            shouldStop,
          )
        } catch {
          // Release the interface even when an animation cannot initialize.
        } finally {
          if (!disposed) finishNavigation(navigation)
        }
      })()

      return () => {
        disposed = true
      }
    }

    if (navigation) queueMicrotask(() => finishNavigation(navigation))

    let firstFrame = 0
    let secondFrame = 0

    void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      if (disposed) {
        return
      }

      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          if (!disposed) {
            ScrollTrigger.refresh(true)
          }
        })
      })
    })

    return () => {
      disposed = true
      window.cancelAnimationFrame(firstFrame)
      window.cancelAnimationFrame(secondFrame)
    }
  }, [finishNavigation, pathname, scrollTo])

  useEffect(() => {
    const media = window.matchMedia(SMOOTHER_QUERY)
    let disposed = false
    let activationId = 0
    let refreshFrame = 0
    let destroySmoother: (() => void) | undefined
    let scheduleRefresh: (() => void) | undefined

    const deactivate = (refresh = true) => {
      destroySmoother?.()
      destroySmoother = undefined
      smootherRef.current = null
      document.documentElement.classList.remove('has-scroll-smoother')

      if (refresh) {
        scheduleRefresh?.()
      }
    }

    const syncSmoother = () => {
      const currentActivationId = ++activationId

      if (!media.matches) {
        deactivate()
        return
      }

      void Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/ScrollSmoother'),
      ]).then(([{ default: gsap }, { ScrollTrigger }, { ScrollSmoother }]) => {
        if (
          disposed ||
          currentActivationId !== activationId ||
          !media.matches
        ) {
          return
        }

        scheduleRefresh = () => {
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

        deactivate(false)
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
        document.documentElement.classList.add('has-scroll-smoother')

        const smoother = ScrollSmoother.create({
          wrapper: '#smooth-wrapper',
          content: '#smooth-content',
          smooth: 0.8,
          smoothTouch: false,
          effects: false,
        })
        smootherRef.current = smoother

        ScrollTrigger.refresh(true)

        destroySmoother = () => {
          if (smootherRef.current === smoother) {
            smootherRef.current = null
          }
          smoother.kill()
        }
      })
    }

    syncSmoother()
    media.addEventListener('change', syncSmoother)

    return () => {
      disposed = true
      activationId += 1
      media.removeEventListener('change', syncSmoother)
      scheduleRefresh = undefined
      deactivate(false)
      window.cancelAnimationFrame(refreshFrame)
    }
  }, [])

  return (
    <SmoothScrollContext.Provider value={scrollTo}>
      <AudienceNavigationContext.Provider
        value={{ pendingHref, artworkAudience, navigate: navigateToAudience }}
      >
        <div className="contents" inert={Boolean(pendingHref)}>
          {outsideContent}
        </div>
        <div
          id="smooth-wrapper"
          inert={Boolean(pendingHref)}
          className="min-h-screen [html.has-scroll-smoother_&]:overflow-hidden"
        >
          <div
            ref={contentRef}
            id="smooth-content"
            className="min-h-screen overflow-visible"
          >
            {children}
          </div>
        </div>
        <div
          aria-hidden={!pendingHref}
          role="status"
          data-audience-dimmer
          style={{
            opacity: pendingHref && !isRevealing ? 1 : 0,
            transitionDuration: isRevealing ? '420ms' : '220ms',
            pointerEvents: pendingHref ? 'auto' : 'none',
          }}
          className="fixed inset-0 z-[90] touch-none bg-black/45 transition-opacity ease-in-out motion-reduce:transition-none"
        >
          {pendingHref && (
            <span className="sr-only">Загружаем выбранную вкладку</span>
          )}
        </div>
      </AudienceNavigationContext.Provider>
    </SmoothScrollContext.Provider>
  )
}
