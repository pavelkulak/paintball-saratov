export const audienceOptions = [
  { id: 'all', label: 'Для всех', href: '/' },
  { id: 'children', label: 'Для детей', href: '/children/' },
  { id: 'adults', label: 'Для взрослых', href: '/adults/' },
] as const

export type AudienceId = (typeof audienceOptions)[number]['id']

export function normalizePathname(pathname: string) {
  return pathname.replace(/\/+$/, '') || '/'
}
