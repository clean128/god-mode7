interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const percentage = (currentStep / totalSteps) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="font-body text-sm font-semibold text-gray-600">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="font-body text-sm font-semibold text-gray-600">
          {Math.round(percentage)}%
        </span>
      </div>
      
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-game-success to-game-success-dark rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

