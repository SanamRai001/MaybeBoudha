import { BoudhaPrototypeExperience } from './prototype/BoudhaPrototypeExperience'
import { TechnicalSpikeApp } from './TechnicalSpikeApp'
import { experienceModeFromSearch } from './experienceMode'

function App() {
  const mode = experienceModeFromSearch(window.location.search)

  return mode === 'technical'
    ? <TechnicalSpikeApp />
    : <BoudhaPrototypeExperience />
}

export default App
