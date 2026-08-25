import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type ButtonVariant = 'light' | 'dark' | 'primary'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  light: 'bg-white text-ink hover:bg-white/85',
  dark: 'bg-ink text-white hover:bg-ink/85',
  primary: 'bg-primary text-primary-foreground hover:bg-primary/85',
}

export function Button({
  className,
  variant = 'light',
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        clsx(
          'focus-visible:outline-primary inline-flex w-full max-w-[200px] items-center justify-center rounded-2xl px-8 py-3 font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          className,
        ),
      )}
      {...props}
    />
  )
}
