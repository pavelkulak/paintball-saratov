'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Logo } from '@/components/icons/Logo'
import { AudienceTabs } from '@/components/navigation/AudienceTabs'
import { Button } from '@/components/ui/Button'

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
      <div className="max-w-content mx-auto flex w-full items-center justify-between px-4 py-[14px] md:px-8 xl:px-0">
        <Link href="/" aria-label="На главную" className="flex items-center">
          <Logo />
        </Link>
        <AudienceTabs className="hidden lg:flex" />
        <div className="hidden flex-col items-start justify-center text-[14px] lg:flex">
          <a href="tel:+79214480804">+7 (921) 448-08-04</a>
          <p>г. Домодедово, Каширское ш-се д. 107-А</p>
        </div>
        <Button type="button" variant="light" className="hidden lg:flex">
          Оставить заявку
        </Button>

        <button
          type="button"
          className="bg-primary text-primary-foreground border-line inline-flex size-12 items-center justify-center self-center rounded-full border lg:hidden"
          aria-label="Открыть меню"
        >
          <span aria-hidden="true" className="flex flex-col gap-1">
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
            <span className="h-0.5 w-5 bg-current" />
          </span>
        </button>
      </div>
    </header>
  )
}
