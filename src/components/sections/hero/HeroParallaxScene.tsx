'use client'

import Image from 'next/image'
import { useEffect, useRef, type ReactNode } from 'react'

const DOT_COLORS = [
  '#ff2d95',
  '#ff6b00',
  '#ffd600',
  '#00c2ff',
  '#2563ff',
  '#8b5cf6',
  '#00e0a4',
] as const

type Dot = {
  x: number
  y: number
  z: number
  radius: number
  alpha: number
  color: (typeof DOT_COLORS)[number]
  vx: number
  vy: number
  speedMultiplier: number
}

type HeroParallaxSceneProps = {
  children: ReactNode
}

function createDots(width: number, height: number): Dot[] {
  return Array.from({ length: 200 }, () => {
    const z = Math.random()

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      z,
      radius: 0.5 + z * 2,
      alpha: 0.5 + z * 0.5,
      color: DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)],
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      speedMultiplier: 0.3 + z * 0.7,
    }
  })
}

function toRgba(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16)
  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

export function HeroParallaxScene({ children }: HeroParallaxSceneProps) {
  const rootRef = useRef<HTMLElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const background = backgroundRef.current
    const canvas = canvasRef.current
    const players = root?.querySelector<HTMLElement>('[data-hero-players]')
    const context = canvas?.getContext('2d')

    if (!root || !background || !canvas || !players || !context) return

    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )
    const finePointerQuery = window.matchMedia(
      '(hover: hover) and (pointer: fine)',
    )

    let width = 0
    let height = 0
    let dots: Dot[] = []
    let targetX = 0
    let currentX = 0
    let pointerX = 0
    let pointerY = 0
    let pointerSpeedX = 0
    let pointerSpeedY = 0
    let frameId: number | null = null
    let isVisible = !document.hidden

    const resizeCanvas = () => {
      const rect = root.getBoundingClientRect()
      const nextWidth = Math.max(1, rect.width)
      const nextHeight = Math.max(1, rect.height)
      const previousWidth = width
      const previousHeight = height
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

      width = nextWidth
      height = nextHeight
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

      if (dots.length === 0) {
        dots = createDots(width, height)
      } else {
        const scaleX = previousWidth > 0 ? width / previousWidth : 1
        const scaleY = previousHeight > 0 ? height / previousHeight : 1

        for (const dot of dots) {
          dot.x *= scaleX
          dot.y *= scaleY
        }
      }

      pointerX = width / 2
      pointerY = height / 2
    }

    const drawDots = (animate: boolean) => {
      context.clearRect(0, 0, width, height)

      for (const dot of dots) {
        if (animate) {
          const deltaX = pointerX - dot.x
          const deltaY = pointerY - dot.y
          const distance = Math.hypot(deltaX, deltaY)

          if (distance < 150) {
            const influence = (1 - distance / 150) * dot.z

            dot.vx += pointerSpeedX * influence * 0.08
            dot.vy += pointerSpeedY * influence * 0.08
          }

          dot.vx += (Math.random() - 0.5) * 0.03
          dot.vy += (Math.random() - 0.5) * 0.03
          dot.vx *= 0.97
          dot.vy *= 0.97

          const speed = Math.hypot(dot.vx, dot.vy)

          if (speed > 3) {
            dot.vx = (dot.vx / speed) * 3
            dot.vy = (dot.vy / speed) * 3
          }

          dot.x += dot.vx * dot.speedMultiplier
          dot.y += dot.vy * dot.speedMultiplier

          if (dot.x < -50) dot.x = width + 50
          if (dot.x > width + 50) dot.x = -50
          if (dot.y < -50) dot.y = height + 50
          if (dot.y > height + 50) dot.y = -50
        }

        context.beginPath()
        context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        context.shadowBlur = dot.radius * 4
        context.shadowColor = dot.color
        context.fillStyle = toRgba(dot.color, dot.alpha)
        context.fill()
      }

      context.shadowBlur = 0
      context.shadowColor = 'transparent'
    }

    const render = () => {
      const shouldAnimate = !reducedMotionQuery.matches

      if (finePointerQuery.matches && shouldAnimate) {
        currentX += (targetX - currentX) * 0.08
      } else {
        currentX = 0
      }

      background.style.transform = `translate3d(${currentX * -10}px, 0, 0)`
      players.style.transform = `translate3d(${currentX * -30}px, 0, 0)`
      drawDots(shouldAnimate)
      pointerSpeedX *= 0.9
      pointerSpeedY *= 0.9

      if (isVisible && shouldAnimate) {
        frameId = window.requestAnimationFrame(render)
      } else {
        frameId = null
      }
    }

    const startRendering = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(render)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!finePointerQuery.matches || reducedMotionQuery.matches) return

      const rect = root.getBoundingClientRect()
      const nextPointerX = event.clientX - rect.left
      const nextPointerY = event.clientY - rect.top
      const normalizedX = Math.min(1, Math.max(0, nextPointerX / rect.width))

      targetX = normalizedX * 2 - 1
      pointerSpeedX = nextPointerX - pointerX
      pointerSpeedY = nextPointerY - pointerY
      pointerX = nextPointerX
      pointerY = nextPointerY
    }

    const handlePointerLeave = () => {
      targetX = 0
    }

    const handleVisibilityChange = () => {
      isVisible = !document.hidden

      if (isVisible) startRendering()
    }

    const handleMotionPreferenceChange = () => {
      targetX = 0

      if (reducedMotionQuery.matches) {
        if (frameId !== null) window.cancelAnimationFrame(frameId)
        frameId = null
        render()
      } else {
        startRendering()
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()

      if (reducedMotionQuery.matches) drawDots(false)
    })

    resizeCanvas()
    resizeObserver.observe(root)
    root.addEventListener('pointermove', handlePointerMove, { passive: true })
    root.addEventListener('pointerleave', handlePointerLeave)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    reducedMotionQuery.addEventListener('change', handleMotionPreferenceChange)
    startRendering()

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      root.removeEventListener('pointermove', handlePointerMove)
      root.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      reducedMotionQuery.removeEventListener(
        'change',
        handleMotionPreferenceChange,
      )
    }
  }, [])

  return (
    <section
      ref={rootRef}
      id="hero"
      aria-labelledby="hero-title"
      className="section-anchor relative isolate h-svh max-h-svh min-h-svh overflow-hidden lg:h-auto lg:max-h-none"
    >
      <div
        ref={backgroundRef}
        className="bg-olive absolute -inset-5 z-0 will-change-transform motion-reduce:transform-none"
        aria-hidden="true"
      >
        <Image
          src="/images/hero-background.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgb(0 0 0 / 50%) 39%, rgb(0 0 0 / 50%) 100%)',
        }}
        aria-hidden="true"
      />

      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-20 size-full blur-[2px]"
        aria-hidden="true"
      />

      {children}
    </section>
  )
}
