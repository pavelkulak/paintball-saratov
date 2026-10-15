'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Logo } from '@/components/icons/Logo'
import { AudienceTabs } from '@/components/navigation/AudienceTabs'
import { MobileNavigation } from '@/components/navigation/MobileNavigation'
import { Button } from '@/components/ui/Button'
import { siteContact } from '@/lib/site-contact'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    let previousY = Math.max(0, window.scrollY)
    let accumulatedDelta = 0
    const handleScroll = () => {
      const currentY = Math.max(0, window.scrollY)
      const delta = currentY - previousY
      previousY = currentY
      setIsScrolled(currentY > 8)
      if (!desktop.matches || currentY < 80) {
        accumulatedDelta = 0
        setIsHidden(false)
        return
      }
      accumulatedDelta =
        Math.sign(delta) === Math.sign(accumulatedDelta)
          ? accumulatedDelta + delta
          : delta
      if (Math.abs(accumulatedDelta) >= 8) setIsHidden(accumulatedDelta > 0)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    desktop.addEventListener('change', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      desktop.removeEventListener('change', handleScroll)
    }
  }, [])

  return (
    <header
      data-hidden={isHidden || undefined}
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,backdrop-filter,border-color] duration-300 motion-reduce:transition-none lg:focus-within:translate-y-0 lg:data-[hidden=true]:-translate-y-full',
        isScrolled &&
          'border-line/40 bg-background/75 border-b backdrop-blur-md',
      )}
    >
      <div className="page-container flex items-center justify-between py-[14px]">
        <Link href="/" aria-label="На главную" className="flex items-center">
          <Logo />
        </Link>
        <AudienceTabs className="hidden lg:flex" />
        <div className="hidden flex-col items-start justify-center text-[14px] lg:flex">
          <a href={siteContact.phone.href}>{siteContact.phone.label}</a>
          <p>{siteContact.address}</p>
        </div>
        <Button href="#lead-form" variant="light" className="hidden lg:flex">
          Оставить заявку
        </Button>

        <MobileNavigation />
      </div>
    </header>
  )
}
