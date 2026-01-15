import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { OnboardingProvider } from './contexts/OnboardingContext'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <OnboardingProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </OnboardingProvider>
    </Router>
  )
}

export default App

