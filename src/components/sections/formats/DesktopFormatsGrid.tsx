import { FORMAT_CARD_ICONS } from '@/components/icons/FormatIcons'

import { FormatCard, type FormatCardData } from './FormatCard'

type DesktopFormatsGridProps = {
  formats: readonly FormatCardData[]
}

export function DesktopFormatsGrid({ formats }: DesktopFormatsGridProps) {
  return (
    <ul className="page-container mt-[52px] hidden auto-rows-fr grid-cols-2 items-stretch gap-4 xl:grid">
      {formats.map((format, index) => (
        <li className="flex min-w-0 self-stretch" key={format.id}>
          <FormatCard
            format={format}
            icon={FORMAT_CARD_ICONS[index]}
            variant="desktop"
          />
        </li>
      ))}
    </ul>
  )
}
