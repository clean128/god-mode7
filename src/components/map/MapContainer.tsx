import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { useMapStore } from '../../store/mapStore'
import { l2Api } from '../../services/l2Api'
import GameNotification from '../ui/GameNotification'

interface MapContainerProps {
  map: mapboxgl.Map
}

export default function MapContainer({ map }: MapContainerProps) {
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const businessMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const hasFittedBoundsRef = useRef(false)
  const lastPersonPinsCountRef = useRef(0)
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

  // Render person pins on map with clustering
  useEffect(() => {
    if (!map || personPins.length === 0) {
      // Reset fit bounds flag when pins are cleared
      hasFittedBoundsRef.current = false
      lastPersonPinsCountRef.current = 0
      return
    }

    // Check if this is a new set of pins (different count than before)
    const isNewPinSet = personPins.length !== lastPersonPinsCountRef.current
    if (isNewPinSet) {
      // Reset fit bounds flag for new pin set
      hasFittedBoundsRef.current = false
      lastPersonPinsCountRef.current = personPins.length
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      marker.remove()
    })
    markersRef.current = []

    // Display all individual pins (no clustering)
    personPins.forEach((item) => {
        // Render individual pin - Game-style enhanced
        const el = document.createElement('div')
        el.className = 'person-pin'
        el.style.width = '48px'
        el.style.height = '48px'
        el.style.borderRadius = '50%'
        el.style.background = 'radial-gradient(circle, #00D9FF 0%, #4A90E2 50%, #357ABD 100%)'
        el.style.border = '4px solid white'
        el.style.boxShadow = '0 6px 20px rgba(0, 217, 255, 0.6), 0 0 30px rgba(0, 217, 255, 0.3)'
        el.style.display = 'flex'
        el.style.alignItems = 'center'
        el.style.justifyContent = 'center'
        el.style.fontSize = '28px'
        el.style.cursor = 'pointer'
        el.innerHTML = '👤'

        const marker = new mapboxgl.Marker({ 
          element: el,
          anchor: 'center'
        })
          .setLngLat(item.coordinates)
          .addTo(map)

        // Track if user is dragging to distinguish from click
        let isDragging = false
        let dragStartX = 0
        let dragStartY = 0

        el.addEventListener('mousedown', (e) => {
          if (e.button === 0) {
            dragStartX = e.clientX
            dragStartY = e.clientY
            isDragging = false

            const onMouseMove = (moveEvent: MouseEvent) => {
              const deltaX = Math.abs(moveEvent.clientX - dragStartX)
              const deltaY = Math.abs(moveEvent.clientY - dragStartY)
              if (deltaX > 3 || deltaY > 3) {
                isDragging = true
                // Temporarily disable pointer events to allow map drag
                el.style.pointerEvents = 'none'
              }
            }

            const onMouseUp = () => {
              if (!isDragging) {
                // It was a click, not a drag - show person modal
                const { setSelectedPin } = useMapStore.getState()
                setSelectedPin(item)
              }
              // Restore pointer events
              el.style.pointerEvents = 'auto'
              document.removeEventListener('mousemove', onMouseMove)
              document.removeEventListener('mouseup', onMouseUp)
            }

            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
          }
        })

        // Allow wheel events to pass through for zooming
        el.addEventListener('wheel', () => {
          // Don't stop propagation - let map handle zoom
        }, { passive: true })

        markersRef.current.push(marker)
    })

    // Fit map to show all pins and business location (only once per new pin set)
    if (!hasFittedBoundsRef.current && personPins.length > 0 && markersRef.current.length === personPins.length) {
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
      
      // Mark that we've fitted bounds for this pin set
      hasFittedBoundsRef.current = true
    }

    return () => {
      // Remove markers
      markersRef.current.forEach(marker => {
        marker.remove()
      })
      markersRef.current = []
    }
  }, [map, personPins, businessLocation])

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

