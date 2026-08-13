import 'server-only'

import { homeResponseSchema, type HomeResponse } from './home-schema'

const emptyHomeResponse: HomeResponse = {
  title: 'Paintball',
  description: '',
  phone: '',
  address: '',
}

export async function getHomeContent(): Promise<HomeResponse> {
  const apiUrl = process.env.BITRIX_API_URL?.replace(/\/$/, '')
  const allowEmptySnapshot = process.env.BITRIX_ALLOW_EMPTY_SNAPSHOT === '1'

  if (!apiUrl) {
    if (!allowEmptySnapshot) {
      throw new Error(
        '[bitrix] BITRIX_API_URL is required. Set BITRIX_ALLOW_EMPTY_SNAPSHOT=1 only for local development without a Bitrix snapshot.',
      )
    }

    console.warn(
      '[bitrix] BITRIX_API_URL is not configured; using an explicitly allowed empty local content snapshot.',
    )
    return emptyHomeResponse
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
