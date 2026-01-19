import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapStore } from '../store/mapStore'
import MapContainer from '../components/map/MapContainer'
import BusinessSearch from '../components/map/BusinessSearch'
import PersonPinModal from '../components/map/PersonPinModal'
import LoadingStatusBar from '../components/ui/LoadingStatusBar'

export default function MapPage() {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null) // Local ref to prevent double init

    const {
        mapInstance,
        setMapInstance,
        selectedPin,
        setSelectedPin,
        isLoading,
    } = useMapStore()

    // Initialize map
    useEffect(() => {
        // Prevent double initialization (React StrictMode)
        if (!mapContainerRef.current || mapRef.current) return

        const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
        if (!token) {
            console.warn('VITE_MAPBOX_ACCESS_TOKEN is not set.')
            return
        }

        // Set access token directly
        mapboxgl.accessToken = token

        // Suppress Mapbox internal warnings (harmless but noisy)
        const originalWarn = console.warn
        const warningFilter = (...args: any[]) => {
            const message = args[0]?.toString() || ''
            // Filter out Mapbox feature selector warnings
            if (message.includes('featureNamespace') ||
                message.includes('featureset') ||
                message.includes("selector is not associated to the same source")) {
                return // Suppress these warnings
            }
            originalWarn.apply(console, args)
        }
        console.warn = warningFilter

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/outdoors-v12',
            center: [-74.006, 40.7128], // Center of USA
            zoom: 14,
            antialias: true,
        })

        mapRef.current = map // Store in local ref (prevents double init)

        map.on('load', () => {
            setMapInstance(map)
            // Force resize to ensure map renders correctly
            setTimeout(() => {
                map.resize()
            }, 100)
            
            // Apply colorful customizations to make map more game-like
            try {
                // Make the map more colorful
                if (map.getLayer('landcover')) {
                    map.setPaintProperty('landcover', 'fill-color', [
                        'match',
                        ['get', 'class'],
                        'grass', '#A8E6CF',
                        'crop', '#FFD93D',
                        'sand', '#FFD93D',
                        'scrub', '#9BCF53',
                        'tundra', '#C5E8B7',
                        '#E8F5E9'
                    ])
                }
                
                // Make water more vibrant
                if (map.getLayer('water')) {
                    map.setPaintProperty('water', 'fill-color', '#4A90E2')
                }
                
                // Make parks more colorful
                if (map.getLayer('park')) {
                    map.setPaintProperty('park', 'fill-color', '#00FF88')
                }
            } catch (e) {
                console.log('Map style customization skipped:', e)
            }
        })

        map.on('error', (e) => {
            console.error('Map error:', e.error)
        })

        return () => {
            // Restore original console.warn on cleanup
            console.warn = originalWarn
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null // 🔴 THIS IS CRITICAL (prevents memory leaks)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Empty array - only run once on mount


    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Map Container */}
            <div
                ref={mapContainerRef}
                className="absolute inset-0"
                style={{ width: '100%', height: '100%' }}
            />

            {mapInstance && (
                <>
                    <MapContainer map={mapInstance} />

                    {/* Loading Status Bar - Show when fetching people data */}
                    <LoadingStatusBar isVisible={isLoading} />

                    {/* Business Search */}
                    <div className="absolute top-4 left-4 right-4 z-50 flex justify-center">
                        <div className="w-full max-w-xl">
                            <BusinessSearch />
                        </div>
                    </div>

                    {/* Person Modal */}
                    {selectedPin && (
                        <PersonPinModal
                            person={selectedPin.data}
                            onClose={() => setSelectedPin(null)}
                        />
                    )}
                </>
            )}

            {/* Loading overlay */}
            {!mapInstance && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
                    <div className="text-center">
                        <div className="font-display text-2xl text-game-primary mb-2">Loading Map...</div>
                        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-game-primary to-game-primary-dark rounded-full animate-pulse" style={{ width: '60%' }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

