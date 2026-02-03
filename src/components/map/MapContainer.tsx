import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useMapStore } from '../../store/mapStore'
import { l2Api } from '../../services/l2Api'
import GameNotification from '../ui/GameNotification'

interface MapContainerProps {
  map: mapboxgl.Map
}

export default function MapContainer({ map }: MapContainerProps) {
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const businessMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const {
    businessLocation,
    personPins,
    setPersonPins,
    setLoading,
    setError,
  } = useMapStore()

  const handleCloseNotification = useCallback(() => {
    setShowNotification(false)
  }, [])

  // Load person data when business location is set
  useEffect(() => {
    if (!businessLocation || !map) {
      // Clear pins if no business location
      setPersonPins([])
      return
    }

    const loadPeopleData = async () => {
      setLoading(true)
      setError(null)

      try {
        const [lng, lat] = businessLocation.coordinates
        const radiusMeters = 1 // 30km in meters (not 1!)
        
        // Search for people within 30km radius from business location
        console.log('🔍 Searching for people within 30km of business:', { lat, lng, radius: radiusMeters })
        const people = await l2Api.searchPeople(
          {},
          {
            lat,
            long: lng,
            radius: radiusMeters,
          },
          500
        )

        console.log('👥 People data received:', {
          type: typeof people,
          isArray: Array.isArray(people),
          length: Array.isArray(people) ? people.length : 0,
          firstPerson: Array.isArray(people) && people.length > 0 ? people[0] : null,
        })

        // Ensure people is an array
        if (!Array.isArray(people)) {
          console.error('❌ Expected array but got:', typeof people, people)
          setError('Invalid response format from API. Expected array but got ' + typeof people)
          return
        }

        if (people.length === 0) {
          console.warn('⚠️ No people found within 30km radius')
          setShowNotification(true)
          setNotificationMessage(people.length.toString())
          setPersonPins([])
          setLoading(false)
          return
        }

        // Log first person's available fields to debug coordinate field names
        if (people.length > 0) {
          const firstPerson = people[0]
          const coordinateFields = Object.keys(firstPerson).filter(key => 
            key.toLowerCase().includes('lat') || 
            key.toLowerCase().includes('lng') || 
            key.toLowerCase().includes('long') ||
            key.toLowerCase().includes('lon')
          )
          console.log('📍 Available coordinate fields in person data:', coordinateFields)
          console.log('📋 Sample person fields:', Object.keys(firstPerson).slice(0, 20))
        }

        // Transform to pins (API already returns people within radius)
        const pins = people
          .map((person: any) => {
            // Try multiple possible coordinate field names
            let personLat = person.Residence_Addresses_Latitude ||
                           person.Latitude ||
                           person.latitude ||
                           person.LAT ||
                           person.Residence_Latitude ||
                           person.Address_Latitude

            let personLng = person.Residence_Addresses_Longitude ||
                           person.Longitude ||
                           person.longitude ||
                           person.LONG ||
                           person.LON ||
                           person.Residence_Longitude ||
                           person.Address_Longitude

            // If still not found, check nested objects
            if (!personLat && person.Residence_Addresses) {
              personLat = person.Residence_Addresses.Latitude || person.Residence_Addresses.latitude
            }
            if (!personLng && person.Residence_Addresses) {
              personLng = person.Residence_Addresses.Longitude || person.Residence_Addresses.longitude
            }

            const hasValidCoords = personLat != null && personLng != null &&
                                 !isNaN(parseFloat(personLat)) &&
                                 !isNaN(parseFloat(personLng))

            if (!hasValidCoords) {
              return null
            }

            const personCoords: [number, number] = [parseFloat(personLng), parseFloat(personLat)]

            return {
              id: person.LALVOTERID || `person-${Math.random()}`,
              coordinates: personCoords,
              data: person,
            }
          })
          .filter((pin): pin is NonNullable<typeof pin> => pin !== null)

        console.log(`✅ Created ${pins.length} pins from ${people.length} people (${people.length - pins.length} excluded — missing coordinates)`)
        
        // Set pins when we have valid results
        if (pins.length > 0) {
          setPersonPins(pins)
          // Show game-style notification
          setNotificationMessage(pins.length.toString())
          setShowNotification(true)
        } else {
          setPersonPins([])
          setNotificationMessage(pins.length.toString())
          setShowNotification(true)
        }
      } catch (error: any) {
        console.error('Error loading people data:', error)
        setError(error.message || 'Failed to load people data')
      } finally {
        setLoading(false)
      }
    }

    loadPeopleData()
  }, [businessLocation, map, setPersonPins, setLoading, setError])

  // Render person pins on map
  useEffect(() => {
    if (!map || personPins.length === 0) {
      return
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      marker.remove()
    })
    markersRef.current = []

    // Detect mobile and limit pins for better performance
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const maxPins = isMobile ? 200 : 500 // Limit pins on mobile
    const pinsToRender = personPins.slice(0, maxPins)

    if (personPins.length > maxPins) {
      console.warn(`⚠️ Limited pins to ${maxPins} for performance (${personPins.length} total available)`)
    }

    // Create person pin markers using gender-specific pin images
    pinsToRender.forEach((item) => {
      // Determine gender from person data
      const gender = item.data.Gender || item.data.Voters_Gender || ''
      const isMale = gender === 'M' || gender === 'Male'
      const isFemale = gender === 'F' || gender === 'Female'
      
      // Select appropriate pin image based on gender
      const pinImage = isMale ? '/icons/male_pin.png' : 
                       isFemale ? '/icons/female_pin.png' : 
                       '/icons/male_pin.png' // Default to male pin if gender unknown
      
      // Create lightweight image-based pin
      const el = document.createElement('img')
      el.src = pinImage
      el.className = 'person-pin'
      el.style.width = '40px'
      el.style.height = '50px'
      el.style.cursor = 'pointer'
      el.style.willChange = 'transform'
      el.style.objectFit = 'contain'

      const marker = new mapboxgl.Marker({ 
        element: el,
        anchor: 'bottom'
      })
        .setLngLat(item.coordinates)
        .addTo(map)

      // Mobile-optimized touch handling
      let touchStartTime = 0
      let touchMoved = false

      const handleTouchStart = () => {
        touchStartTime = Date.now()
        touchMoved = false
      }

      const handleTouchMove = () => {
        touchMoved = true
      }

      const handleTouchEnd = () => {
        const touchDuration = Date.now() - touchStartTime
        // Only trigger if it's a quick tap (not a drag) and < 300ms
        if (!touchMoved && touchDuration < 300) {
          const { setSelectedPin } = useMapStore.getState()
          setSelectedPin(item)
        }
      }

      const handleClick = (e: MouseEvent) => {
        e.stopPropagation()
        const { setSelectedPin } = useMapStore.getState()
        setSelectedPin(item)
      }

      el.addEventListener('touchstart', handleTouchStart, { passive: true })
      el.addEventListener('touchmove', handleTouchMove, { passive: true })
      el.addEventListener('touchend', handleTouchEnd, { passive: true })
      el.addEventListener('click', handleClick)

      markersRef.current.push(marker)
    })

    return () => {
      // Remove markers
      markersRef.current.forEach(marker => {
        marker.remove()
      })
      markersRef.current = []
    }
  }, [map, personPins])

  // Render business location pin with 3D model
  const businessPin3DSceneRef = useRef<THREE.Scene | null>(null)
  const businessPin3DRendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const businessPin3DCameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const businessPin3DModelRef = useRef<THREE.Group | null>(null)
  const businessPin3DAnimationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!map || !businessLocation) {
      // Remove business marker if no location
      if (businessMarkerRef.current) {
        businessMarkerRef.current.remove()
        businessMarkerRef.current = null
      }
      // Cleanup 3D resources
      if (businessPin3DAnimationRef.current) {
        cancelAnimationFrame(businessPin3DAnimationRef.current)
      }
      if (businessPin3DRendererRef.current) {
        businessPin3DRendererRef.current.dispose()
      }
      return
    }

    // Remove existing business marker
    if (businessMarkerRef.current) {
      businessMarkerRef.current.remove()
      businessMarkerRef.current = null
    }

    // Create container for 3D pin
    const el = document.createElement('div')
    el.className = 'business-pin-3d'
    el.style.width = '80px'
    el.style.height = '80px'
    el.style.cursor = 'pointer'
    el.style.zIndex = '10'
    el.style.pointerEvents = 'auto'

    // Set up Three.js scene for 3D pin
    const width = 80
    const height = 80
    const scene = new THREE.Scene()
    businessPin3DSceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 3)
    camera.lookAt(0, 0, 0)
    businessPin3DCameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      preserveDrawingBuffer: true
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)
    businessPin3DRendererRef.current = renderer

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
        const model = gltf.scene.clone()
        
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        
        // Center the model
        model.position.x = -center.x
        model.position.y = -center.y
        model.position.z = -center.z
        
        // Scale to fit nicely in view
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 1.5 / maxDim
        model.scale.multiplyScalar(scale)
        
        // Rotate if needed (adjust rotation based on model orientation)
        // model.rotation.x = Math.PI // Uncomment if pin is upside down
        
        scene.add(model)
        businessPin3DModelRef.current = model

        // Animation loop
        const animate = () => {
          if (!businessPin3DModelRef.current || !renderer || !camera) return
          
          businessPin3DAnimationRef.current = requestAnimationFrame(animate)
          
          // Optional: Add slight rotation animation
          // businessPin3DModelRef.current.rotation.y += 0.01
          
          renderer.render(scene, camera)
        }
        
        animate()

        // Create marker with 3D pin
        const marker = new mapboxgl.Marker({ 
          element: el,
          anchor: 'bottom'
        })
          .setLngLat(businessLocation.coordinates)
          .addTo(map)

        businessMarkerRef.current = marker

        // Center map on business at zoom 17
        map.flyTo({
          center: businessLocation.coordinates,
          zoom: 18,
          duration: 2000,
        })
      },
      (progress) => {
        console.log('Loading 3D pin model:', (progress.loaded / progress.total) * 100 + '%')
      },
      (error) => {
        console.error('Error loading 3D pin model:', error)
        // Fallback to simple pin if 3D model fails to load
        const fallbackEl = document.createElement('div')
        fallbackEl.innerHTML = '📍'
        fallbackEl.style.fontSize = '32px'
        fallbackEl.style.cursor = 'pointer'
        
        const marker = new mapboxgl.Marker({ 
          element: fallbackEl,
          anchor: 'bottom'
        })
          .setLngLat(businessLocation.coordinates)
          .addTo(map)

        businessMarkerRef.current = marker
      }
    )

    // Add click handler — pan to business, keep zoom
    el.addEventListener('click', () => {
      map.flyTo({
        center: businessLocation.coordinates,
        duration: 500,
      })
    })

    return () => {
      if (businessMarkerRef.current) {
        businessMarkerRef.current.remove()
        businessMarkerRef.current = null
      }
      if (businessPin3DAnimationRef.current) {
        cancelAnimationFrame(businessPin3DAnimationRef.current)
      }
      if (businessPin3DRendererRef.current) {
        businessPin3DRendererRef.current.dispose()
      }
      if (businessPin3DModelRef.current) {
        businessPin3DModelRef.current.traverse((object) => {
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
  }, [map, businessLocation])

  return (
    <>
      <GameNotification
        message={notificationMessage}
        isVisible={showNotification}
        onClose={handleCloseNotification}
        duration={3000}
      />
    </>
  )
}