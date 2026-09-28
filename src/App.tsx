import { PointCloudSpikeExperience } from './pointcloud/PointCloudSpikeExperience'
import { BoudhaPrototypeExperience } from './prototype/BoudhaPrototypeExperience'
import { SurfaceReconstructionExperience } from './surface/SurfaceReconstructionExperience'
import { TechnicalSpikeApp } from './TechnicalSpikeApp'
import { experienceModeFromSearch } from './experienceMode'

function App() {
  const mode = experienceModeFromSearch(window.location.search)

  if (mode === 'technical') {
    return <TechnicalSpikeApp />
  }

  if (mode === 'pointcloud') {
    return <PointCloudSpikeExperience />
  }

  if (mode === 'surface') {
    return <SurfaceReconstructionExperience />
  }

  return <BoudhaPrototypeExperience />
}

export default App
