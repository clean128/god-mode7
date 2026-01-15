import { create } from 'zustand'
import type mapboxgl from 'mapbox-gl'

interface BusinessLocation {
  name: string
  coordinates: [number, number]
  address?: string
}

interface PersonPin {
  id: string
  coordinates: [number, number]
  data: any // L2 person data
}

interface MapState {
  businessLocation: BusinessLocation | null
  personPins: PersonPin[]
  selectedPin: PersonPin | null
  mapInstance: mapboxgl.Map | null
  isLoading: boolean
  error: string | null
  
  setBusinessLocation: (location: BusinessLocation | null) => void
  setPersonPins: (pins: PersonPin[]) => void
  addPersonPin: (pin: PersonPin) => void
  setSelectedPin: (pin: PersonPin | null) => void
  setMapInstance: (map: mapboxgl.Map | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearPins: () => void
}

export const useMapStore = create<MapState>((set) => ({
  businessLocation: null,
  personPins: [],
  selectedPin: null,
  mapInstance: null,
  isLoading: false,
  error: null,

  setBusinessLocation: (location) => set({ businessLocation: location }),
  setPersonPins: (pins) => set({ personPins: pins }),
  addPersonPin: (pin) => set((state) => ({ personPins: [...state.personPins, pin] })),
  setSelectedPin: (pin) => set({ selectedPin: pin }),
  setMapInstance: (map) => set({ mapInstance: map }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearPins: () => set({ personPins: [], selectedPin: null }),
}))

