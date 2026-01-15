import mapboxgl from 'mapbox-gl'

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ''

if (!MAPBOX_ACCESS_TOKEN) {
  console.warn('Mapbox access token not found. Please set VITE_MAPBOX_ACCESS_TOKEN in .env')
}

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN

interface GeocodeResult {
  place_name: string
  center: [number, number]
  geometry: {
    coordinates: [number, number]
  }
  context?: Array<{
    id: string
    text: string
  }>
}

/**
 * Search for businesses using Mapbox Geocoding API
 */
export async function searchBusiness(query: string): Promise<GeocodeResult[]> {
  if (!MAPBOX_ACCESS_TOKEN) {
    throw new Error('Mapbox access token is not configured. Please set VITE_MAPBOX_ACCESS_TOKEN in your .env file.')
  }

  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`
    const params = new URLSearchParams({
      access_token: MAPBOX_ACCESS_TOKEN,
      types: 'poi,address', // Points of interest and addresses
      limit: '10',
    })

    const response = await fetch(`${url}?${params}`)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Mapbox API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error || 'Mapbox API returned an error')
    }

    return (data.features || []) as GeocodeResult[]
  } catch (error: any) {
    console.error('Mapbox Geocoding Error:', error)
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

