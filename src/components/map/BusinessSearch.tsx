import { useState } from 'react'
import { searchBusiness } from '../../services/mapboxApi'
import { useMapStore } from '../../store/mapStore'

export default function BusinessSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setBusinessLocation, setLoading } = useMapStore()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!query.trim()) {
      console.log('Search query is empty')
      return
    }

    console.log('Starting search for:', query)
    setIsSearching(true)
    setError(null)
    setResults([])
    
    try {
      console.log('Calling searchBusiness API...')
      const searchResults = await searchBusiness(query)
      console.log('Search results received:', searchResults)
      
      if (!searchResults || searchResults.length === 0) {
        setError('No results found. Try a different search term.')
        console.log('No results found')
      } else {
        setResults(searchResults)
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
    const [lng, lat] = result.center
    
    setBusinessLocation({
      name: result.place_name,
      coordinates: [lng, lat],
      address: result.place_name,
    })

    setResults([])
    setQuery(result.place_name)
    setLoading(true)
  }

  return (
    <div className="relative" style={{ pointerEvents: 'auto' }}>
      <form onSubmit={handleSearch} className="relative" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Type your business name here..."
          className="w-full h-16 px-6 pr-36 rounded-game border-4 border-purple-400 focus:border-pink-500 focus:outline-none font-body text-xl shadow-2xl bg-white"
          style={{
            boxShadow: '0 8px 32px rgba(168, 85, 247, 0.4)',
          }}
        />
        <button
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
        </button>
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

      {/* Search Results */}
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-game shadow-2xl border-4 border-purple-300 max-h-64 overflow-y-auto z-20">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelectBusiness(result)}
              className="w-full text-left px-6 py-4 hover:bg-purple-50 transition-colors border-b-2 border-purple-100 last:border-b-0"
            >
              <div className="font-body font-semibold text-gray-900 text-lg">{result.place_name}</div>
              {result.context && (
                <div className="font-body text-sm text-gray-500 mt-1">
                  {result.context.map((ctx: any) => ctx.text).join(', ')}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

