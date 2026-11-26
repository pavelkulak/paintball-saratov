'use client'

import { useEffect, useRef, type RefObject } from 'react'

import styles from './hero-crosshair.module.css'

const DESKTOP_POINTER_QUERY =
  '(min-width: 1280px) and (hover: hover) and (pointer: fine)'
const INTERACTIVE_SELECTOR =
  'a[href], button, input, textarea, select, summary, [role="button"], [role="link"], [contenteditable]:not([contenteditable="false"]), [data-hero-crosshair-ignore]'

export function HeroCrosshair({
  targetRef,
}: {
  targetRef: RefObject<HTMLElement | null>
}) {
  const guidesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = targetRef.current
    const guides = guidesRef.current
    if (!target || !guides) return

    const media = window.matchMedia(DESKTOP_POINTER_QUERY)

    const activate = () => {
      let frame = 0
      let x = 0
      let y = 0

      const hide = () => {
        window.cancelAnimationFrame(frame)
        frame = 0
        guides.removeAttribute('data-visible')
      }

      const render = () => {
        frame = 0
        guides.style.setProperty('--hero-crosshair-x', `${x}px`)
        guides.style.setProperty('--hero-crosshair-y', `${y}px`)
        guides.setAttribute('data-visible', '')
      }

      const move = (event: PointerEvent) => {
        if (
          event.pointerType !== 'mouse' ||
          !(event.target instanceof Element) ||
          event.target.closest(INTERACTIVE_SELECTOR)
        ) {
          hide()
          return
        }

        const bounds = target.getBoundingClientRect()
        x = event.clientX - bounds.left
        y = event.clientY - bounds.top
        if (x < 0 || y < 0 || x >= bounds.width || y >= bounds.height) {
          hide()
          return
        }

        if (!frame) frame = window.requestAnimationFrame(render)
      }

      target.classList.add(styles.host)
      target.addEventListener('pointermove', move, { passive: true })
      target.addEventListener('pointerover', move, { passive: true })
      target.addEventListener('pointerleave', hide)
      target.addEventListener('pointercancel', hide)
      window.addEventListener('blur', hide)
      window.addEventListener('scroll', hide, { passive: true, capture: true })
      window.addEventListener('resize', hide)
      document.addEventListener('visibilitychange', hide)

      return () => {
        hide()
        target.classList.remove(styles.host)
        target.removeEventListener('pointermove', move)
        target.removeEventListener('pointerover', move)
        target.removeEventListener('pointerleave', hide)
        target.removeEventListener('pointercancel', hide)
        window.removeEventListener('blur', hide)
        window.removeEventListener('scroll', hide, true)
        window.removeEventListener('resize', hide)
        document.removeEventListener('visibilitychange', hide)
        guides.style.removeProperty('--hero-crosshair-x')
        guides.style.removeProperty('--hero-crosshair-y')
      }
    }

    let deactivate: (() => void) | undefined
    const sync = () => {
      deactivate?.()
      deactivate = media.matches ? activate() : undefined
    }

    sync()
    media.addEventListener('change', sync)

    return () => {
      media.removeEventListener('change', sync)
      deactivate?.()
    }
  }, [targetRef])

  return (
    <div
      ref={guidesRef}
      data-hero-crosshair
      aria-hidden="true"
      className={styles.guides}
    >
      <span className={styles.horizontal} />
      <span className={styles.vertical} />
    </div>
  )
}
