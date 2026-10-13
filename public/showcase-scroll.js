;(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.get('run') !== '1') return

  const statusUrl = document.querySelector(
    'meta[name="showcase-status-url"]',
  )?.content
  const duration = Math.max(
    5,
    Math.min(180, Number(params.get('duration')) || 48),
  )
  let running = false
  let cancelled = false

  history.scrollRestoration = 'manual'
  window.scrollTo({ top: 0, behavior: 'instant' })

  const report = (phase, details = {}) => {
    document.body.dataset.showcaseStatus = phase
    if (!statusUrl) return Promise.resolve()
    return fetch(statusUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phase, ...details }),
    }).catch(() => {})
  }
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  const nextFrame = () =>
    new Promise((resolve) => requestAnimationFrame(resolve))

  async function start() {
    if (running) return
    running = true
    cancelled = false
    await report('loading')

    if (document.readyState !== 'complete') {
      await new Promise((resolve) =>
        window.addEventListener('load', resolve, { once: true }),
      )
    }
    await document.fonts.ready
    const deadline = performance.now() + 15000
    while (
      document.querySelector('[data-site-loader]') &&
      performance.now() < deadline
    ) {
      if (cancelled) break
      await nextFrame()
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    await report('hero')
    await wait(1800)
    if (cancelled) {
      running = false
      return
    }

    const distance = Math.max(
      0,
      document.documentElement.scrollHeight - innerHeight,
    )
    const speed = distance / duration
    let frames = 0
    let longestFrameMs = 0
    let previousTime = null
    const startedAt = performance.now()
    await report('scrolling', {
      duration,
      distance,
      speed,
      width: innerWidth,
      height: innerHeight,
    })

    while (!cancelled) {
      const now = await nextFrame()
      if (previousTime !== null)
        longestFrameMs = Math.max(longestFrameMs, now - previousTime)
      previousTime = now
      frames++
      const progress = Math.min(1, (now - startedAt) / (duration * 1000))
      window.scrollTo({ top: distance * progress, behavior: 'instant' })
      if (progress === 1) break
    }

    if (!cancelled) {
      await report('footer')
      await wait(2500)
      await report('complete', {
        duration,
        distance,
        speed,
        frames,
        longestFrameMs,
        finalScroll: scrollY,
      })
    }
    running = false
  }

  document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
      cancelled = true
      void report('cancelled')
    }
    if (
      event.code === 'Space' &&
      !event.target.closest('input, textarea, button, select')
    ) {
      event.preventDefault()
      void start()
    }
  })
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && running) {
      cancelled = true
      void report('cancelled', { reason: 'The recording tab was hidden.' })
    }
  })

  if (params.get('run') === '1') void start()
})()
