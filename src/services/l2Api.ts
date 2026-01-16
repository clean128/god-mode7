import axios from 'axios'
import { apiCache } from './cache'

const L2_API_BASE_URL = 'https://api.l2datamapping.com'

interface L2ApiConfig {
  customer: string
  apiKey: string
  app: string
}

class L2ApiClient {
  private config: L2ApiConfig

  constructor() {
    const appValue = import.meta.env.VITE_L2_APP || 'COM_US'
    
    // Validate app value - it should NOT be a URL
    if (appValue.includes('http://') || appValue.includes('https://') || appValue.includes('api.l2datamapping.com')) {
      console.error('❌ Invalid VITE_L2_APP value:', appValue)
      console.error('📝 VITE_L2_APP should be an application ID like "COM_US", "VM_CA", etc.')
      console.error('📝 It should NOT be a URL like "https://api.l2datamapping.com"')
      throw new Error(`Invalid VITE_L2_APP value: "${appValue}". It should be an application ID (e.g., "COM_US"), not a URL.`)
    }

    this.config = {
      customer: import.meta.env.VITE_L2_API_CUSTOMER || '',
      apiKey: import.meta.env.VITE_L2_API_KEY || '',
      app: appValue,
    }

    // Log config (without exposing API key)
    console.log('🔧 L2 API Config:', {
      customer: this.config.customer,
      app: this.config.app,
      hasApiKey: !!this.config.apiKey,
    })
  }

  private getAuthParams() {
    return `?id=${this.config.customer}&apikey=${this.config.apiKey}`
  }

  /**
   * Estimate search results before performing actual search (cost prevention)
   */
  async estimateSearch(filters: Record<string, any>, circleFilter?: {
    lat: number
    long: number
    radius: number
  }) {
    // Check cache first
    const cacheKey = apiCache.generateKey('l2_estimate', { filters, circleFilter })
    const cached = apiCache.get<number>(cacheKey)
    if (cached !== null) {
      console.log('📦 Using cached estimate:', cached)
      return cached
    }

    try {
      // Validate config
      if (!this.config.customer || !this.config.apiKey || !this.config.app) {
        throw new Error('L2 API configuration missing. Please set VITE_L2_API_CUSTOMER, VITE_L2_API_KEY, and VITE_L2_APP in your .env file.')
      }

      const url = `${L2_API_BASE_URL}/api/v2/records/search/estimate/${this.config.customer}/${this.config.app}${this.getAuthParams()}`
      
      console.log('🔍 L2 API Estimate Request URL:', url.replace(/apikey=[^&]+/, 'apikey=***'))
      console.log('🔍 Request body:', { filters, circleFilter })
      
      const response = await axios.post(url, {
        filters,
        ...(circleFilter && { circle_filter: circleFilter }),
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Check for error response
      if (response.data && response.data.result === 'fail') {
        const errorMsg = response.data.message || 'Unknown API error'
        throw new Error(`L2 API Error: ${errorMsg} (code: ${response.data.code || 'unknown'})`)
      }

      // Log the full response for debugging
      console.log('📊 L2 API Estimate Response:', {
        status: response.status,
        data: response.data,
        dataType: typeof response.data,
        hasTotal: 'total' in (response.data || {}),
        totalValue: response.data?.total,
        totalType: typeof response.data?.total,
      })

      // Try to extract total from various possible response formats
      let total: number | undefined

      if (typeof response.data === 'number') {
        // Direct number response
        total = response.data
      } else if (response.data && typeof response.data === 'object') {
        // Try different property names and nested structures
        // Handle: {"results":{"count":884974,"households":584688},"result":"ok","code":200}
        if (response.data.results && typeof response.data.results.count === 'number') {
          total = response.data.results.count
        } else {
          // Try other common formats
          total = response.data.total ?? response.data.count ?? response.data.estimated ?? response.data.estimate
        }
      }

      if (typeof total !== 'number' || isNaN(total)) {
        console.error('❌ Unexpected estimate response format:', {
          responseData: response.data,
          responseStatus: response.status,
          responseHeaders: response.headers,
          extractedTotal: total,
        })
        throw new Error(`Invalid response format from L2 API estimate endpoint. Expected {total: number} or {results: {count: number}} but got: ${JSON.stringify(response.data)}`)
      }
      
      // Cache for 10 minutes (estimates don't change often)
      apiCache.set(cacheKey, total, 10 * 60 * 1000)

      return total
    } catch (error: any) {
      console.error('L2 API Estimate Error:', error)
      if (error.response) {
        const errorData = error.response.data
        if (errorData && errorData.result === 'fail') {
          throw new Error(`L2 API Error: ${errorData.message || 'Unknown error'} (code: ${errorData.code || error.response.status})`)
        }
        throw new Error(`L2 API Request failed: ${error.response.status} ${error.response.statusText}`)
      }
      throw error
    }
  }

  /**
   * Search for people records
   */
  async searchPeople(
    filters: Record<string, any>,
    circleFilter?: {
      lat: number
      long: number
      radius: number
    },
    limit: number = 500
  ) {
    // Check cache first
    const cacheKey = apiCache.generateKey('l2_search', { filters, circleFilter, limit })
    const cached = apiCache.get<any[]>(cacheKey)
    if (cached !== null) {
      console.log('📦 Using cached search results:', cached.length, 'records')
      return cached
    }

    try {
      // Validate config
      if (!this.config.customer || !this.config.apiKey || !this.config.app) {
        throw new Error('L2 API configuration missing. Please set VITE_L2_API_CUSTOMER, VITE_L2_API_KEY, and VITE_L2_APP in your .env file.')
      }

      // Always estimate first to prevent unexpected charges
      const estimate = await this.estimateSearch(filters, circleFilter)
      console.log(`Estimated results: ${estimate}`)

      if (estimate === 0 || !estimate) {
        // Cache empty results too
        apiCache.set(cacheKey, [], 5 * 60 * 1000)
        return []
      }

      const url = `${L2_API_BASE_URL}/api/v2/records/search/${this.config.customer}/${this.config.app}${this.getAuthParams()}`
      
      const response = await axios.post(url, {
        filters,
        ...(circleFilter && { circle_filter: circleFilter }),
        format: 'json',
        fieldset: 'EXTENDED',
        limit: Math.min(limit, 500), // Max 500 for JSON format
        wait: 30000, // Wait up to 30 seconds
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Check for error response
      if (response.data && response.data.result === 'fail') {
        const errorMsg = response.data.message || 'Unknown API error'
        throw new Error(`L2 API Error: ${errorMsg} (code: ${response.data.code || 'unknown'})`)
      }

      // Log the full response for debugging
      console.log('📊 L2 API Search Response:', {
        status: response.status,
        data: response.data,
        dataType: typeof response.data,
        hasData: 'data' in (response.data || {}),
        hasResults: 'results' in (response.data || {}),
        hasRecords: 'records' in (response.data || {}),
      })

      // Handle response formats - check for success response with data
      let results: any[] = []
      const data = response.data

      // Handle response format similar to estimate: {result: "ok", results: {...}, code: 200}
      // But for search, results might contain the actual data array
      if (response.data && response.data.result === 'ok') {
        // Check if results contains an array of records
        if (response.data.results && Array.isArray(response.data.results)) {
          results = response.data.results
        } else if (response.data.results && Array.isArray(response.data.results.data)) {
          // Nested: results.data
          results = response.data.results.data
        } else if (response.data.results && Array.isArray(response.data.results.records)) {
          // Nested: results.records
          results = response.data.results.records
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Direct: data property
          results = response.data.data
        } else if (Array.isArray(response.data.results)) {
          // results is directly an array
          results = response.data.results
        }
      } else if (Array.isArray(data)) {
        // Direct array response
        results = data
      } else if (data && Array.isArray(data.data)) {
        // Response with data property
        results = data.data
      } else if (data && Array.isArray(data.records)) {
        // Response with records property
        results = data.records
      } else if (data && Array.isArray(data.results)) {
        // Response with results property
        results = data.results
      } else if (data && typeof data === 'object') {
        // Try to find any array property
        const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]))
        if (arrayKeys.length > 0) {
          results = data[arrayKeys[0]]
          console.log(`📦 Found array in property: ${arrayKeys[0]}, length: ${results.length}`)
        } else {
          console.warn('L2 API response format not recognized:', data)
          results = []
        }
      } else {
        console.warn('L2 API returned unexpected response type:', typeof data, data)
        results = []
      }

      console.log(`✅ Extracted ${results.length} people records from search response`)

      // Ensure we return an array
      if (!Array.isArray(results)) {
        console.error('L2 API did not return an array:', results)
        return []
      }
      
      // Cache results for 5 minutes
      apiCache.set(cacheKey, results, 5 * 60 * 1000)

      return results
    } catch (error: any) {
      console.error('L2 API Search Error:', error)
      if (error.response) {
        const errorData = error.response.data
        if (errorData && errorData.result === 'fail') {
          throw new Error(`L2 API Error: ${errorData.message || 'Unknown error'} (code: ${errorData.code || error.response.status})`)
        }
        throw new Error(`L2 API Request failed: ${error.response.status} ${error.response.statusText}`)
      }
      throw error
    }
  }

  /**
   * Get available columns for the application
   */
  async getAvailableColumns() {
    try {
      const url = `${L2_API_BASE_URL}/api/v2/customer/application/columns/${this.config.customer}/${this.config.app}${this.getAuthParams()}`
      
      const response = await axios.get(url)
      return response.data.columns as Array<{
        id: string
        name: string
        type: string
      }>
    } catch (error) {
      console.error('L2 API Columns Error:', error)
      throw error
    }
  }

  /**
   * Get column values (for filter dropdowns)
   */
  async getColumnValues(column: string) {
    try {
      const url = `${L2_API_BASE_URL}/api/v2/customer/application/values/${this.config.customer}/${this.config.app}/${column}${this.getAuthParams()}`
      
      const response = await axios.get(url)
      return response.data.values as string[]
    } catch (error) {
      console.error('L2 API Column Values Error:', error)
      throw error
    }
  }
}

export const l2Api = new L2ApiClient()

