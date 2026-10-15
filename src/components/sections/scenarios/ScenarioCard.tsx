'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'

import { ScenarioModal } from './ScenarioModal'
import type { ScenarioCardData } from './scenarios.types'

type ScenarioCardProps = {
  scenario: ScenarioCardData
  variant?: 'mobile' | 'desktop'
}

export function ScenarioCard({
  scenario,
  variant = 'mobile',
}: ScenarioCardProps) {
  const isDesktop = variant === 'desktop'
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <article className="flex min-h-0 w-full flex-col self-stretch overflow-hidden rounded-[24px] bg-white">
        <div
          className={
            isDesktop
              ? 'relative m-3 aspect-[365/200] shrink-0 overflow-hidden rounded-[12px]'
              : 'relative m-1 aspect-[320/152] shrink-0 overflow-hidden rounded-[20px]'
          }
        >
          <Image
            src={scenario.image}
            alt={scenario.title}
            fill
            sizes="(min-width: 1280px) 380px, 328px"
            className="object-cover"
          />
        </div>
        <div
          className={`text-ink flex min-h-0 flex-auto flex-col ${isDesktop ? 'px-6 pt-2 pb-4' : 'px-4 pt-5 pb-4'}`}
        >
          <h3
            className={`leading-[1.2] font-semibold ${isDesktop ? 'text-2xl' : 'text-xl'}`}
          >
            {scenario.title}
          </h3>
          <dl className="mt-5 flex flex-col gap-4">
            {scenario.fields.map((field) => (
              <div className="flex flex-col gap-1.5" key={field.label}>
                <dt className="text-muted text-sm leading-[1.2]">
                  {field.label}
                </dt>
                <dd
                  className={`leading-[1.3] ${isDesktop ? 'text-base' : 'text-sm'}`}
                >
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
          <ul
            className="mt-auto flex flex-wrap gap-1 pt-4"
            aria-label="Особенности"
          >
            {scenario.tags.map((tag) => (
              <li
                className="bg-surface-muted rounded-full px-4 py-2 text-xs leading-[1.25]"
                key={tag}
              >
                {tag}
              </li>
            ))}
          </ul>
          <Button
            type="button"
            variant="primary"
            aria-haspopup="dialog"
            aria-expanded={modalOpen}
            onClick={() => setModalOpen(true)}
            className="mt-3 min-h-[50px] w-full max-w-none shrink-0 rounded-[20px] px-5 py-3 text-base leading-[1.2] font-bold"
          >
            Смотреть сценарии
          </Button>
        </div>
      </article>
      {modalOpen && (
        <ScenarioModal
          scenario={scenario}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
