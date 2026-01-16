import { motion, AnimatePresence } from 'framer-motion'
import { useMapStore } from '../../store/mapStore'
import { useOnboarding } from '../../contexts/OnboardingContext'

interface OnboardingOverlayProps {
  currentStep: number
  onNext: () => void
  onCompleteStep: (step: number) => void
  onUnlockAchievement: (achievement: string) => void
}

export default function OnboardingOverlay({
  currentStep,
  onNext,
  onCompleteStep,
  onUnlockAchievement,
}: OnboardingOverlayProps) {
  const { businessLocation, selectedPin } = useMapStore()
  const { completedSteps, completeOnboarding } = useOnboarding()

  // Step 3: Wait for user to tap a pin
  if (currentStep === 3 && selectedPin) {
    onCompleteStep(3)
    onUnlockAchievement('Explorer!')
    setTimeout(() => {
      onNext()
    }, 1500)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return {
          title: 'Welcome to GodMode7! 🎮',
          message: "Let's find customers for your business in 4 simple steps",
          button: "Let's Start!",
          position: 'center' as const,
        }

      case 2:
        return {
          title: 'Find Your Business 📍',
          message: 'Type your business name in the search bar above',
          button: businessLocation ? 'Great! Next Step →' : 'Searching...',
          position: 'top' as const,
          highlight: 'search',
        }

      case 3:
        return {
          title: 'Explore Your Area 🗺️',
          message: businessLocation
            ? 'Tap on a pin to see customer information'
            : 'First, find your business location',
          button: selectedPin ? 'Awesome! Next →' : 'Tap a pin',
          position: 'center' as const,
          highlight: 'pins',
        }

      case 4:
        return {
          title: 'You\'re All Set! 🎉',
          message: 'You can now use GodMode7 to find and reach customers',
          button: 'Start Using GodMode7',
          position: 'center' as const,
        }

      default:
        return null
    }
  }

  const stepContent = renderStepContent()

  if (!stepContent) return null

  const { title, message, button, position, highlight } = stepContent

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'transform -translate-x-1/2'
      case 'center':
        return 'transform -translate-x-1/2 -translate-y-1/2'
      default:
        return 'transform -translate-x-1/2 -translate-y-1/2'
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
        onClick={currentStep === 1 ? onNext : undefined}
        style={{
          // Allow clicks through to search bar during step 2
          pointerEvents: currentStep === 2 ? 'none' : 'auto',
        }}
      >
        {/* Highlight overlay for specific elements */}
        {highlight === 'search' && (
          <div className="absolute top-4 left-4 right-4 z-50 flex justify-center">
            <div className="w-full max-w-xl">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute h-14 bg-yellow-400 bg-opacity-20 border-4 border-yellow-400 rounded-game pointer-events-none w-full max-w-xl"
                style={{ animation: 'pulse 2s infinite' }}
              />
            </div>
          </div>
        )}

        {/* Tooltip Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20 }}
          className={`absolute ${getPositionClasses()} z-50`}
          onClick={(e) => e.stopPropagation()}
          style={{
            // Ensure tooltip card is always clickable
            pointerEvents: 'auto',
            width: 'calc(100% - 2rem)',
            maxWidth: '28rem',
          }}
        >
          <div className="bg-white rounded-game p-6 shadow-2xl border-2 border-game-primary">
            <h3 className="font-display text-2xl text-gray-900 mb-2">{title}</h3>
            <p className="font-body text-base text-gray-700 mb-6">{message}</p>

            <div className="flex gap-3">
              {currentStep > 1 && completedSteps.size > 0 && (
                <button
                  onClick={() => {
                    onCompleteStep(currentStep)
                    completeOnboarding()
                  }}
                  className="btn-game-secondary flex-1"
                >
                  Skip
                </button>
              )}
              <button
                onClick={() => {
                  if (currentStep === 4) {
                    // Complete onboarding
                    completeOnboarding()
                    window.location.href = '/map'
                  } else {
                    onNext()
                  }
                }}
                className={`btn-game-primary ${currentStep > 1 && completedSteps.size > 0 ? 'flex-1' : 'w-full'}`}
                disabled={currentStep === 2 && !businessLocation}
              >
                {button}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

