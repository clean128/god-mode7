import { createContext, useContext, useState, ReactNode } from 'react'

interface OnboardingContextType {
  isFirstTime: boolean
  currentStep: number
  totalSteps: number
  completedSteps: Set<number>
  achievements: string[]
  startOnboarding: () => void
  nextStep: () => void
  completeStep: (step: number) => void
  unlockAchievement: (achievement: string) => void
  completeOnboarding: () => void
  skipOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isFirstTime, setIsFirstTime] = useState(() => {
    const completed = localStorage.getItem('onboarding_completed')
    return !completed
  })
  
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [achievements, setAchievements] = useState<string[]>([])

  const totalSteps = 4

  const startOnboarding = () => {
    setCurrentStep(1)
    setCompletedSteps(new Set())
    setAchievements([])
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const completeStep = (step: number) => {
    setCompletedSteps(prev => new Set([...prev, step]))
  }

  const unlockAchievement = (achievement: string) => {
    setAchievements(prev => [...prev, achievement])
  }

  const completeOnboarding = () => {
    setIsFirstTime(false)
    localStorage.setItem('onboarding_completed', 'true')
    setCurrentStep(totalSteps)
  }

  const skipOnboarding = () => {
    if (completedSteps.size > 0) {
      setIsFirstTime(false)
      localStorage.setItem('onboarding_completed', 'true')
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        isFirstTime,
        currentStep,
        totalSteps,
        completedSteps,
        achievements,
        startOnboarding,
        nextStep,
        completeStep,
        unlockAchievement,
        completeOnboarding,
        skipOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}

