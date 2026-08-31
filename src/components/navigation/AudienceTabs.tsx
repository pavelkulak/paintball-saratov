'use client'

import clsx from 'clsx'
import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

const audienceTabs = ['Для всех', 'Для детей', 'Для взрослых'] as const

type AudienceTab = (typeof audienceTabs)[number]

const tabBaseClass =
  'relative z-10 flex min-w-0 flex-1 items-center justify-center rounded-2xl px-2.5 py-4 text-[14px] leading-[17px] whitespace-nowrap font-medium transition-[color,transform] duration-200 ease-out motion-reduce:transition-none lg:min-w-max lg:flex-none lg:px-5 lg:py-5'

type AudienceTabsProps = {
  className?: string
}

export function AudienceTabs({ className }: AudienceTabsProps) {
  const [activeTab, setActiveTab] = useState<AudienceTab>(audienceTabs[0])
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      role="group"
      aria-label="Выбор аудитории"
      className={twMerge(
        clsx(
          'border-ink relative isolate flex items-stretch rounded-[20px] border bg-white p-1 shadow-sm backdrop-blur-md',
          className,
        ),
      )}
    >
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
              'focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95',
            )}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {isActive && (
              <motion.span
                layoutId="audience-tab-bubble"
                aria-hidden="true"
                className="bg-ink pointer-events-none absolute inset-0 z-0 rounded-full shadow-md"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', bounce: 0.2, duration: 0.6 }
                }
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        )
      })}
    </div>
  )
}
