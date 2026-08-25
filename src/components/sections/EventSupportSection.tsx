import { twMerge } from 'tailwind-merge'

import { EventProcessOrbit } from '@/components/sections/EventProcessOrbit'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SafetyShowcase } from '@/components/sections/SafetyShowcase'

const supportCards = [
  {
    icons: '👩 👦',
    text: 'Помогаем выбрать формат по возрасту — не придётся гадать, что подойдёт',
  },
  {
    icons: '🥰 🤝',
    text: 'Инструкторы сопровождают игру от старта до финала',
  },
  {
    icons: '😎 🤌',
    text: 'Объясняем, как всё проходит, до мероприятия — никаких сюрпризов',
  },
  {
    icons: '💯 ✍',
    text: 'Помогаем собрать сценарий под ваш повод и состав гостей',
  },
  {
    icons: '🍕 ⛺',
    text: 'Можно дополнить зоной отдыха и питанием прямо на месте',
  },
  {
    icons: '🎒 👌',
    text: 'Заранее подсказываем, что подготовить и взять с собой',
  },
] as const

type SupportCardProps = {
  icons: string
  text: string
}

function SupportCard({ icons, text }: SupportCardProps) {
  return (
    <article className="text-ink relative flex h-[355px] w-[clamp(280px,27vw,389px)] flex-none flex-col rounded-[24px] bg-white p-6">
      <div className="flex items-start">
        <div className="bg-primary flex h-12 w-20 items-center justify-center rounded-[14px]">
          {icons.split(' ').map((icon) => (
            <span
              key={icon}
              aria-hidden="true"
              className="size-8 text-[32px] leading-none"
            >
              {icon}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-4 max-w-[318px] text-base leading-[1.2]">{text}</p>
    </article>
  )
}

export function EventSupportSection({ className }: { className?: string }) {
  return (
    <section
      className={twMerge(
        'bg-primary text-primary-foreground relative z-10 -mt-6 overflow-hidden rounded-[50px] pt-[120px] max-md:-mt-4 max-md:rounded-[28px] max-md:pt-16',
        className,
      )}
    >
      <div className="max-w-content mx-auto flex w-full flex-col items-center px-4 text-center md:px-8 xl:px-0">
        <SectionHeading
          title="Мы рядом — до, во время и после мероприятия"
          description="Вы отдыхаете и наслаждаетесь праздником, а мы берём на себя организацию и заботу о деталях"
          decor="comfort"
        />
      </div>

      <div className="mt-[52px] mb-[52px] h-[355px] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,#000_0%,#000_65%,rgba(0,0,0,0.9)_75%,rgba(0,0,0,0.45)_88%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_65%,rgba(0,0,0,0.9)_75%,rgba(0,0,0,0.45)_88%,transparent_100%)] max-md:mt-10 max-md:h-[320px]">
        <div className="flex w-max animate-[support-marquee_35s_linear_infinite] will-change-transform motion-reduce:animate-none">
          {[0, 1].map((groupIndex) => (
            <div
              key={groupIndex}
              aria-hidden={groupIndex === 1}
              className="flex gap-4 pr-4"
            >
              {supportCards.map((card) => (
                <SupportCard key={`${groupIndex}-${card.text}`} {...card} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-content mx-auto flex w-full flex-col items-center px-4 text-center md:px-8 xl:px-0">
        <SectionHeading
          title="Безопасность и сопровождение"
          description="До и во время мероприятия — всё под контролем наших инструкторов"
          decor="safety"
        />
      </div>

      <SafetyShowcase />
      <EventProcessOrbit />
    </section>
  )
}
