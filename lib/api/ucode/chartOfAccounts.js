import axiosInstance from '../../axios'
import { apiConfig } from '../../config/api'

/**
 * Chart of Accounts API
 * Handles all chart of accounts related requests
 */
export const chartOfAccountsAPI = {
  /**
   * Get list of chart of accounts items
   * @param {Object} params - Query parameters
   * @param {string[]} params.tip - Array of types to filter (e.g., ['Расходы', 'Доходы'])
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
      tip,
      limit = 20,
      offset = 0,
      order = {},
      search = '',
      view_fields = [],
      menuId = apiConfig.ucode.chartOfAccounts.menuId,
      viewId = apiConfig.ucode.chartOfAccounts.viewId,
      projectId = apiConfig.ucode.projectId,
      environmentId,
      resourceId,
      ...otherParams
    } = params

    // Prepare request body
    const requestBody = {
      projectId,
      menuId,
      viewId,
      row_view_id: viewId,
      offset,
      order,
      view_fields,
      limit,
      search,
      ...(environmentId && { 'environment-id': environmentId }),
      ...(resourceId && { 'resource-id': resourceId }),
      ...otherParams
    }

    // Only include tip if it's provided and not empty, otherwise use null
    if (tip !== undefined) {
      if (Array.isArray(tip) && tip.length > 0) {
        requestBody.tip = tip
      } else {
        requestBody.tip = null
      }
    } else {
      requestBody.tip = null
    }

    const response = await axiosInstance.post('/chart-of-accounts', requestBody)
    
    return response.data
  },

  /**
   * Get chart of accounts tree using invoke_function (planfact-plan-fact)
   * Method: get_chart_of_accounts
   *
   * Request body format:
   * {
   *   auth: { type: 'apikey', data: {} },
   *   data: {
   *     app_id, environment_id, project_id,
   *     method: 'get_chart_of_accounts',
   *     user_id,
   *     object_data: { page, limit }
   *   }
   * }
   */
  getChartOfAccountsInvokeFunction: async (params = {}) => {
    const {
      page = 1,
      limit = 100,
      user_id = '',
      app_id,
      environment_id,
      project_id,
    } = params

    const requestBody = {
      auth: {
        type: 'apikey',
        data: {},
      },
      data: {
        app_id: app_id ?? apiConfig.ucode.appId ?? apiConfig.ucode.projectId,
        environment_id: environment_id ?? apiConfig.ucode['environment-id'],
        project_id: project_id ?? apiConfig.ucode.projectId,
        method: 'get_chart_of_accounts',
        user_id,
        object_data: {
          page,
          limit,
        },
      },
    }

    const url = `${apiConfig.ucode.baseURL}/v2/invoke_function/planfact-plan-fact`
    const response = await axiosInstance.post(url, requestBody, {
      headers: { 'Content-Type': 'application/json' },
    })

    return response.data
  },
}
