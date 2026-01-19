import mapboxgl from 'mapbox-gl'

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ''

if (!MAPBOX_ACCESS_TOKEN) {
  console.warn('Mapbox access token not found. Please set VITE_MAPBOX_ACCESS_TOKEN in .env')
}

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

interface GeocodeResult {
  place_name?: string
  name?: string
  center?: [number, number]
  geometry: {
    coordinates: [number, number]
  }
  properties?: {
    name?: string
    full_address?: string
    address_line1?: string
    [key: string]: any
  }
  context?: Array<{
    id: string
    text: string
  }>
}

/**
 * Search for businesses using Mapbox Search Box API
 * Better for business name searches with improved POI coverage
 */
export async function searchBusiness(query: string): Promise<GeocodeResult[]> {
  if (!MAPBOX_ACCESS_TOKEN) {
    throw new Error('Mapbox access token is not configured. Please set VITE_MAPBOX_ACCESS_TOKEN in your .env file.')
  }

  try {
    // Use Mapbox Search Box API for better business name search
    const url = 'https://api.mapbox.com/search/searchbox/v1/forward'
    const params = new URLSearchParams({
      q: query, // Business name or search query
      access_token: MAPBOX_ACCESS_TOKEN,
      limit: '10',
      types: 'poi,address', // Points of interest and addresses
      language: 'en',
    })

    const response = await fetch(`${url}?${params}`)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Mapbox Search Box API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error || 'Mapbox Search Box API returned an error')
    }

    // Search Box API returns features in data.features
    // Transform to match GeocodeResult interface
    const features = (data.features || []).map((feature: any) => {
      // Mapbox Search Box API response structure
      const coords = feature.geometry?.coordinates || feature.center || [0, 0]
      
      // Ensure place_name exists (combine properties.name with address if available)
      const placeName = feature.properties?.name || 
                       feature.properties?.full_address || 
                       feature.place_name || 
                       feature.properties?.address_line1 || 
                       'Unknown location'
      
      return {
        ...feature,
        place_name: placeName,
        center: coords,
        geometry: {
          coordinates: coords,
          ...feature.geometry
        },
        properties: {
          ...feature.properties,
          name: feature.properties?.name || placeName
        }
      } as GeocodeResult
    })
    
    console.log('Mapbox Search Box API results:', {
      query,
      resultsCount: features.length,
      features: features.map((f: any) => ({
        name: f.place_name || f.properties?.name,
        coordinates: f.geometry?.coordinates || f.center
      }))
    })

    return features
  } catch (error: any) {
    console.error('Mapbox Search Box API Error:', error)
    // Re-throw with more context
    if (error.message) {
      throw error
    }
    throw new Error('Failed to search. Please check your internet connection and Mapbox API token.')
  }
}

/**
 * Reverse geocode - get address from coordinates
 */
export async function reverseGeocode(lng: number, lat: number): Promise<GeocodeResult | null> {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`
    const params = new URLSearchParams({
      access_token: MAPBOX_ACCESS_TOKEN,
      limit: '1',
    })

    const response = await fetch(`${url}?${params}`)
    const data = await response.json()

    return data.features?.[0] as GeocodeResult || null
  } catch (error) {
    console.error('Mapbox Reverse Geocoding Error:', error)
    return null
  }
}

export { mapboxgl }

