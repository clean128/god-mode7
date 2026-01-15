/**
 * Pin clustering utility for Mapbox
 * Groups nearby pins together for better performance
 */

interface Pin {
  id: string
  coordinates: [number, number]
  data: any
}

interface Cluster {
  id: string
  coordinates: [number, number]
  pins: Pin[]
  count: number
}

/**
 * Simple distance-based clustering
 * Groups pins within a certain distance together
 * Uses geographic distance in meters
 */
export function clusterPins(
  pins: Pin[],
  zoom: number,
  clusterRadiusMeters: number = 100 // meters
): (Pin | Cluster)[] {
  if (pins.length === 0) return []

  // At high zoom levels (15+), don't cluster - show individual pins
  if (zoom > 14) {
    return pins
  }

  // At very low zoom, cluster more aggressively
  const radius = zoom < 10 ? clusterRadiusMeters * 3 : clusterRadiusMeters

  const clusters: Cluster[] = []
  const processed = new Set<string>()

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

  pins.forEach((pin) => {
    if (processed.has(pin.id)) return

    // Find nearby pins within radius
    const nearbyPins = pins.filter((otherPin) => {
      if (processed.has(otherPin.id) || pin.id === otherPin.id) return false

      const distance = getDistance(pin.coordinates, otherPin.coordinates)
      return distance < radius
    })

    if (nearbyPins.length > 0) {
      // Create cluster
      const clusterPins = [pin, ...nearbyPins]
      const avgLat = clusterPins.reduce((sum, p) => sum + p.coordinates[1], 0) / clusterPins.length
      const avgLng = clusterPins.reduce((sum, p) => sum + p.coordinates[0], 0) / clusterPins.length

      clusters.push({
        id: `cluster-${pin.id}`,
        coordinates: [avgLng, avgLat],
        pins: clusterPins,
        count: clusterPins.length,
      })

      // Mark all pins as processed
      clusterPins.forEach((p) => processed.add(p.id))
    } else {
      processed.add(pin.id)
    }
  })

  // Return clusters and unclustered pins
  const unclustered = pins.filter((p) => !processed.has(p.id))
  return [...clusters, ...unclustered]
}

/**
 * Check if item is a cluster
 */
export function isCluster(item: Pin | Cluster): item is Cluster {
  return 'count' in item && 'pins' in item
}

