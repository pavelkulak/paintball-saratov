'use client'

import clsx from 'clsx'
import { useLayoutEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

const audienceTabs = ['Для всех', 'Для детей', 'Для взрослых'] as const

type AudienceTab = (typeof audienceTabs)[number]

const tabBaseClass =
  'relative z-10 flex min-w-0 flex-1 items-center justify-center rounded-[20px] px-2.5 py-4 text-[14px] leading-[17px] whitespace-nowrap font-medium transition-[color,transform] duration-200 ease-out motion-reduce:transition-none lg:min-w-max lg:flex-none lg:px-5 lg:rounded-[16px] lg:py-5'

type AudienceTabsProps = {
  className?: string
}

export function AudienceTabs({ className }: AudienceTabsProps) {
  const [activeTab, setActiveTab] = useState<AudienceTab>(audienceTabs[0])
  const rootRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState<{
    left: number
    width: number
  } | null>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const buttons = root.querySelectorAll<HTMLButtonElement>('button')
    const selectedButton = buttons[audienceTabs.indexOf(activeTab)]
    const measure = () => {
      if (!selectedButton || selectedButton.offsetWidth === 0) return
      // Local offsets stay constant when the entire header slides or the page scrolls.
      const left = selectedButton.offsetLeft
      const width = selectedButton.offsetWidth
      setIndicator((current) =>
        current?.left === left && current.width === width
          ? current
          : { left, width },
      )
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    buttons.forEach((button) => observer.observe(button))
    return () => observer.disconnect()
  }, [activeTab])

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
      {audienceTabs.map((tab) => {
        const isActive = activeTab === tab

        return (
          <button
            key={tab}
            type="button"
            aria-pressed={isActive}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              tabBaseClass,
              'isolate',
              isActive ? 'text-surface' : 'text-ink/60 hover:text-ink',
              isActive && !indicator && 'bg-ink',
              'focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95',
            )}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <span className="relative z-10">{tab}</span>
          </button>
        )
      })}
    </div>
  )
}
