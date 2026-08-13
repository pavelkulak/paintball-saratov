import 'server-only'

import { homeResponseSchema, type HomeResponse } from './home-schema'

const emptyHomeResponse: HomeResponse = {
  common: {
    seo: {
      title: 'Paintball',
      description: '',
    },
    sections: [],
  },
  modes: {
    paintball: {
      slug: 'paintball',
      title: '',
      description: '',
      sections: [],
    },
    laserTag: {
      slug: 'laserTag',
      title: '',
      description: '',
      sections: [],
    },
    kids: {
      slug: 'kids',
      title: '',
      description: '',
      sections: [],
    },
  },
}

export async function getHomeContent(): Promise<HomeResponse> {
  const apiUrl = process.env.BITRIX_API_URL?.replace(/\/$/, '')

  if (!apiUrl) {
    console.warn(
      '[bitrix] BITRIX_API_URL is not configured; using an empty local content snapshot.',
    )
    return emptyHomeResponse
  }

  const response = await fetch(`${apiUrl}/api/v1/home`, {
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
