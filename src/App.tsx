import { PointCloudSpikeExperience } from './pointcloud/PointCloudSpikeExperience'
import { BoudhaPrototypeExperience } from './prototype/BoudhaPrototypeExperience'
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

  return <BoudhaPrototypeExperience />
}

export default App
