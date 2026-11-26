'use client'

import { usePathname } from 'next/navigation'
import { useId } from 'react'
import Image from 'next/image'

import { normalizePathname } from '@/lib/audience'
import { useSiteTheme } from '@/components/providers/SiteThemeProvider'

import styles from './section-splatters.module.css'

const shapes = {
  scenariosRight: { file: 'scenarios-right', width: 489, height: 631 },
  scenariosLeft: { file: 'scenarios-left', width: 478, height: 811 },
  formatsRight: { file: 'formats-right', width: 532, height: 289 },
  additionsLeft: { file: 'additions-left', width: 456, height: 430 },
  facilitiesLeft: { file: 'facilities-left', width: 393, height: 553 },
  faqRight: { file: 'faq-right', width: 416, height: 589 },
} as const

const sections = {
  scenarios: ['scenariosRight', 'scenariosLeft'],
  formats: ['formatsRight'],
  additions: ['additionsLeft'],
  facilities: ['facilitiesLeft'],
  faq: ['faqRight'],
  lead: [],
} as const

function WinterDecorations({ section }: { section: keyof typeof sections }) {
  if (section === 'faq' || section === 'formats') return null

  return (
    <div
      data-seasonal-decor={section}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden xl:block ${section === 'scenarios' ? 'overflow-x-clip' : 'overflow-hidden'} ${section === 'lead' ? '-top-[293px]' : 'top-0'}`}
    >
      {section === 'scenarios' && (
        <>
          <Image
            src="/images/new-year/snowflake-border-left.webp"
            alt=""
            width={1121}
            height={747}
            className="absolute top-0 left-0 max-w-none"
          />
          <Image
            src="/images/new-year/snowflake-border-right.webp"
            alt=""
            width={1121}
            height={747}
            className="absolute top-0 right-0 max-w-none"
          />
        </>
      )}
      {section === 'scenarios' && (
        <>
          <Image
            src="/images/new-year/snowfall-left.webp"
            alt=""
            width={1364}
            height={1354}
            className="absolute -bottom-[360px] left-[calc(50%_-_816px)] h-auto w-[900px] max-w-none"
          />
          <Image
            src="/images/new-year/snowfall-right.webp"
            alt=""
            width={1364}
            height={1354}
            className="absolute right-[calc(50%_-_816px)] -bottom-[360px] h-auto w-[900px] max-w-none"
          />
        </>
      )}
      {section === 'additions' && (
        <Image
          src="/images/new-year/additions-decor.webp"
          alt=""
          width={1485}
          height={884}
          className="absolute -top-[260px] left-1/2 h-auto max-w-none min-w-full -translate-x-1/2"
        />
      )}
      {(section === 'facilities' || section === 'lead') && (
        <Image
          src={
            section === 'lead'
              ? '/images/new-year/lead-frost.webp'
              : '/images/new-year/winter-frost.webp'
          }
          alt=""
          width={section === 'facilities' ? 1856 : 1440}
          height={section === 'facilities' ? 1114 : 857}
          className={
            section === 'facilities'
              ? 'absolute -top-[119px] left-1/2 h-auto max-w-none min-w-full -translate-x-1/2'
              : 'absolute top-0 left-1/2 h-auto w-[1440px] max-w-none min-w-full -translate-x-1/2'
          }
        />
      )}
      {section === 'facilities' && (
        <>
          <Image
            src="/images/new-year/star-large.webp"
            alt=""
            width={251}
            height={252}
            className="absolute top-[150px] left-[calc(50%_-_835px)] max-w-none"
          />
          <Image
            src="/images/new-year/star-small.webp"
            alt=""
            width={67}
            height={68}
            className="absolute top-[280px] left-[calc(50%_-_660px)]"
          />
          <Image
            src="/images/new-year/star-medium.webp"
            alt=""
            width={75}
            height={74}
            className="absolute top-[155px] left-[calc(50%_-_685px)]"
          />
          <Image
            src="/images/new-year/star-faint.webp"
            alt=""
            width={134}
            height={135}
            className="absolute top-[75px] left-[calc(50%_-_760px)]"
          />
        </>
      )}
    </div>
  )
}

function PaintSplatter({
  shape,
  color,
}: {
  shape: keyof typeof shapes
  color: string
}) {
  const maskId = useId()
  const { file, width, height } = shapes[shape]
  // The scenario sources bake 6% white into alpha; normalize that silhouette
  // before applying either the original olive or the children's brand color.
  const alphaScale = shape.startsWith('scenarios') ? 17 : 1

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={styles[shape]}
      focusable="false"
    >
      <defs>
        <filter id={`${maskId}-alpha`}>
          <feComponentTransfer>
            <feFuncA type="linear" slope={alphaScale} />
          </feComponentTransfer>
        </filter>
        {/* Preserve the original textured silhouette through its alpha channel. */}
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width={width}
          height={height}
          style={{ maskType: 'alpha' }}
        >
          <image
            href={`/images/section-splatters/${file}.webp`}
            width={width}
            height={height}
            filter={`url(#${maskId}-alpha)`}
          />
        </mask>
      </defs>
      <rect
        width={width}
        height={height}
        fill={color}
        mask={`url(#${maskId})`}
      />
    </svg>
  )
}

export function SectionSplatters({
  section,
  color,
}: {
  section: keyof typeof sections
  color?: string
}) {
  const isChildren = normalizePathname(usePathname()) === '/children'
  const theme = useSiteTheme()
  const fill =
    color ?? (isChildren ? 'var(--color-primary)' : 'var(--color-olive)')
  if (theme === 'new-year') return <WinterDecorations section={section} />
  if (section === 'lead') return null

  return (
    <div
      data-section-splatters
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden xl:block"
    >
      {sections[section].map((shape) => (
        <PaintSplatter key={shape} shape={shape} color={fill} />
      ))}
    </div>
  )
}
