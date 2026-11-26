'use client'

import { createContext, useContext, type ReactNode } from 'react'

import type { SiteTheme } from '@/lib/site-theme'

const SiteThemeContext = createContext<SiteTheme>('default')

export function SiteThemeProvider({
  theme,
  children,
}: {
  theme: SiteTheme
  children: ReactNode
}) {
  return (
    <SiteThemeContext.Provider value={theme}>
      {children}
    </SiteThemeContext.Provider>
  )
}

export function useSiteTheme() {
  return useContext(SiteThemeContext)
}
