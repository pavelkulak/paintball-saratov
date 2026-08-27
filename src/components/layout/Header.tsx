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
        'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300',
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
