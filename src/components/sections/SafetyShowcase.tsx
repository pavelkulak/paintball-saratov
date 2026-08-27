'use client'

import Image from 'next/image'
import { useState, type CSSProperties } from 'react'

const SAFETY_ARTWORK_SRC = '/images/safety-players.png'

const rings = [
  { diameter: 592, opacity: 0.3 },
  { diameter: 794, opacity: 0.25 },
  { diameter: 996, opacity: 0.2 },
  { diameter: 1198, opacity: 0.12 },
  { diameter: 1400, opacity: 0.05 },
  { diameter: 1602, opacity: 0.03 },
] as const

const safetyItems = [
  {
    id: 'briefing',
    title: 'Безопасный инструктаж',
    description:
      'Перед игрой объясняем правила, экипировку и технику безопасности.',
    left: '62.12%',
    top: '0%',
    compactPosition: 'top-0 left-0 sm:left-[4%]',
    compactLabelWidth: 'max-w-[210px]',
  },
  {
    id: 'rules',
    title: 'Правила участия',
    description:
      'Чёткие ограничения по снаряжению и поведению — рассказываем родителям заранее, без сюрпризов',
    left: '14.71%',
    top: '19.37%',
    compactPosition: 'top-[26%] right-0 sm:top-[23%] sm:right-[4%]',
    compactLabelWidth: 'max-w-[190px]',
  },
  {
    id: 'beginners',
    title: 'Помощь новичкам',
    description: 'Инструкторы помогают освоиться и уверенно включиться в игру.',
    left: '62.41%',
    top: '38.75%',
    compactPosition: 'top-1/2 left-0 sm:top-[48%] sm:left-[2%]',
    compactLabelWidth: 'max-w-[190px]',
  },
  {
    id: 'scenario',
    title: 'Адаптация сценария под возраст',
    description: 'Подбираем сценарий и темп игры под возраст участников.',
    left: '35.24%',
    top: '58.12%',
    compactPosition: 'top-[74%] right-0 sm:top-[73%] sm:right-[5%]',
    compactLabelWidth: 'max-w-[150px] sm:max-w-[220px]',
  },
  {
    id: 'support',
    title: 'Сопровождение во время игры',
    description: 'Инструкторы контролируют игру от старта до финала.',
    left: '20.65%',
    top: '77.49%',
    compactPosition: 'top-[86%] left-0 sm:top-[82%] sm:left-[8%]',
    compactLabelWidth: 'max-w-[240px]',
  },
] as const

function SafetyRings({ compact = false }: { compact?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={
        compact
          ? 'pointer-events-none absolute top-[28%] left-1/2 z-0 aspect-square w-[215%] -translate-x-1/2 -translate-y-1/2 sm:top-[41%] sm:w-[145%] md:top-[44%] md:w-[125%]'
          : 'pointer-events-none absolute top-1/2 left-1/2 z-0 aspect-square w-[94.24%] -translate-x-1/2 -translate-y-1/2'
      }
    >
      {rings.map((ring, index) => (
        <span
          key={ring.diameter}
          className="absolute top-1/2 left-1/2 aspect-square -translate-x-1/2 -translate-y-1/2"
          style={
            {
              width: `${(ring.diameter / 1602) * 100}%`,
            } as CSSProperties
          }
        >
          <span
            className="absolute inset-0 rounded-full border motion-safe:animate-[safety-ring-wave_4.8s_cubic-bezier(0.4,0,0.2,1)_infinite] motion-reduce:animate-none"
            style={
              {
                borderColor: `rgb(18 24 12 / ${ring.opacity})`,
                animationDelay: `${-4800 + index * 160}ms`,
              } as CSSProperties
            }
          />
        </span>
      ))}
    </div>
  )
}

function SafetyIcon({ active }: { active: boolean }) {
  return (
    <span className="bg-primary relative flex size-12 shrink-0 items-center justify-center rounded-[14px]">
      {active ? (
        <span
          aria-hidden="true"
          className="bg-primary/20 absolute -inset-1.5 rounded-[20px] motion-safe:animate-[safety-pulse_2.4s_ease-in-out_infinite]"
        />
      ) : null}
      <span
        aria-hidden="true"
        className="relative size-5 transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{ transform: active ? 'rotate(45deg)' : 'rotate(0deg)' }}
      >
        <span className="bg-primary-foreground absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2" />
        <span className="bg-primary-foreground absolute top-0 left-1/2 h-full w-0.5 -translate-x-1/2" />
      </span>
    </span>
  )
}

function SafetyAccordionItem({
  item,
  active,
  onToggle,
  compact = false,
  flow = false,
}: {
  item: (typeof safetyItems)[number]
  active: boolean
  onToggle: () => void
  compact?: boolean
  flow?: boolean
}) {
  const panelId = `safety-panel-${compact ? 'compact' : 'desktop'}-${item.id}`

  return (
    <article
      className={`${
        compact && flow
          ? 'relative ml-0 w-max max-w-[calc(100%-8px)] sm:ml-[8%]'
          : compact
            ? `absolute w-max max-w-[calc(100%-8px)] ${item.compactPosition}`
            : 'absolute w-max max-w-[calc(100%-16px)]'
      } ${active ? 'z-20' : 'z-10'}`}
      style={compact ? undefined : { left: item.left, top: item.top }}
    >
      <button
        type="button"
        aria-controls={panelId}
        aria-expanded={active}
        onClick={onToggle}
        className={
          compact
            ? 'text-ink focus-visible:ring-primary-foreground focus-visible:ring-offset-primary flex min-h-16 w-full max-w-full items-center gap-3 rounded-[22px] bg-white py-2 pr-4 pl-2 text-left text-xs leading-none font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 sm:text-sm md:gap-4 md:pr-5 md:text-base'
            : 'text-ink focus-visible:ring-primary-foreground focus-visible:ring-offset-primary flex min-h-16 w-max max-w-full items-center gap-5 rounded-[22px] bg-white py-2 pr-5 pl-2 text-left text-[clamp(16px,1.67vw,24px)] leading-none font-semibold focus-visible:ring-2 focus-visible:ring-offset-2'
        }
      >
        <SafetyIcon active={active} />
        <span
          className={
            compact
              ? `${item.compactLabelWidth} leading-[1.15]`
              : 'whitespace-nowrap'
          }
        >
          {item.title}
        </span>
      </button>

      <div
        id={panelId}
        aria-hidden={!active}
        className="grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out"
        style={{
          gridTemplateRows: active ? '1fr' : '0fr',
          opacity: active ? 1 : 0,
          marginTop: active ? '2px' : '0px',
        }}
      >
        <div className="min-h-0 overflow-hidden rounded-[22px] bg-white">
          <p
            className={
              compact
                ? 'text-ink max-w-[230px] px-4 py-4 text-xs leading-[1.25] sm:max-w-[280px] sm:text-sm md:px-5 md:py-5'
                : 'text-ink max-w-[254px] px-6 py-7 text-base leading-[1.2]'
            }
          >
            {item.description}
          </p>
        </div>
      </div>
    </article>
  )
}

export function SafetyShowcase() {
  const [activeId, setActiveId] = useState('rules')

  return (
    <>
      <div className="mx-auto w-full max-w-3xl px-2 pt-6 sm:px-6 sm:pt-10 md:px-8 xl:hidden">
        <div className="relative h-[clamp(930px,258vw,1060px)] sm:h-[804px] md:h-[738px]">
          <SafetyRings compact />

          <div className="pointer-events-none absolute top-[7%] left-1/2 z-[1] aspect-[1440/1072] w-[160%] max-w-none -translate-x-1/2 sm:top-[8.5%] sm:w-[112%] md:top-[11%] md:w-[96%]">
            <Image
              src={SAFETY_ARTWORK_SRC}
              alt=""
              fill
              sizes="(min-width: 768px) 738px, (min-width: 640px) 112vw, 160vw"
              className="object-contain object-center"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          </div>

          {safetyItems.slice(0, -1).map((item) => (
            <SafetyAccordionItem
              key={item.id}
              item={item}
              active={activeId === item.id}
              compact
              onToggle={() => {
                setActiveId((currentId) =>
                  currentId === item.id ? '' : item.id,
                )
              }}
            />
          ))}
        </div>

        <SafetyAccordionItem
          item={safetyItems[4]}
          active={activeId === safetyItems[4].id}
          compact
          flow
          onToggle={() => {
            setActiveId((currentId) =>
              currentId === safetyItems[4].id ? '' : safetyItems[4].id,
            )
          }}
        />
      </div>

      <div className="max-w-content mx-auto hidden w-full px-4 pt-[52px] md:px-8 xl:block xl:px-0">
        <div className="relative aspect-[1700/1053] w-full">
          <SafetyRings />

          <div className="pointer-events-none absolute inset-0 z-[1]">
            <Image
              src={SAFETY_ARTWORK_SRC}
              alt=""
              fill
              sizes="(min-width: 1280px) min(100vw, 1200px)"
              className="object-contain object-center"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          </div>

          {safetyItems.map((item) => (
            <SafetyAccordionItem
              key={item.id}
              item={item}
              active={activeId === item.id}
              onToggle={() => {
                setActiveId((currentId) =>
                  currentId === item.id ? '' : item.id,
                )
              }}
            />
          ))}
        </div>
      </div>
    </>
  )
}
