import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import * as THREE from 'three'
import { useMapStore } from '../../store/mapStore'
import { l2Api } from '../../services/l2Api'
import { clusterPins, isCluster } from '../../utils/pinClustering'
import GameNotification from '../ui/GameNotification'

interface MapContainerProps {
  map: mapboxgl.Map
}

export default function MapContainer({ map }: MapContainerProps) {
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const businessMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const [currentZoom, setCurrentZoom] = useState(4)
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

  // Helper function to calculate distance between two coordinates in meters
  const getDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371000 // Earth radius in meters
    const lat1 = coord1[1] * Math.PI / 180
    const lat2 = coord2[1] * Math.PI / 180
    const deltaLat = (coord2[1] - coord1[1]) * Math.PI / 180
    const deltaLng = (coord2[0] - coord1[0]) * Math.PI / 180

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

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
        const radiusMeters = 30000 // 30km in meters
        
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

        // Transform to pins and filter by distance
        const businessCoords: [number, number] = [lng, lat]
        
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
            const distance = getDistance(businessCoords, personCoords)
            
            // Only include people within 30km
            if (distance > radiusMeters) {
              return null
            }
            
            return {
              id: person.LALVOTERID || `person-${Math.random()}`,
              coordinates: personCoords,
              data: person,
            }
          })
          .filter((pin): pin is NonNullable<typeof pin> => pin !== null)

        console.log(`✅ Created ${pins.length} pins from ${people.length} people (${people.length - pins.length} filtered out - ${people.length - pins.length} outside 30km or missing coordinates)`)
        
        // Only set pins if we have valid pins within 30km
        if (pins.length > 0) {
          setPersonPins(pins)
          // Show game-style notification
          setNotificationMessage(pins.length.toString())
          setShowNotification(true)
        } else {
          setPersonPins([])
          console.warn('⚠️ No people found within 30km with valid coordinates')
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

  // Track zoom level for clustering
  useEffect(() => {
    if (!map) return

    let lastZoom = map.getZoom()
    setCurrentZoom(lastZoom)

    const updateZoom = () => {
      const newZoom = map.getZoom()
      // Only update if zoom changed significantly (avoid infinite loops)
      if (Math.abs(newZoom - lastZoom) > 0.01) {
        lastZoom = newZoom
        setCurrentZoom(newZoom)
      }
    }

    map.on('zoom', updateZoom)
    map.on('zoomend', updateZoom)

    return () => {
      map.off('zoom', updateZoom)
      map.off('zoomend', updateZoom)
    }
  }, [map])

  // Render person pins on map with clustering
  useEffect(() => {
    if (!map || personPins.length === 0) return

    // Clear existing markers and cleanup Three.js resources
    markersRef.current.forEach(marker => {
      const element = marker.getElement()
      if (element && (element as any).__threeCleanup) {
        (element as any).__threeCleanup()
      }
      marker.remove()
    })
    markersRef.current = []

    // Cluster pins based on zoom level (radius in meters)
    const clustered = clusterPins(personPins, currentZoom, 100)

    // Create markers for clusters and individual pins
    clustered.forEach((item) => {
      if (isCluster(item)) {
        // Render cluster
        const el = document.createElement('div')
        el.className = 'person-pin-cluster'
        el.style.width = '48px'
        el.style.height = '48px'
        el.style.borderRadius = '50%'
        el.style.background = 'radial-gradient(circle, #FF6B35 0%, #FFD93D 100%)'
        el.style.border = '3px solid white'
        el.style.cursor = 'pointer'
        el.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.4)'
        el.style.display = 'flex'
        el.style.alignItems = 'center'
        el.style.justifyContent = 'center'
        el.style.fontSize = '16px'
        el.style.fontWeight = 'bold'
        el.style.color = 'white'
        el.innerHTML = item.count.toString()

        // Add hover effect
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.15)'
          el.style.transition = 'transform 0.2s'
        })
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)'
        })

        const marker = new mapboxgl.Marker(el)
          .setLngLat(item.coordinates)
          .addTo(map)

        // Click cluster to zoom in
        el.addEventListener('click', () => {
          map.flyTo({
            center: item.coordinates,
            zoom: Math.min(map.getZoom() + 2, 18),
            duration: 500,
          })
        })

        markersRef.current.push(marker)
      } else {
        // Render individual pin with Three.js effects - Game-style enhanced
        const el = document.createElement('div')
        el.className = 'person-pin'
        el.style.width = '48px'
        el.style.height = '48px'
        el.style.borderRadius = '50%'
        el.style.background = 'radial-gradient(circle, #00D9FF 0%, #4A90E2 50%, #357ABD 100%)'
        el.style.border = '4px solid white'
        el.style.cursor = 'pointer'
        el.style.boxShadow = '0 6px 20px rgba(0, 217, 255, 0.6), 0 0 30px rgba(0, 217, 255, 0.3)'
        el.style.display = 'flex'
        el.style.alignItems = 'center'
        el.style.justifyContent = 'center'
        el.style.fontSize = '28px'
        el.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        el.style.position = 'relative'
        el.style.overflow = 'hidden'
        el.innerHTML = '👤'

        // Create Three.js canvas for particle effects on pin
        const canvas = document.createElement('canvas')
        canvas.width = 48
        canvas.height = 48
        canvas.style.position = 'absolute'
        canvas.style.top = '0'
        canvas.style.left = '0'
        canvas.style.pointerEvents = 'none'
        canvas.style.opacity = '0.4'
        el.appendChild(canvas)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
        camera.position.z = 5

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
        renderer.setSize(48, 48)
        renderer.setClearColor(0x000000, 0)

        // Create particles for pin
        const particlesGeometry = new THREE.BufferGeometry()
        const particlesCount = 15
        const posArray = new Float32Array(particlesCount * 3)

        for (let i = 0; i < particlesCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 2
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

        const particlesMaterial = new THREE.PointsMaterial({
          size: 0.15,
          color: 0x00d9ff,
          transparent: true,
          opacity: 0.8,
        })

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
        scene.add(particlesMesh)

        let animationFrameId: number
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate)
          particlesMesh.rotation.y += 0.02
          particlesMesh.rotation.x += 0.01
          renderer.render(scene, camera)
        }
        animate()

        // Store cleanup function
        ;(el as any).__threeCleanup = () => {
          cancelAnimationFrame(animationFrameId)
          renderer.dispose()
          particlesGeometry.dispose()
          particlesMaterial.dispose()
        }

        // Add CSS animation for pulse effect
        const style = document.createElement('style')
        style.textContent = `
          @keyframes pulse {
            0%, 100% { box-shadow: 0 6px 20px rgba(0, 217, 255, 0.6), 0 0 30px rgba(0, 217, 255, 0.3); }
            50% { box-shadow: 0 8px 25px rgba(0, 217, 255, 0.8), 0 0 40px rgba(0, 217, 255, 0.5); }
          }
        `
        if (!document.head.querySelector('style[data-pin-animation]')) {
          style.setAttribute('data-pin-animation', 'true')
          document.head.appendChild(style)
        }

        // Add hover effect with bounce
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.3) rotate(5deg)'
          el.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
          el.style.boxShadow = '0 10px 30px rgba(0, 217, 255, 0.8), 0 0 50px rgba(0, 217, 255, 0.6)'
        })
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1) rotate(0deg)'
          el.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        })

        const marker = new mapboxgl.Marker(el)
          .setLngLat(item.coordinates)
          .addTo(map)

        // Add click handler
        el.addEventListener('click', () => {
          const { setSelectedPin } = useMapStore.getState()
          setSelectedPin(item)
        })

        markersRef.current.push(marker)
      }
    })

    // Fit map to show all pins and business location (only on initial load)
    if (personPins.length > 0 && markersRef.current.length === clustered.length) {
      const bounds = new mapboxgl.LngLatBounds()
      
      // Include business location if available
      if (businessLocation) {
        bounds.extend(businessLocation.coordinates)
      }
      
      // Include all person pins
      personPins.forEach(pin => bounds.extend(pin.coordinates))
      
      map.fitBounds(bounds, {
        padding: 100,
        maxZoom: 15,
      })
    }

    return () => {
      // Cleanup Three.js resources and remove markers
      markersRef.current.forEach(marker => {
        const element = marker.getElement()
        if (element && (element as any).__threeCleanup) {
          (element as any).__threeCleanup()
        }
        marker.remove()
      })
      markersRef.current = []
    }
  }, [map, personPins, currentZoom])

  // Render business location pin
  useEffect(() => {
    if (!map || !businessLocation) {
      // Remove business marker if no location
      if (businessMarkerRef.current) {
        businessMarkerRef.current.remove()
        businessMarkerRef.current = null
      }
      return
    }

    // Remove existing business marker
    if (businessMarkerRef.current) {
      businessMarkerRef.current.remove()
    }

    // Create business location pin (distinct from person pins)
    const el = document.createElement('div')
    el.className = 'business-pin'
    el.style.width = '48px'
    el.style.height = '48px'
    el.style.borderRadius = '50%'
    el.style.background = 'radial-gradient(circle, #A855F7 0%, #7C3AED 100%)'
    el.style.border = '4px solid white'
    el.style.cursor = 'pointer'
    el.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.5)'
    el.style.display = 'flex'
    el.style.alignItems = 'center'
    el.style.justifyContent = 'center'
    el.style.fontSize = '24px'
    el.style.zIndex = '10'
    el.innerHTML = '📍'

    // Add click handler to show business info
    el.addEventListener('click', () => {
      map.flyTo({
        center: businessLocation.coordinates,
        zoom: Math.max(map.getZoom(), 15),
        duration: 500,
      })
    })

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat(businessLocation.coordinates)
      .addTo(map)

    businessMarkerRef.current = marker

    // Center map on business location
    map.flyTo({
      center: businessLocation.coordinates,
      zoom: 14,
      duration: 2000,
    })

    return () => {
      if (businessMarkerRef.current) {
        businessMarkerRef.current.remove()
        businessMarkerRef.current = null
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

