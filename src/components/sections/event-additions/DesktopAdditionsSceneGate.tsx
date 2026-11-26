'use client'

import dynamic from 'next/dynamic'
import { useSyncExternalStore, type CSSProperties } from 'react'

const DESKTOP_QUERY = '(min-width: 1280px)'
const SCENE_ID = 'event-additions-scene'

const DesktopAdditionsScene = dynamic(
  () =>
    import('./DesktopAdditionsScene').then(
      (module) => module.DesktopAdditionsScene,
    ),
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

export function DesktopAdditionsSceneGate({
  scrollScreens,
}: {
  scrollScreens: number
}) {
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    getDesktopSnapshot,
    getServerDesktopSnapshot,
  )

  return (
    <div
      data-scroll-trigger-id={SCENE_ID}
      style={{ '--scene-screens': scrollScreens } as CSSProperties}
      className="bg-background relative hidden min-h-[calc(100svh*var(--scene-screens))] w-full motion-reduce:min-h-svh xl:block"
    >
      {isDesktop && <DesktopAdditionsScene sceneId={SCENE_ID} />}
    </div>
  )
}
