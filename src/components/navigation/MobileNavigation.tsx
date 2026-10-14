'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { Logo } from '@/components/icons/Logo'
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

    return () => {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [isOpen])

  useEffect(() => {
    const desktopViewport = window.matchMedia('(min-width: 1024px)')
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsOpen(false)
      }
    }

    desktopViewport.addEventListener('change', closeAtDesktop)

    return () => {
      desktopViewport.removeEventListener('change', closeAtDesktop)
    }
  }, [])

  const closeMenu = () => {
    const dialog = dialogRef.current

    if (dialog?.open) {
      dialog.close()
    }

    setIsOpen(false)
  }

  return (
    <>
      <button
        type="button"
        className="bg-primary text-primary-foreground border-line focus-visible:outline-primary inline-flex size-12 items-center justify-center self-center rounded-full border transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 lg:hidden"
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label="Открыть меню"
        onClick={() => setIsOpen(true)}
      >
        <span aria-hidden="true" className="flex flex-col gap-1.5">
          <span className="h-0.5 w-5 bg-current" />
          <span className="h-0.5 w-5 bg-current" />
          <span className="h-0.5 w-5 bg-current" />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        className="mobile-navigation-dialog bg-primary text-primary-foreground fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden p-0 lg:hidden"
        aria-labelledby="mobile-navigation-title"
        onCancel={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
      >
        <div className="mobile-navigation-content relative flex h-full min-h-0 flex-col overflow-hidden">
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
              onClick={closeMenu}
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
              className="bg-background text-surface focus-visible:outline-background relative inline-flex size-[60px] items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 hover:rotate-6 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
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

          <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto pt-11">
            <nav
              aria-label="Навигация по разделам страницы"
              className="page-container shrink-0"
            >
              <ol className="flex flex-col gap-4">
                {navigationItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-background focus-visible:outline-background block w-fit text-xl leading-6 font-medium no-underline transition-transform duration-200 hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div
              className="page-container mt-auto flex shrink-0 gap-4 pt-[70px]"
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

            <div className="border-background/20 mt-8 shrink-0 border-t pt-8 pb-4">
              <div className="page-container">
                <address className="text-background flex max-w-[279px] flex-col gap-4 text-xl leading-6 font-medium not-italic">
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
                  className="bg-background text-primary focus-visible:outline-background mt-8 inline-flex min-h-[68px] w-full items-center justify-center rounded-[24px] px-8 py-4 text-base leading-[19px] font-bold transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2"
                  onClick={closeMenu}
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
