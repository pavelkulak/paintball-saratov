'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

type GalleryVideoProps = {
  src: string
  poster: string
  className?: string
  playbackGate?: boolean
}

export function GalleryVideo({
  src,
  poster,
  className,
  playbackGate = true,
}: GalleryVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playbackGateRef = useRef(playbackGate)
  const isVisibleRef = useRef(false)
  const reducedMotionRef = useRef(false)
  const documentVisibleRef = useRef(true)
  const sourceLoadedRef = useRef(false)
  const [shouldLoad, setShouldLoad] = useState(false)

  const syncPlayback = useCallback(() => {
    const video = videoRef.current

    if (!video) {
      return
    }

    const shouldPlay =
      playbackGateRef.current &&
      sourceLoadedRef.current &&
      isVisibleRef.current &&
      !reducedMotionRef.current &&
      documentVisibleRef.current

    if (!shouldPlay) {
      video.pause()
      return
    }

    void video.play().catch(() => {
      // Autoplay can still be rejected by a browser policy. The video remains
      // paused and will retry when one of the playback conditions changes.
    })
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const video = videoRef.current

    if (!container || !video) {
      return
    }

    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    const syncReducedMotion = () => {
      reducedMotionRef.current = reducedMotionQuery.matches
      syncPlayback()
    }

    const syncDocumentVisibility = () => {
      documentVisibleRef.current = document.visibilityState === 'visible'
      syncPlayback()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = Boolean(
          entry?.isIntersecting && entry.intersectionRatio > 0,
        )
        syncPlayback()
      },
      { threshold: 0 },
    )

    const loadingObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true)
          loadingObserver.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )

    documentVisibleRef.current = document.visibilityState === 'visible'
    observer.observe(container)
    loadingObserver.observe(container)
    syncReducedMotion()
    document.addEventListener('visibilitychange', syncDocumentVisibility)
    reducedMotionQuery.addEventListener('change', syncReducedMotion)

    return () => {
      observer.disconnect()
      loadingObserver.disconnect()
      document.removeEventListener('visibilitychange', syncDocumentVisibility)
      reducedMotionQuery.removeEventListener('change', syncReducedMotion)
    }
  }, [syncPlayback])

  useEffect(() => {
    const video = videoRef.current
    if (!shouldLoad || !video) return

    sourceLoadedRef.current = true
    video.load()
    syncPlayback()
  }, [shouldLoad, src, syncPlayback])

  useEffect(() => {
    playbackGateRef.current = playbackGate
    syncPlayback()
  }, [playbackGate, syncPlayback])

  return (
    <div
      ref={containerRef}
      className={twMerge(
        'relative aspect-[16/7] w-full overflow-hidden rounded-[24px]',
        className,
      )}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        loop
        muted
        playsInline
        preload={shouldLoad ? 'metadata' : 'none'}
        poster={poster}
        aria-hidden="true"
      >
        {shouldLoad ? <source src={src} type="video/mp4" /> : null}
      </video>
    </div>
  )
}
