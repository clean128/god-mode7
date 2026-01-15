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
    this.config = {
      customer: import.meta.env.VITE_L2_API_CUSTOMER || '',
      apiKey: import.meta.env.VITE_L2_API_KEY || '',
      app: import.meta.env.VITE_L2_APP || 'COM_US',
    }
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
      const url = `${L2_API_BASE_URL}/api/v2/records/search/estimate/${this.config.customer}/${this.config.app}${this.getAuthParams()}`
      
      const response = await axios.post(url, {
        filters,
        ...(circleFilter && { circle_filter: circleFilter }),
      })

      const total = response.data.total as number
      
      // Cache for 10 minutes (estimates don't change often)
      apiCache.set(cacheKey, total, 10 * 60 * 1000)

      return total
    } catch (error) {
      console.error('L2 API Estimate Error:', error)
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
      // Always estimate first to prevent unexpected charges
      const estimate = await this.estimateSearch(filters, circleFilter)
      console.log(`Estimated results: ${estimate}`)

      if (estimate === 0) {
        // Cache empty results too
        apiCache.set(cacheKey, [], 5 * 60 * 1000)
        return []
      }

      const url = `${L2_API_BASE_URL}/api/v2/records/search/${this.config.customer}/${this.config.app}${this.getAuthParams()}`
      
      const response = await axios.post(url, {
        filters,
        ...(circleFilter && { circle_filter: circleFilter }),
        format: 'json',
        limit: Math.min(limit, 500), // Max 500 for JSON format
      })

      const results = response.data as any[]
      
      // Cache results for 5 minutes
      apiCache.set(cacheKey, results, 5 * 60 * 1000)

      return results
    } catch (error) {
      console.error('L2 API Search Error:', error)
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

