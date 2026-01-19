import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface BusinessPin3DProps {
  onReady: (element: HTMLDivElement) => void
}

export default function BusinessPin3D({ onReady }: BusinessPin3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = 80
    const height = 80

    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 3)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      preserveDrawingBuffer: true
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0) // Transparent background
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Load GLB model
    const loader = new GLTFLoader()
    loader.load(
      '/models/map_pin_location_pin.glb',
      (gltf) => {
        const model = gltf.scene
        
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        
        // Center the model
        model.position.x = -center.x
        model.position.y = -center.y
        model.position.z = -center.z
        
        // Scale to fit nicely in view (adjust scale as needed)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 1.5 / maxDim
        model.scale.multiplyScalar(scale)
        
        // Rotate if needed (pin might be oriented incorrectly)
        model.rotation.x = Math.PI // Rotate 180 degrees if needed
        
        scene.add(model)
        modelRef.current = model

        // Start animation loop
        const animate = () => {
          if (!modelRef.current || !rendererRef.current || !cameraRef.current) return
          
          animationFrameRef.current = requestAnimationFrame(animate)
          
          // Optional: Add slight rotation animation
          if (modelRef.current) {
            // modelRef.current.rotation.y += 0.01 // Uncomment for rotation
          }
          
          rendererRef.current.render(scene, cameraRef.current)
        }
        
        animate()

        // Notify parent that element is ready
        if (onReady && containerRef.current) {
          onReady(containerRef.current)
        }
      },
      (progress) => {
        // Loading progress
        console.log('Loading 3D pin model:', (progress.loaded / progress.total) * 100 + '%')
      },
      (error) => {
        console.error('Error loading 3D pin model:', error)
      }
    )

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (rendererRef.current && containerRef.current) {
        if (rendererRef.current.domElement.parentNode) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
        rendererRef.current.dispose()
      }
      if (modelRef.current) {
        // Dispose of model geometries and materials
        modelRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose()
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose())
            } else {
              object.material.dispose()
            }
          }
        })
      }
    }
  }, [onReady])

  return <div ref={containerRef} style={{ width: '80px', height: '80px' }} />
}
