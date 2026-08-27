import { DesktopFacilitiesScene } from './facilities/DesktopFacilitiesScene'
import { MobileFacilitiesSlider } from './facilities/MobileFacilitiesSlider'

export function FacilitiesSection() {
  return (
    <>
      <MobileFacilitiesSlider />
      <DesktopFacilitiesScene />
    </>
  )
}
