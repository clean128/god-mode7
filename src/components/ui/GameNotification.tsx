import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

interface GameNotificationProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export default function GameNotification({ message, isVisible, onClose, duration = 3000 }: GameNotificationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const particlesMeshRef = useRef<THREE.Points | null>(null)
  const particlesGeometryRef = useRef<THREE.BufferGeometry | null>(null)
  const particlesMaterialRef = useRef<THREE.PointsMaterial | null>(null)

  useEffect(() => {
    if (!isVisible || !containerRef.current) {
      // Cleanup when not visible
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      if (rendererRef.current) {
        if (rendererRef.current.domElement.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement)
        }
        rendererRef.current.dispose()
        rendererRef.current = null
      }
      if (particlesGeometryRef.current) {
        particlesGeometryRef.current.dispose()
        particlesGeometryRef.current = null
      }
      if (particlesMaterialRef.current) {
        particlesMaterialRef.current.dispose()
        particlesMaterialRef.current = null
      }
      particlesMeshRef.current = null
      sceneRef.current = null
      return
    }

    // Don't recreate if already exists
    if (rendererRef.current) return

    // Create Three.js scene for particle effects
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, 200 / 100, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(200, 100)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometryRef.current = particlesGeometry
    const particlesCount = 30
    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 4
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.8,
    })
    particlesMaterialRef.current = particlesMaterial

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    particlesMeshRef.current = particlesMesh
    scene.add(particlesMesh)

    const animate = () => {
      if (!rendererRef.current || !particlesMeshRef.current) return
      animationFrameRef.current = requestAnimationFrame(animate)
      particlesMeshRef.current.rotation.y += 0.02
      particlesMeshRef.current.rotation.x += 0.01
      rendererRef.current.render(scene, camera)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      if (rendererRef.current) {
        if (rendererRef.current.domElement.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement)
        }
        rendererRef.current.dispose()
        rendererRef.current = null
      }
      if (particlesGeometryRef.current) {
        particlesGeometryRef.current.dispose()
        particlesGeometryRef.current = null
      }
      if (particlesMaterialRef.current) {
        particlesMaterialRef.current.dispose()
        particlesMaterialRef.current = null
      }
      particlesMeshRef.current = null
      sceneRef.current = null
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return
    
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    
    return () => {
      clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, x: 100, scale: 0.9, rotate: 5 }}
          transition={{ 
            type: 'spring', 
            damping: 15, 
            stiffness: 300,
            rotate: { type: 'spring', damping: 20 }
          }}
          className="fixed top-20 right-4 z-[60]"
        >
          <div 
            onClick={onClose}
            className="bg-gradient-to-br from-game-primary to-game-primary-dark rounded-game px-5 py-3 shadow-2xl border-3 border-white flex items-center gap-3 min-w-[120px] max-w-xs relative overflow-hidden cursor-pointer"
          >
            {/* Three.js particle background */}
            <div 
              ref={containerRef}
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{ width: '150px', height: '80px', position: 'absolute', right: '-40px', top: '-15px' }}
            />
            
            <span className="text-2xl animate-bounce relative z-10">👥</span>
            <div className="flex-1 relative z-10">
              <p className="font-display text-xl font-bold text-white uppercase tracking-wide">
                {message}
              </p>
              <p className="font-body text-xs text-white/90 mt-0.5">people found within 30km</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors text-white text-lg font-bold relative z-10"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
