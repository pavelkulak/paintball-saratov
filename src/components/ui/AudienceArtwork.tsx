'use client'

import clsx from 'clsx'
import type { ReactNode } from 'react'

import { useAudienceNavigation } from '@/components/providers/ScrollSmootherProvider'
import type { AudienceId } from '@/lib/audience'

export function AudienceArtwork({
  audience,
  variants,
}: {
  audience: AudienceId
  variants: { id: AudienceId; content: ReactNode; className?: string }[]
}) {
  const navigation = useAudienceNavigation()
  const visibleAudience = navigation?.artworkAudience ?? audience

  return (
    <div data-audience-artwork className="absolute inset-0" aria-hidden="true">
      {variants.map(({ id, content, className }) => (
        <div
          key={id}
          data-artwork-audience={id}
          data-active={id === visibleAudience}
          className={clsx(
            'absolute inset-0 translate-y-4 opacity-0 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[active=true]:translate-y-0 data-[active=true]:opacity-100 motion-reduce:translate-none motion-reduce:transition-none',
            className,
          )}
        >
          {content}
        </div>
      ))}
    </div>
  )
}
