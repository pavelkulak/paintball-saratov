import 'server-only'

import { cookies } from 'next/headers'

import { isSiteTheme, SITE_THEME_COOKIE, type SiteTheme } from './site-theme'

export function isThemePreviewEnabled() {
  return (
    process.env.NODE_ENV === 'development' || process.env.THEME_PREVIEW === '1'
  )
}

export async function getSiteTheme(): Promise<SiteTheme> {
  const configured = process.env.SITE_THEME
  const fallback = isSiteTheme(configured) ? configured : 'default'
  if (process.env.STATIC_EXPORT === '1' || !isThemePreviewEnabled())
    return fallback
  const value = (await cookies()).get(SITE_THEME_COOKIE)?.value
  return isSiteTheme(value) ? value : fallback
}
