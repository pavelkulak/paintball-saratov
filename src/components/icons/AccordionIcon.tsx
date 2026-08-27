type AccordionIconProps = {
  isOpen: boolean
}

export function AccordionIcon({ isOpen }: AccordionIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-300 ease-out ${
        isOpen ? 'rotate-180' : ''
      }`}
      fill="none"
      height="23"
      viewBox="0 0 22 23"
      width="22"
    >
      <path
        d="M11 1C11 9.59153 11 12.4085 11 21M1 11L11 21L21 11"
        stroke="#12180C"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  )
}
