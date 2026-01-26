import axiosInstance from '../../axios'
import { apiConfig } from '../../config/api'

/**
 * Bank Accounts API
 * Handles all bank accounts related requests
 */
export const bankAccountsAPI = {
  /**
   * Get list of bank accounts items
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
      menuId = apiConfig.ucode.bankAccounts.menuId,
      viewId = apiConfig.ucode.bankAccounts.viewId,
      projectId = apiConfig.ucode.projectId,
      environmentId,
      resourceId,
      ...otherParams
    } = params

    const response = await axiosInstance.post('/bank-accounts', {
      projectId,
      menuId,
      viewId,
      tableSlug: apiConfig.ucode.bankAccounts.tableSlug,
      row_view_id: viewId,
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
