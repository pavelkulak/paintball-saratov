'use client'

import { useRouter } from 'next/navigation'
import { useSyncExternalStore, useTransition } from 'react'
import { createPortal } from 'react-dom'

import { SITE_THEME_COOKIE, type SiteTheme } from '@/lib/site-theme'

const subscribe = () => () => {}

export function ThemePreviewToggle({ theme }: { theme: SiteTheme }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
  if (!mounted) return null

  return createPortal(
    <button
      type="button"
      aria-label="Переключить новогоднюю тему"
      aria-pressed={theme === 'new-year'}
      disabled={pending}
      data-theme-preview
      className="border-primary/40 bg-background/90 text-foreground focus-visible:outline-primary fixed top-20 right-4 z-[60] rounded-xl border px-2 py-1 text-[10px] shadow-lg backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 lg:top-auto lg:bottom-4 lg:px-3 lg:py-2 lg:text-xs"
      onClick={() => {
        const next = theme === 'new-year' ? 'default' : 'new-year'
        document.cookie = `${SITE_THEME_COOKIE}=${next}; Path=/; SameSite=Lax; Max-Age=86400${location.protocol === 'https:' ? '; Secure' : ''}`
        startTransition(() => router.refresh())
      }}
    >
      {pending
        ? 'Обновляем…'
        : `Демо: ${theme === 'new-year' ? 'Новый год' : 'Обычная тема'}`}
    </button>,
    document.body,
  )
}
