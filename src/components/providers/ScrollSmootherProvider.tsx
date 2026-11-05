'use client'

import { usePathname } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'

const SMOOTHER_QUERY =
  '(min-width: 1280px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

type ScrollSmootherProviderProps = {
  outsideContent?: ReactNode
  children: ReactNode
}

type ScrollSmootherInstance = {
  kill: () => void
  offset: (target: Element, position: string) => number
  scrollTo: (target: number, smooth?: boolean) => void
}

type ScrollTarget = number | HTMLElement

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
  const previousPathnameRef = useRef(pathname)
  const smootherRef = useRef<ScrollSmootherInstance | null>(null)
  const scrollTo = useCallback((target: ScrollTarget, smooth = true) => {
    const smoother = smootherRef.current

    if (smoother && typeof target === 'number') {
      smoother.scrollTo(target, smooth)
      return
    }

    if (smoother && target instanceof HTMLElement) {
      const offset = smoother.offset(target, 'top top')
      const anchorOffset =
        Number.parseFloat(getComputedStyle(target).scrollMarginBlockStart) || 0

      smoother.scrollTo(Math.max(0, offset - anchorOffset), smooth)
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

  useEffect(() => {
    if (previousPathnameRef.current === pathname) {
      return
    }

    previousPathnameRef.current = pathname

    let disposed = false
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
  }, [pathname])

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
      {outsideContent}
      <div
        id="smooth-wrapper"
        className="min-h-screen [html.has-scroll-smoother_&]:overflow-hidden"
      >
        <div id="smooth-content" className="min-h-screen overflow-visible">
          {children}
        </div>
      </div>
    </SmoothScrollContext.Provider>
  )
}
