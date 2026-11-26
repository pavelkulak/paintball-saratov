export type SiteTheme = 'default' | 'new-year'

export const SITE_THEME_COOKIE = 'paintball-theme'

export function isSiteTheme(value: string | undefined): value is SiteTheme {
  return value === 'default' || value === 'new-year'
}
