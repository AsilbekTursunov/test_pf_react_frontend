import axiosInstance from '../../axios'
import { apiConfig } from '../../config/api'

/**
 * Counterparties API
 * Handles all counterparties related requests
 */
export const counterpartiesAPI = {
  /**
   * Get list of counterparties items
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of items to return (default: 20)
   * @param {number} params.offset - Number of items to skip (default: 0)
   * @param {Object} params.order - Sort order
   * @param {string} params.search - Search query
   * @param {string[]} params.view_fields - Fields to include in response
   * @param {string} params.menuId - Menu ID (optional, uses default if not provided)
   * @param {string} params.viewId - View ID (optional, uses default if not provided)
   * @param {string} params.projectId - Project ID (optional, uses default from config)
   * @returns {Promise} API response
   */
  getList: async (params = {}) => {
    const {
      limit = 20,
      offset = 0,
      order = {},
      search = '',
      view_fields = [],
      menuId = apiConfig.ucode.counterparties.menuId,
      viewId = apiConfig.ucode.counterparties.viewId,
      projectId = apiConfig.ucode.projectId,
      environmentId,
      resourceId,
      ...otherParams
    } = params

    const response = await axiosInstance.post('/counterparties', {
      projectId,
      menuId,
      viewId,
      tableSlug: apiConfig.ucode.counterparties.tableSlug,
      offset,
      order,
      view_fields,
      limit,
      search,
      ...(environmentId && { 'environment-id': environmentId }),
      ...(resourceId && { 'resource-id': resourceId }),
      ...otherParams
    })
    
    return response.data
  },
}
