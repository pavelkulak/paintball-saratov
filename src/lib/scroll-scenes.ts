type ScrollTriggerStatic =
  (typeof import('gsap/ScrollTrigger'))['ScrollTrigger']

export type ScrollScenePosition = {
  id: string
  progress: number
}

export type ScrollSectionPosition = {
  id: string
  offset: number
  viewportTop: number
}

export function captureScrollSection(
  root: HTMLElement,
): ScrollSectionPosition | null {
  const header = document.querySelector('[data-site-header]')
  const viewportTop = Math.max(0, header?.getBoundingClientRect().bottom ?? 0)

  for (const section of root.querySelectorAll<HTMLElement>(
    '.section-anchor[id]',
  )) {
    const bounds = section.getBoundingClientRect()
    if (bounds.height > 0 && bounds.bottom > viewportTop) {
      return { id: section.id, offset: viewportTop - bounds.top, viewportTop }
    }
  }

  return null
}

export function getRestoredSectionScroll(
  root: HTMLElement,
  position: ScrollSectionPosition,
  currentScroll: number,
) {
  const section = root.querySelector<HTMLElement>(`#${CSS.escape(position.id)}`)
  if (!section) return null

  const bounds = section.getBoundingClientRect()
  if (bounds.height <= 0) return null

  // A shorter replacement may no longer contain the old point in the section.
  const offset = Math.min(position.offset, Math.max(0, bounds.height - 1))
  return Math.max(0, currentScroll + bounds.top + offset - position.viewportTop)
}

export async function loadScrollTrigger() {
  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ])
  gsap.registerPlugin(ScrollTrigger)
  return ScrollTrigger
}

export function nextFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve())
  })
}

export async function waitForCondition(
  condition: () => boolean,
  timeout: number,
  shouldStop: () => boolean,
) {
  const deadline = performance.now() + timeout
  while (!shouldStop() && !condition() && performance.now() < deadline) {
    await nextFrame()
  }
}

export function scrollScenesAreReady(
  ScrollTrigger: ScrollTriggerStatic,
  root: Document | HTMLElement,
) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true

  const markers = root.querySelectorAll<HTMLElement>('[data-scroll-trigger-id]')
  return Array.from(markers).every((marker) => {
    if (!marker.getClientRects().length) return true
    const id = marker.dataset.scrollTriggerId
    const trigger = id && ScrollTrigger.getById(id)?.trigger
    return Boolean(trigger && marker.contains(trigger))
  })
}

export function refreshScrollTriggers(
  ScrollTrigger: ScrollTriggerStatic,
  safe = true,
) {
  if (!safe) {
    // The caller has already waited for the new scenes to register.
    ScrollTrigger.refresh()
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    const finish = () => {
      window.clearTimeout(fallback)
      ScrollTrigger.removeEventListener('refresh', finish)
      resolve()
    }

    const fallback = window.setTimeout(finish, 700)
    ScrollTrigger.addEventListener('refresh', finish)
    ScrollTrigger.refresh(true)
  })
}

export function captureScrollScene(
  ScrollTrigger: ScrollTriggerStatic,
  root: HTMLElement,
): ScrollScenePosition | null {
  const scene = ScrollTrigger.getAll().find(
    (trigger) =>
      trigger.vars.id &&
      trigger.pin &&
      trigger.isActive &&
      trigger.trigger &&
      root.contains(trigger.trigger),
  )
  const id = scene?.vars.id
  return scene && id ? { id, progress: scene.progress } : null
}

export function restoreScrollScene(
  ScrollTrigger: ScrollTriggerStatic,
  root: HTMLElement,
  position: ScrollScenePosition,
  setScroll: (top: number) => void,
) {
  const scene = ScrollTrigger.getById(position.id)
  if (!scene?.pin || !scene.trigger || !root.contains(scene.trigger))
    return false

  setScroll(scene.start + (scene.end - scene.start) * position.progress)
  ScrollTrigger.update()

  // A reparented pin can keep the coordinates measured while Smoother was
  // reverted during the global refresh. Measure it again at the restored scroll.
  const bounds = scene.pin.getBoundingClientRect()
  if (
    scene.vars.pinReparent &&
    (bounds.top >= window.innerHeight || bounds.bottom <= 0)
  ) {
    scene.refresh()
  }

  scene.getTween()?.progress(1)
  return true
}
