import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapStore } from '../store/mapStore'
import { useOnboarding } from '../contexts/OnboardingContext'
import MapContainer from '../components/map/MapContainer'
import BusinessSearch from '../components/map/BusinessSearch'
import PersonPinModal from '../components/map/PersonPinModal'
import OnboardingOverlay from '../components/onboarding/OnboardingOverlay'
import ProgressIndicator from '../components/onboarding/ProgressIndicator'

export default function MapPage() {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null) // Local ref to prevent double init
    const [searchParams] = useSearchParams()
    const onboardingStep = parseInt(searchParams.get('step') || '0')

    const {
        mapInstance,
        setMapInstance,
        selectedPin,
        setSelectedPin,
    } = useMapStore()

    const {
        isFirstTime,
        currentStep,
        totalSteps,
        nextStep,
        completeStep,
        unlockAchievement,
    } = useOnboarding()

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
            style: 'mapbox://styles/mapbox/standard',
            config: {
                basemap: {
                    lightPreset: "dusk",
                    showRoadLabels: false,
                    showTransitLabels: false,
                    font: "Frank Ruhl Libre",
                    show3dFacades: true,
                    showLandmarkIcons: true,
                    colorBuildings: "#d0c7b3"
                }
            },
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

    // Handle onboarding step
    useEffect(() => {
        if (onboardingStep > 0 && isFirstTime) {
            // Onboarding is handled by OnboardingOverlay
        }
    }, [onboardingStep, isFirstTime])

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

                    {/* Business Search - Must be above overlay (z-40) */}
                    <div className="absolute top-4 left-4 right-4 z-50 flex justify-center">
                        <div className="w-full max-w-xl">
                            <BusinessSearch />
                        </div>
                    </div>

                    {/* Progress Indicator (during onboarding) */}
                    {isFirstTime && currentStep > 0 && (
                        <div className="absolute top-20 left-4 right-4 z-10 flex justify-center">
                            <div className="w-full max-w-xl">
                            <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
                        </div>
                        </div>
                    )}

                    {/* Person Pin Modal */}
                    {selectedPin && (
                        <PersonPinModal
                            person={selectedPin.data}
                            onClose={() => setSelectedPin(null)}
                        />
                    )}

                    {/* Onboarding Overlay */}
                    {isFirstTime && (
                        <OnboardingOverlay
                            currentStep={currentStep}
                            onNext={nextStep}
                            onCompleteStep={completeStep}
                            onUnlockAchievement={unlockAchievement}
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

