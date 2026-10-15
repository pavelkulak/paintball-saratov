export type FormatTariff = {
  name: string
  price: number
  duration: string
  details: string
  activity: string
  feature: string
  fit: string
}

export type FormatCardData = {
  id: string
  title: string
  palette: 'light' | 'dark'
  tariffs?: readonly FormatTariff[]
  activeTariff?: number
  age: string
  activityLabel: string
  activity: string
  feature: string
  fitLabel: string
  fit: string
  description: string
  backgroundImage?: string
}
