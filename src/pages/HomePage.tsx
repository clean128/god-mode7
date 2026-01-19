import { useNavigate } from 'react-router-dom'
import ThreeJSBackground from '../components/game/ThreeJSBackground'

export default function HomePage() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/map')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 relative overflow-hidden">
      {/* Three.js background effect */}
      <ThreeJSBackground />
      
      {/* Main content */}
      <div className="text-center max-w-md w-full relative z-10">
        <h1 className="font-display text-6xl md:text-7xl mb-6 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
          🎮 GodMode7
        </h1>
        
        <p className="font-body text-2xl text-white mb-10 font-bold drop-shadow-lg">
          Find customers near your business
        </p>

        <button
          onClick={handleStart}
          className="btn-game-primary w-full text-3xl py-6 shadow-2xl hover:scale-105 transition-transform flex justify-center items-center"
        >
          Let's Start! 🚀
        </button>
      </div>
    </div>
  )
}

