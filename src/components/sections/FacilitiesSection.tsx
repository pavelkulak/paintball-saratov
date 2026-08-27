import { DesktopFacilitiesScene } from './facilities/DesktopFacilitiesScene'
import { MobileFacilitiesSlider } from './facilities/MobileFacilitiesSlider'

export function FacilitiesSection() {
  return (
    <section
      id="facilities"
      aria-label="Зона отдыха и удобства"
      className="section-anchor"
    >
      <MobileFacilitiesSlider />
      <DesktopFacilitiesScene />
    </section>
  )
}
