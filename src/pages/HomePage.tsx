import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../contexts/OnboardingContext'
import ProgressIndicator from '../components/onboarding/ProgressIndicator'
import AchievementBadge from '../components/game/AchievementBadge'
import ThreeJSBackground from '../components/game/ThreeJSBackground'

export default function HomePage() {
  const navigate = useNavigate()
  const { isFirstTime, currentStep, totalSteps, startOnboarding, achievements } = useOnboarding()

  useEffect(() => {
    if (isFirstTime) {
      startOnboarding()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstTime]) // startOnboarding is memoized, safe to exclude

  const handleStart = () => {
    if (isFirstTime) {
      // Start onboarding walkthrough
      const searchParams = new URLSearchParams({ step: '1' })
      navigate(`/map?${searchParams.toString()}`)
    } else {
      // Go directly to map
      navigate('/map')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Three.js background effect */}
      <ThreeJSBackground />
      {/* Achievement badges */}
      {achievements.length > 0 && (
        <div className="absolute top-6 right-6 flex gap-2">
          {achievements.map((achievement) => (
            <AchievementBadge key={achievement} achievement={achievement} />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="text-center max-w-md w-full">
        <h1 className="font-display text-5xl md:text-6xl mb-4 bg-gradient-to-r from-game-primary to-game-primary-dark bg-clip-text text-transparent">
          🎮 GodMode7
        </h1>
        
        <p className="font-body text-xl text-gray-700 mb-8">
          Find customers like playing a video game
        </p>

        {isFirstTime && (
          <p className="font-body text-base text-gray-600 mb-6">
            We'll help you find customers in 4 simple steps
          </p>
        )}

        <button
          onClick={handleStart}
          className="btn-game-primary w-full mb-6"
        >
          {isFirstTime ? "Let's Start! 🚀" : "Go to Map"}
        </button>

        {isFirstTime && (
          <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        )}
      </div>
    </div>
  )
}

