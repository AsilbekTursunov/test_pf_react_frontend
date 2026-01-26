import axiosInstance from '../../axios'
import { apiConfig } from '../../config/api'

/**
 * Operations API
 * Handles all operations related requests
 */
export const operationsAPI = {
  /**
   * Get table structure (fields, views, etc.)
   * @param {Object} params - Query parameters
   * @param {string} params.menuId - Menu ID (optional, uses default if not provided)
   * @param {string} params.viewId - View ID (optional, uses default if not provided)
   * @param {string} params.tableSlug - Table slug (optional, uses default if not provided)
   * @param {string} params.projectId - Project ID (optional, uses default from config)
   * @returns {Promise} API response
   */
  getTableStructure: async (params = {}) => {
    const {
      menuId = apiConfig.ucode.operations.menuId,
      viewId = apiConfig.ucode.operations.viewId,
      tableSlug = apiConfig.ucode.operations.tableSlug,
      projectId = apiConfig.ucode.projectId,
      ...otherParams
    } = params

    const response = await axiosInstance.get('/operations/table-structure', {
      params: {
        projectId,
        menuId,
        viewId,
        tableSlug,
        ...otherParams
      }
    })
    
    return response.data
  },

  /**
   * Get list of operations items using v2/items/operations endpoint
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of items to return (default: 20)
   * @param {number} params.offset - Number of items to skip (default: 0)
   * @param {string} params.opisanie - Description filter
   * @param {Object} params.filters - Additional filters to include in data parameter
   * @returns {Promise} API response
   */
  getList: async (params = {}) => {
    const {
      limit = 20,
      offset = 0,
      opisanie,
      filters = {},
      ...otherParams
    } = params

    // Build data object for query parameter
    const dataParams = {
      limit,
      offset,
      ...(opisanie && { opisanie }),
      ...filters,
      ...otherParams
    }

    // Convert to JSON string for query parameter
    const dataParam = JSON.stringify(dataParams)

    const response = await axiosInstance.get('/operations/v2-items', {
      params: {
        data: dataParam
      }
    })
    
    return response.data
  },
}
