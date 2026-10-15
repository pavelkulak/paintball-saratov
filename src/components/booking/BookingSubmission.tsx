import { siteContact } from '@/lib/site-contact'
import { Button } from '@/components/ui/Button'

export function BookingSubmission({
  className = '',
  buttonClassName = '',
}: {
  className?: string
  buttonClassName?: string
}) {
  return (
    <div className={className}>
      <Button
        type="submit"
        variant="dark"
        disabled
        className={`bg-background min-h-12 w-full max-w-none rounded-[16px] px-6 py-3 font-semibold text-white opacity-60 ${buttonClassName}`}
      >
        Оставить заявку
      </Button>
      <p className="text-background/70 mt-3 text-sm leading-[1.4]">
        Онлайн-запись скоро откроется. Пока забронировать игру можно по телефону{' '}
        <a
          className="text-background whitespace-nowrap underline underline-offset-4"
          href={siteContact.phone.href}
        >
          {siteContact.phone.label}
        </a>
        .
      </p>
    </div>
  )
}
