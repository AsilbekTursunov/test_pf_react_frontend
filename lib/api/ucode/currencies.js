import axiosInstance from '../../axios'
import { apiConfig } from '../../config/api'

/**
 * Currencies API
 * Handles all currencies related requests
 */
export const currenciesAPI = {
  /**
   * Get list of currencies using v2/items/currenies endpoint
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of items to return (default: 100)
   * @param {number} params.offset - Number of items to skip (default: 0)
   * @returns {Promise} API response
   */
  getList: async (params = {}) => {
    const {
      limit = 100,
      offset = 0,
      ...otherParams
    } = params

    const baseURL = apiConfig.ucode.baseURL
    const projectId = apiConfig.ucode.projectId
    const environmentId = apiConfig.ucode['environment-id']
    const authToken = apiConfig.ucode.authToken

    // Build URL with query parameters
    const queryParams = new URLSearchParams()
    queryParams.append('project-id', projectId)
    queryParams.append('environment-id', environmentId)
    
    // Add data parameter if provided
    if (Object.keys(otherParams).length > 0) {
      const dataParams = { limit, offset, ...otherParams }
      queryParams.append('data', JSON.stringify(dataParams))
    } else {
      const dataParams = { limit, offset }
      queryParams.append('data', JSON.stringify(dataParams))
    }

    const url = `${baseURL}/v2/items/currenies?${queryParams.toString()}`

    const response = await axiosInstance.get('/operations/v2-items', {
      params: {
        data: JSON.stringify({ limit, offset, ...otherParams })
      },
      baseURL: baseURL,
      url: `/v2/items/currenies?${queryParams.toString()}`,
    })
    
    return response.data
  },
}
