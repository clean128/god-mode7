import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { useMapStore } from '../../store/mapStore'
import { l2Api } from '../../services/l2Api'
import { clusterPins, isCluster, type Cluster } from '../../utils/pinClustering'

interface MapContainerProps {
  map: mapboxgl.Map
}

export default function MapContainer({ map }: MapContainerProps) {
  const markersRef = useRef<mapboxgl.Marker[]>([])
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
        
        // Search for people within 5km radius
        const people = await l2Api.searchPeople(
          {},
          {
            lat,
            long: lng,
            radius: 5000, // 5km in meters
          },
          500
        )

        // Ensure people is an array
        if (!Array.isArray(people)) {
          console.error('Expected array but got:', typeof people, people)
          setError('Invalid response format from API. Expected array but got ' + typeof people)
          return
        }

        // Transform to pins
        const pins = people
          .filter((person: any) => {
            // Filter people with valid coordinates
            const personLat = person.Residence_Addresses_Latitude
            const personLng = person.Residence_Addresses_Longitude
            return personLat && personLng
          })
          .map((person: any) => ({
            id: person.LALVOTERID || `person-${Math.random()}`,
            coordinates: [
              parseFloat(person.Residence_Addresses_Longitude),
              parseFloat(person.Residence_Addresses_Latitude),
            ] as [number, number],
            data: person,
          }))

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

    // Fit map to show all pins (only on initial load)
    if (personPins.length > 0 && markersRef.current.length === clustered.length) {
      const bounds = new mapboxgl.LngLatBounds()
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

  // Center map on business location
  useEffect(() => {
    if (!map || !businessLocation) return

    map.flyTo({
      center: businessLocation.coordinates,
      zoom: 14,
      duration: 2000,
    })
  }, [map, businessLocation])

  return null
}

