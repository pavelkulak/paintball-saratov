'use client'

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
  children: ReactNode
}

type ScrollSmootherInstance = {
  kill: () => void
  scrollTo: (target: number, smooth?: boolean) => void
}

const SmoothScrollContext = createContext<
  (target: number, smooth?: boolean) => void
>((target, smooth = true) => {
  window.scrollTo({ top: target, behavior: smooth ? 'smooth' : 'auto' })
})

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}

export function ScrollSmootherProvider({
  children,
}: ScrollSmootherProviderProps) {
  const smootherRef = useRef<ScrollSmootherInstance | null>(null)
  const scrollTo = useCallback((target: number, smooth = true) => {
    if (smootherRef.current) {
      smootherRef.current.scrollTo(target, smooth)
      return
    }

    window.scrollTo({ top: target, behavior: smooth ? 'smooth' : 'auto' })
  }, [])

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
      <div id="smooth-wrapper">
        <div id="smooth-content">{children}</div>
      </div>
    </SmoothScrollContext.Provider>
  )
}
