import 'server-only'

import { homeResponseSchema, type HomeResponse } from './home-schema'

export async function getHomeContent(): Promise<HomeResponse> {
  const apiUrl = process.env.BITRIX_API_URL?.replace(/\/$/, '')

  if (!apiUrl) {
    throw new Error('[bitrix] BITRIX_API_URL is required for a static build.')
  }

  const response = await fetch(apiUrl, {
    cache: 'force-cache',
  })

  if (!response.ok) {
    throw new Error(
      `[bitrix] GET /api/v1/home failed with status ${response.status}.`,
    )
  }

  const payload: unknown = await response.json()
  return homeResponseSchema.parse(payload)
}
