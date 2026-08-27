export const siteContact = {
  phone: {
    href: 'tel:+74951043686',
    label: '+7 (495) 104-36-86',
  },
  address: 'г. Домодедово, Каширское ш-се д. 107-А',
} as const

// TODO: replace the section anchors when the public social profile URLs are approved.
export const siteSocialLinks = [
  {
    kind: 'vk',
    href: '#footer',
    label: 'Пейнтбол во ВКонтакте',
  },
  {
    kind: 'telegram',
    href: '#footer',
    label: 'Пейнтбол в Telegram',
  },
] as const
