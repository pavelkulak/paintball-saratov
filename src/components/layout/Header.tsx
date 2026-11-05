'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Logo } from '@/components/icons/Logo'
import { AudienceTabs } from '@/components/navigation/AudienceTabs'
import { MobileNavigation } from '@/components/navigation/MobileNavigation'
import { Button } from '@/components/ui/Button'
import { useSmoothScroll } from '@/components/providers/ScrollSmootherProvider'
import { siteContact } from '@/lib/site-contact'

export function Header() {
  const scrollTo = useSmoothScroll()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ease-out motion-reduce:transition-none',
        isScrolled &&
          'border-line/40 bg-background/75 border-b backdrop-blur-md',
      )}
    >
      <div className="page-container flex items-center justify-between py-[14px] max-lg:gap-[calc(var(--mobile-header-unit)*7)] max-lg:[--mobile-header-logo-width:calc(var(--mobile-header-unit)*64)] max-lg:[--mobile-header-unit:clamp(1px,0.31vw,1.4px)]">
        <Link
          href="/"
          aria-label="На главную"
          className="flex items-center max-lg:shrink-0"
        >
          <Logo className="h-auto w-[107px] max-lg:w-(--mobile-header-logo-width)" />
        </Link>
        <AudienceTabs className="hidden lg:flex" />
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-0.5 text-left lg:flex-none lg:gap-0 lg:text-[14px]">
          <a
            href={siteContact.phone.href}
            className="max-lg:text-[length:calc(var(--mobile-header-unit)*14)] max-lg:leading-tight max-lg:font-semibold max-lg:whitespace-nowrap"
          >
            {siteContact.phone.label}
          </a>
          <p className="text-foreground/85 text-[length:calc(var(--mobile-header-unit)*10)] leading-tight lg:hidden">
            {siteContact.shortAddress}
          </p>
          <p className="hidden lg:block">{siteContact.address}</p>
        </div>
        <Button
          type="button"
          variant="light"
          className="hidden lg:flex"
          onClick={() => {
            const leadForm = document.getElementById('lead-form')
            if (leadForm) scrollTo(leadForm)
          }}
        >
          Оставить заявку
        </Button>

        <MobileNavigation />
      </div>
    </header>
  )
}
