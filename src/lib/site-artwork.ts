import type { AudienceId } from './audience'
import type { SiteTheme } from './site-theme'

type HeroArtwork = { mobileSrc: string; desktopSrc: string }
export type SafetyAudience = Exclude<AudienceId, 'adults'>

const defaultHero: Record<AudienceId, HeroArtwork> = {
  all: {
    mobileSrc: '/images/hero-players-family-mobile.png',
    desktopSrc: '/images/hero-players-family.webp',
  },
  children: {
    mobileSrc: '/images/hero-players-children-mobile.webp',
    desktopSrc: '/images/hero-players-children.webp',
  },
  adults: {
    mobileSrc: '/images/hero-players-adults-mobile.webp',
    desktopSrc: '/images/hero-players-adults.webp',
  },
}

const newYearHero: Record<AudienceId, HeroArtwork> = {
  all: {
    mobileSrc: '/images/new-year/hero-all-mobile.webp',
    desktopSrc: '/images/new-year/hero-all.webp',
  },
  children: {
    mobileSrc: '/images/new-year/hero-children-mobile.webp',
    desktopSrc: '/images/new-year/hero-children.webp',
  },
  adults: {
    mobileSrc: '/images/new-year/hero-adults-mobile.webp',
    desktopSrc: '/images/new-year/hero-adults.webp',
  },
}

export function getHeroArtwork(theme: SiteTheme) {
  return theme === 'new-year' ? newYearHero : defaultHero
}

export function getSafetyArtwork(
  theme: SiteTheme,
): Record<SafetyAudience, string> {
  return theme === 'new-year'
    ? {
        all: '/images/new-year/safety-group.webp',
        children: '/images/new-year/safety-group.webp',
      }
    : {
        all: '/images/safety-players-all.webp',
        children: '/images/safety-players-family.webp',
      }
}
