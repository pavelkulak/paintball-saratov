import type { AudienceId } from './audience'

// Decode the visible artwork before revealing the new route. Offscreen images
// keep native lazy loading; they must not delay a switch inside a pinned scene.
export async function prepareAudienceArtwork(
  page: HTMLElement,
  audience: AudienceId,
  previousAudience: AudienceId,
) {
  const images = Array.from(
    page.querySelectorAll<HTMLElement>('[data-audience-artwork]'),
  )
    .filter((artwork) => {
      const bounds = artwork.getBoundingClientRect()
      return (
        bounds.width > 0 &&
        bounds.height > 0 &&
        bounds.top < window.innerHeight &&
        bounds.bottom > 0
      )
    })
    .flatMap((artwork) =>
      Array.from(
        artwork.querySelectorAll<HTMLImageElement>(
          `[data-artwork-audience="${audience}"] img, [data-artwork-audience="${previousAudience}"] img`,
        ),
      ),
    )

  let timeout = 0
  try {
    await Promise.race([
      Promise.all(
        images.map(async (image) => {
          image.loading = 'eager'
          await image.decode().catch(() => undefined)
        }),
      ),
      new Promise<void>((resolve) => {
        timeout = window.setTimeout(resolve, 3000)
      }),
    ])
  } finally {
    window.clearTimeout(timeout)
  }
}
