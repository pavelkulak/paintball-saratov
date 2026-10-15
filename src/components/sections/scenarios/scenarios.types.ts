export type ScenarioBookingOption = {
  name: string
  tariff: string
  price: string
  description: string
  note: string
}

export type ScenarioCardData = {
  id: string
  title: string
  image: string
  fields: readonly { label: string; value: string }[]
  tags: readonly string[]
  bookingScenarios: readonly ScenarioBookingOption[]
}
