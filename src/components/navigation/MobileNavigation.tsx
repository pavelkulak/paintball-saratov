'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { normalizePathname } from '@/lib/audience'
import { useEffect, useRef, useState, type MouseEvent } from 'react'

import { Logo } from '@/components/icons/Logo'
import { useSmoothScroll } from '@/components/providers/ScrollSmootherProvider'
import { siteContact, siteSocialLinks } from '@/lib/site-contact'

const navigationItems = [
  { href: '#event-additions', label: 'Форматы игры' },
  { href: '#event-support', label: 'Организация' },
  { href: '#event-safety', label: 'Безопасность' },
  { href: '#event-process', label: 'Как всё происходит' },
  { href: '#facilities', label: 'Площадка' },
  { href: '#media-gallery', label: 'Фото и видео' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#faq', label: 'Вопросы' },
] as const

const mobileSocialLinks = [siteSocialLinks[1], siteSocialLinks[0]]

export function MobileNavigation() {
  const scrollTo = useSmoothScroll()
  const isAdults = normalizePathname(usePathname()) === '/adults'
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (!isOpen) {
      return
    }

    dialog.showModal()
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = previousOverflow
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [isOpen])

  const closeMenu = () => {
    const dialog = dialogRef.current

    if (dialog?.open) {
      dialog.close()
    }

    setIsOpen(false)
  }

  const navigateToSection = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(event.currentTarget.hash.slice(1))
    closeMenu()
    if (!target) return
    event.preventDefault()
    window.history.pushState(null, '', event.currentTarget.hash)
    window.requestAnimationFrame(() => scrollTo(target))
  }

  return (
    <>
      <button
        type="button"
        className="bg-primary text-primary-foreground border-line focus-visible:outline-primary inline-flex size-11 shrink-0 items-center justify-center self-center rounded-full border transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label="Открыть меню"
        onClick={() => setIsOpen(true)}
      >
        <span aria-hidden="true" className="flex flex-col gap-1">
          <span className="h-0.5 w-4 bg-current" />
          <span className="h-0.5 w-4 bg-current" />
          <span className="h-0.5 w-4 bg-current" />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        className="bg-primary text-primary-foreground fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden p-0 [--mobile-navigation-origin-x:calc(100%_-_var(--layout-gutter)_-_1.375rem)] [--mobile-navigation-origin-y:calc(14px_+_max(22px,calc(var(--mobile-header-logo-width)*65/214)))] [clip-path:circle(_0_at_var(--mobile-navigation-origin-x)_var(--mobile-navigation-origin-y)_)] [transition:clip-path_560ms_cubic-bezier(0.76,_0,_0.24,_1),_overlay_560ms_allow-discrete,_display_560ms_allow-discrete] motion-reduce:transition-none md:inset-auto md:top-4 md:right-[max(var(--layout-gutter),calc((100vw_-_var(--container-content))/2))] md:h-auto md:max-h-[calc(100dvh-2rem)] md:w-[440px] md:rounded-[28px] md:shadow-2xl md:[--mobile-navigation-origin-x:calc(100%_-_3rem)] md:[--mobile-navigation-origin-y:3rem] lg:w-[480px] [&::backdrop]:bg-transparent md:[&::backdrop]:bg-black/45 md:[&::backdrop]:backdrop-blur-sm [&[open]]:[clip-path:circle(_150vmax_at_var(--mobile-navigation-origin-x)_var(--mobile-navigation-origin-y)_)] starting:[&[open]]:[clip-path:circle(_0_at_var(--mobile-navigation-origin-x)_var(--mobile-navigation-origin-y)_)] [&[open]_[data-navigation-mobile-navigation-content]]:[transform:translateY(0)] [&[open]_[data-navigation-mobile-navigation-content]]:opacity-100 starting:[&[open]_[data-navigation-mobile-navigation-content]]:[transform:translateY(-0.35rem)] starting:[&[open]_[data-navigation-mobile-navigation-content]]:opacity-0"
        aria-labelledby="mobile-navigation-title"
        onCancel={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return
          const bounds = event.currentTarget.getBoundingClientRect()
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            closeMenu()
        }}
      >
        <div
          data-navigation-mobile-navigation-content
          className="relative flex h-full min-h-0 [transform:translateY(-0.35rem)] flex-col overflow-hidden opacity-0 [transition:opacity_180ms_ease_100ms,_transform_260ms_ease_100ms] motion-reduce:transition-none md:h-auto md:max-h-[calc(100dvh-2rem)] md:[&_.page-container]:w-[calc(100%-4rem)]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-10 right-10 size-[125vmax] translate-x-1/2 -translate-y-1/2"
          >
            {[0, 1, 2, 3, 4].map((ring) => (
              <span
                key={ring}
                className="border-ink/10 absolute rounded-full border motion-safe:animate-[safety-ring-wave_4.8s_cubic-bezier(0.4,0,0.2,1)_infinite] motion-reduce:animate-none"
                style={{
                  inset: `${ring * 11}%`,
                  animationDelay: `${-4800 + ring * 180}ms`,
                }}
              />
            ))}
          </div>

          <div className="page-container relative z-10 flex shrink-0 items-start justify-between py-4">
            <a
              href="#hero"
              aria-label="К началу страницы"
              className="focus-visible:outline-ink w-fit focus-visible:outline-2 focus-visible:outline-offset-4"
              onClick={navigateToSection}
            >
              <Logo
                aria-hidden="true"
                className="h-auto w-[101px]"
                color="#12180c"
              />
            </a>

            <button
              type="button"
              autoFocus
              className="bg-background text-surface focus-visible:outline-background relative inline-flex size-[60px] items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 hover:rotate-6 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 md:size-11"
              aria-label="Закрыть меню"
              onClick={closeMenu}
            >
              <span
                aria-hidden="true"
                className="absolute h-0.5 w-[22px] rotate-45 rounded-full bg-current"
              />
              <span
                aria-hidden="true"
                className="absolute h-0.5 w-[22px] -rotate-45 rounded-full bg-current"
              />
            </button>
          </div>

          <h2 id="mobile-navigation-title" className="sr-only">
            Навигация по сайту
          </h2>

          <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pt-11 md:pt-5">
            <nav
              aria-label="Навигация по разделам страницы"
              className="page-container shrink-0"
            >
              <ol className="flex flex-col gap-4 md:gap-3">
                {navigationItems
                  .filter((item) => !isAdults || item.href !== '#event-safety')
                  .map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="text-background focus-visible:outline-background block w-fit text-xl leading-6 font-medium no-underline transition-transform duration-200 hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4"
                        onClick={navigateToSection}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
              </ol>
            </nav>

            <div
              className="page-container mt-auto flex shrink-0 gap-4 pt-[70px] md:pt-6"
              aria-label="Социальные сети"
            >
              {mobileSocialLinks.map((social) => (
                <a
                  key={social.kind}
                  href={social.href}
                  aria-label={social.label}
                  className="focus-visible:outline-background inline-flex size-10 items-center justify-center transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 active:translate-y-0"
                  onClick={closeMenu}
                >
                  <Image
                    src={`/images/mobile-menu-${social.kind}.svg`}
                    alt=""
                    width={40}
                    height={40}
                  />
                </a>
              ))}
            </div>

            <div className="border-background/20 mt-8 shrink-0 border-t pt-8 pb-4 md:mt-5 md:pt-5 md:pb-6">
              <div className="page-container">
                <address className="text-background flex max-w-[279px] flex-col gap-4 text-xl leading-6 font-medium not-italic md:max-w-none md:gap-2 md:text-base">
                  <a
                    href={siteContact.phone.href}
                    className="focus-visible:outline-background w-fit whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {siteContact.phone.label}
                  </a>
                  <span>{siteContact.address}</span>
                </address>

                <a
                  href="#scenarios"
                  className="bg-background text-primary focus-visible:outline-background mt-8 inline-flex min-h-[68px] w-full items-center justify-center rounded-[24px] px-8 py-4 text-base leading-[19px] font-bold transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 md:mt-5 md:min-h-14 md:rounded-2xl"
                  onClick={navigateToSection}
                >
                  Смотреть вариант
                </a>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
