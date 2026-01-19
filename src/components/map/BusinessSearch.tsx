import { useState, useEffect, useRef } from 'react'
import { searchBusiness } from '../../services/mapboxApi'
import { useMapStore } from '../../store/mapStore'

export default function BusinessSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchTimeoutRef = useRef<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isSelectingRef = useRef(false) // Flag to prevent autocomplete during selection
  const { setBusinessLocation, setLoading } = useMapStore()

  // Autocomplete search as user types (debounced)
  useEffect(() => {
    // Don't run autocomplete if we're in the middle of selecting a business
    if (isSelectingRef.current) {
      isSelectingRef.current = false // Reset the flag
      return
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current)
    }

    // Don't search if query is too short
    if (!query.trim() || query.trim().length < 2) {
      setResults([])
      setShowDropdown(false)
      return
    }

    // Debounce search by 300ms
    setIsSearching(true)
    searchTimeoutRef.current = window.setTimeout(async () => {
      try {
        console.log('Auto-searching for:', query)
        const searchResults = await searchBusiness(query)
        console.log('Autocomplete results received:', searchResults)
        
        if (!searchResults || searchResults.length === 0) {
          setResults([])
          setShowDropdown(true)
        } else {
          setResults(searchResults)
          setShowDropdown(true)
          setSelectedIndex(-1)
        }
      } catch (error: any) {
        console.error('Autocomplete search error:', error)
        setResults([])
        setError(null) // Don't show error on autocomplete, only on manual search
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target)
      ) {
        setShowDropdown(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle keyboard navigation in dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || results.length === 0) {
      if (e.key === 'Enter') {
        handleManualSearch(e)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => 
          prev < results.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelectBusiness(results[selectedIndex])
        } else if (results.length > 0) {
          handleSelectBusiness(results[0])
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!query.trim()) {
      console.log('Search query is empty')
      return
    }

    console.log('Manual search for:', query)
    setIsSearching(true)
    setError(null)
    setShowDropdown(false)
    
    try {
      console.log('Calling searchBusiness API...')
      const searchResults = await searchBusiness(query)
      console.log('Search results received:', searchResults)
      
      if (!searchResults || searchResults.length === 0) {
        setError('No results found. Try a different search term.')
        console.log('No results found')
      } else {
        setResults(searchResults)
        setShowDropdown(true)
        console.log(`Found ${searchResults.length} results`)
      }
    } catch (error: any) {
      console.error('Search error:', error)
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to search. Please check your Mapbox API token.'
      setError(errorMessage)
      
      // Check if it's an authentication error
      if (errorMessage.includes('token') || errorMessage.includes('Unauthorized')) {
        setError('Mapbox API token is missing or invalid. Please check your .env file.')
      }
    } finally {
      setIsSearching(false)
      console.log('Search completed')
    }
  }

  const handleSelectBusiness = (result: any) => {
    const [lng, lat] = result.center || result.geometry?.coordinates || [0, 0]
    
    // Set flag to prevent autocomplete from running
    isSelectingRef.current = true
    
    // Clear any pending search
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = null
    }
    
    // Close dropdown immediately
    setShowDropdown(false)
    setResults([])
    setSelectedIndex(-1)
    setIsSearching(false)
    
    // Get the business name
    const businessName = result.place_name || result.properties?.name || ''
    
    // Set business location
    setBusinessLocation({
      name: businessName,
      coordinates: [lng, lat],
      address: result.place_name || result.properties?.full_address || '',
    })

    // Update query (this will trigger useEffect but isSelectingRef will prevent new search)
    setQuery(businessName)
    setLoading(true)
  }

  return (
    <div className="relative" style={{ pointerEvents: 'auto' }}>
      <form onSubmit={handleManualSearch} className="relative" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setError(null)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) {
              setShowDropdown(true)
            }
          }}
          placeholder="🔍 Type your business name here..."
          className="w-full h-16 px-6 pr-36 rounded-game border-4 border-purple-400 focus:border-pink-500 focus:outline-none font-body text-xl shadow-2xl bg-white"
          style={{
            boxShadow: '0 8px 32px rgba(168, 85, 247, 0.4)',
          }}
        />
        {/* <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="absolute right-2 top-2 bottom-2 px-8 rounded-game bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white font-display font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all active:scale-95"
        >
          {isSearching ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Searching...
            </span>
          ) : (
            'Search'
          )}
        </button> */}
      </form>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-red-100 border-4 border-red-500 rounded-game shadow-xl z-20">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <div className="font-body font-bold text-red-900 mb-1">Search Error</div>
              <div className="font-body text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Autocomplete Dropdown Results */}
      {showDropdown && results.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-game shadow-2xl border-4 border-purple-300 max-h-64 overflow-y-auto z-20"
        >
          {results.map((result, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleSelectBusiness(result)
              }}
              className={`w-full text-left px-6 py-4 transition-colors border-b-2 border-purple-100 last:border-b-0 ${
                selectedIndex === index 
                  ? 'bg-purple-100 border-purple-300' 
                  : 'hover:bg-purple-50'
              }`}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="font-body font-semibold text-gray-900 text-lg">
                {result.place_name || result.properties?.name || 'Unknown'}
              </div>
              {result.context && (
                <div className="font-body text-sm text-gray-500 mt-1">
                  {result.context.map((ctx: any) => ctx.text).join(', ')}
                </div>
              )}
              {result.properties?.full_address && !result.context && (
                <div className="font-body text-sm text-gray-500 mt-1">
                  {result.properties.full_address}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Loading indicator in dropdown */}
      {showDropdown && isSearching && results.length === 0 && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-game shadow-2xl border-4 border-purple-300 p-6 z-20">
          <div className="flex items-center justify-center gap-3">
            <span className="animate-spin text-2xl">⏳</span>
            <span className="font-body text-gray-600">Searching...</span>
          </div>
        </div>
      )}

      {/* No results message */}
      {showDropdown && !isSearching && results.length === 0 && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-game shadow-2xl border-4 border-purple-300 p-6 z-20">
          <div className="font-body text-gray-600 text-center">
            No results found for "{query}"
          </div>
        </div>
      )}
    </div>
  )
}

