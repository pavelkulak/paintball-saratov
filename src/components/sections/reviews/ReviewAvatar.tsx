'use client'

import Image from 'next/image'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

const avatarPalettes = [
  'bg-[#d9b4a6] text-[#5c382e]',
  'bg-[#c9a98e] text-[#493327]',
  'bg-[#b8c4b0] text-[#30432d]',
  'bg-[#b7c8d3] text-[#2e414d]',
] as const

function getInitials(name: string) {
  const words = name
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean)
  return words
    .slice(0, 2)
    .map((word) => Array.from(word)[0] ?? '')
    .join('')
    .toLocaleUpperCase('ru-RU')
}

function getPalette(name: string) {
  const hash = Array.from(name).reduce(
    (value, character) => value + character.codePointAt(0)!,
    0,
  )
  return avatarPalettes[hash % avatarPalettes.length]
}

export function ReviewAvatar({
  name,
  avatarUrl,
  sizes,
  className,
}: {
  name: string
  avatarUrl: string | null
  sizes: string
  className?: string
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const showImage = Boolean(avatarUrl) && avatarUrl !== failedUrl

  return (
    <div
      aria-hidden="true"
      className={twMerge(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-[4px] font-semibold',
        getPalette(name),
        className,
      )}
    >
      {showImage ? (
        <Image
          src={avatarUrl!}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
          onError={() => {
            setFailedUrl(avatarUrl)
          }}
        />
      ) : (
        getInitials(name)
      )}
    </div>
  )
}
