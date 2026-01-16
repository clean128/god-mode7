import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { useMapStore } from '../../store/mapStore'
import { l2Api } from '../../services/l2Api'
import { clusterPins, isCluster } from '../../utils/pinClustering'

interface MapContainerProps {
  map: mapboxgl.Map
}

export default function MapContainer({ map }: MapContainerProps) {
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const businessMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const [currentZoom, setCurrentZoom] = useState(4)
  const {
    businessLocation,
    personPins,
    setPersonPins,
    setLoading,
    setError,
  } = useMapStore()

  // Load person data when business location is set
  useEffect(() => {
    if (!businessLocation || !map) return

    const loadPeopleData = async () => {
      setLoading(true)
      setError(null)

      try {
        const [lng, lat] = businessLocation.coordinates
        
        // Search for people within 30km radius from business location
        console.log('🔍 Searching for people within 30km of business:', { lat, lng, radius: 30000 })
        const people = await l2Api.searchPeople(
          {},
          {
            lat,
            long: lng,
            radius: 30000, // 30km in meters
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

        // Transform to pins
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
              console.warn('⚠️ Person missing coordinates:', {
                id: person.LALVOTERID,
                availableFields: Object.keys(person).filter(k => 
                  k.toLowerCase().includes('lat') || k.toLowerCase().includes('lng') || k.toLowerCase().includes('long')
                ),
              })
              return null
            }
            
            return {
              id: person.LALVOTERID || `person-${Math.random()}`,
              coordinates: [
                parseFloat(personLng),
                parseFloat(personLat),
              ] as [number, number],
              data: person,
            }
          })
          .filter((pin): pin is NonNullable<typeof pin> => pin !== null)

        console.log(`✅ Created ${pins.length} pins from ${people.length} people (${people.length - pins.length} filtered out)`)
        setPersonPins(pins)
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

    const updateZoom = () => {
      setCurrentZoom(map.getZoom())
    }

    map.on('zoom', updateZoom)
    map.on('zoomend', updateZoom)
    updateZoom() // Initial zoom

    return () => {
      map.off('zoom', updateZoom)
      map.off('zoomend', updateZoom)
    }
  }, [map])

  // Render person pins on map with clustering
  useEffect(() => {
    if (!map || personPins.length === 0) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
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
        // Render individual pin
        const el = document.createElement('div')
        el.className = 'person-pin'
        el.style.width = '36px'
        el.style.height = '36px'
        el.style.borderRadius = '50%'
        el.style.background = 'radial-gradient(circle, #00D9FF 0%, #4A90E2 100%)'
        el.style.border = '3px solid white'
        el.style.cursor = 'pointer'
        el.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.4)'
        el.style.display = 'flex'
        el.style.alignItems = 'center'
        el.style.justifyContent = 'center'
        el.style.fontSize = '20px'
        el.innerHTML = '👤'

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
      markersRef.current.forEach(marker => marker.remove())
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

  return null
}

