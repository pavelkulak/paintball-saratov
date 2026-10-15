import { FormatCard } from './FormatCard'
import type { FormatCardData } from './formats.types'

type DesktopFormatsGridProps = {
  formats: readonly FormatCardData[]
}

export function DesktopFormatsGrid({ formats }: DesktopFormatsGridProps) {
  return (
    <ul className="page-container mt-[52px] hidden auto-rows-fr grid-cols-3 items-stretch gap-4 xl:grid">
      {formats.map((format, index) => (
        <li className="flex min-w-0 self-stretch" key={format.id}>
          <FormatCard format={format} iconIndex={index} variant="desktop" />
        </li>
      ))}
    </ul>
  )
}
