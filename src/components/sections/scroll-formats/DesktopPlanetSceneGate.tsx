'use client'

import dynamic from 'next/dynamic'
import { useSyncExternalStore, type CSSProperties } from 'react'

const DESKTOP_QUERY = '(min-width: 1280px)'

const DesktopPlanetScene = dynamic(
  () =>
    import('./DesktopPlanetScene').then((module) => module.DesktopPlanetScene),
  { ssr: false },
)

function subscribeToDesktop(onStoreChange: () => void) {
  const media = window.matchMedia(DESKTOP_QUERY)
  media.addEventListener('change', onStoreChange)

  return () => media.removeEventListener('change', onStoreChange)
}

function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches
}

function getServerDesktopSnapshot() {
  return false
}

export function DesktopPlanetSceneGate({ slideCount }: { slideCount: number }) {
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    getDesktopSnapshot,
    getServerDesktopSnapshot,
  )

  if (!isDesktop) {
    return (
      <div
        aria-hidden="true"
        style={{ '--scene-slides': slideCount } as CSSProperties}
        className="bg-background relative hidden h-[calc(100svh*var(--scene-slides))] w-full motion-reduce:h-svh xl:block"
      />
    )
  }

  return <DesktopPlanetScene />
}
