import { ScenarioCard, type ScenarioCardData } from './ScenarioCard'

type DesktopScenariosGridProps = {
  scenarios: readonly ScenarioCardData[]
}

export function DesktopScenariosGrid({ scenarios }: DesktopScenariosGridProps) {
  return (
    <ul className="page-container mt-[52px] hidden grid-cols-3 items-stretch gap-x-4 gap-y-10 xl:grid">
      {scenarios.map((scenario) => (
        <li className="flex min-w-0 self-stretch" key={scenario.title}>
          <ScenarioCard scenario={scenario} variant="desktop" />
        </li>
      ))}
    </ul>
  )
}
