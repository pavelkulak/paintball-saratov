'use client'

import clsx from 'clsx'
import Link, { useLinkStatus } from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayoutEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { audienceOptions, normalizePathname } from '@/lib/audience'

const tabBaseClass =
  'relative z-10 flex min-w-0 flex-1 items-center justify-center rounded-[20px] px-2.5 py-4 text-[14px] leading-[17px] whitespace-nowrap font-medium transition-[color,transform] duration-200 ease-out motion-reduce:transition-none lg:min-w-max lg:flex-none lg:px-5 lg:rounded-[16px] lg:py-5'

type AudienceTabsProps = {
  className?: string
}

type AudienceTabContentProps = {
  label: string
}

function AudienceTabContent({ label }: AudienceTabContentProps) {
  const { pending } = useLinkStatus()

  return (
    <>
      <span
        className={clsx(
          'relative z-10 transition-[opacity,filter] duration-150',
          pending && 'opacity-20 blur-[1px]',
        )}
        style={{ transitionDelay: pending ? '100ms' : undefined }}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className={clsx(
          'pointer-events-none absolute inset-0 z-20 grid place-items-center opacity-0 transition-opacity duration-150 motion-reduce:transition-none',
          pending && 'opacity-100',
        )}
        style={{ transitionDelay: pending ? '100ms' : undefined }}
      >
        <span className="relative grid size-7 place-items-center rounded-full bg-current/10 shadow-[0_0_12px_rgba(255,255,255,0.3)] backdrop-blur-sm">
          <span className="absolute inset-0 rounded-full border border-current/25" />
          <span
            className={clsx(
              'absolute inset-0 rounded-full border-2 border-current/70 border-t-current border-r-transparent border-b-transparent',
              pending && 'motion-safe:animate-spin',
            )}
            style={{ animationDelay: pending ? '100ms' : undefined }}
          />
          <span className="size-1 rounded-full bg-current/80" />
        </span>
      </span>
    </>
  )
}

export function AudienceTabs({ className }: AudienceTabsProps) {
  const pathname = normalizePathname(usePathname())
  const activeOption =
    audienceOptions.find(
      (option) => normalizePathname(option.href) === pathname,
    ) ?? audienceOptions[0]
  const rootRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState<{
    left: number
    width: number
  } | null>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const links = root.querySelectorAll<HTMLAnchorElement>('a')
    const selectedLink = Array.from(links).find(
      (link) => normalizePathname(link.pathname) === pathname,
    )
    const measure = () => {
      if (!selectedLink || selectedLink.offsetWidth === 0) return
      // Local offsets stay constant when the entire header slides or the page scrolls.
      const left = selectedLink.offsetLeft
      const width = selectedLink.offsetWidth
      setIndicator((current) =>
        current?.left === left && current.width === width
          ? current
          : { left, width },
      )
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    links.forEach((link) => observer.observe(link))
    return () => observer.disconnect()
  }, [pathname])

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label="Выбор аудитории"
      className={twMerge(
        clsx(
          'border-ink relative isolate flex items-stretch rounded-[20px] border bg-white p-1 shadow-sm backdrop-blur-md',
          className,
        ),
      )}
    >
      {indicator && (
        <span
          aria-hidden="true"
          className="bg-ink pointer-events-none absolute inset-y-1 left-0 z-0 rounded-[16px] shadow-md transition-[transform,width] duration-200 ease-out motion-reduce:transition-none"
          style={{
            transform: `translateX(${indicator.left}px)`,
            width: indicator.width,
          }}
        />
      )}
      {audienceOptions.map((option) => {
        const isActive = activeOption.id === option.id

        return (
          <Link
            key={option.id}
            href={option.href}
            aria-current={isActive ? 'page' : undefined}
            className={clsx(
              tabBaseClass,
              'isolate',
              isActive ? 'text-surface' : 'text-ink/60 hover:text-ink',
              isActive && !indicator && 'bg-ink',
              'focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95',
            )}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <AudienceTabContent label={option.label} />
          </Link>
        )
      })}
    </div>
  )
}
