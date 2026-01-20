import axiosInstance from '../axios'

// Dashboard API endpoints
export const dashboardAPI = {
  // Get dashboard data
  getDashboardData: async (params) => {
    const response = await axiosInstance.post('/proxy', params)
    return response.data
  },

  // Get counterparties (Контрагенты)
  getCounterAgents: async ({ page = 1, limit = 500, search = '' } = {}) => {
    const response = await axiosInstance.post('/proxy', {
      data: {
        method: 'find_counter_agents',
        object_data: { page, limit, search }
      }
    })
    return response.data
  },

  // Get legal entities with accounts (Юрлица)
  getLegalEntitiesWithAccounts: async ({ page = 1, limit = 500, search = '' } = {}) => {
    const response = await axiosInstance.post('/proxy', {
      data: {
        method: 'find_legal_entities_with_accounts',
        object_data: { page, limit, search }
      }
    })
    return response.data
  },

  // Get projects (Проекты)
  getProjects: async ({ page = 1, limit = 500, search = '' } = {}) => {
    const response = await axiosInstance.post('/proxy', {
      data: {
        method: 'find_projects',
        object_data: { page, limit, search }
      }
    })
    return response.data
  },

  // Get financial accounts (Статьи учета)
  getFinancialAccounts: async ({ page = 1, limit = 1000 } = {}) => {
    const response = await axiosInstance.post('/proxy', {
      data: {
        method: 'find_financial_accounts',
        object_data: { page, limit }
      }
    })
    return response.data
  },

  // Get operations
  getOperations: async (params) => {
    const response = await axiosInstance.post('/proxy', {
      action: 'get_operations',
      ...params
    })
    return response.data
  },

  // Get products
  getProducts: async (params) => {
    const response = await axiosInstance.post('/proxy', {
      action: 'get_products',
      ...params
    })
    return response.data
  },

  // Get accounts
  getAccounts: async (params) => {
    const response = await axiosInstance.post('/proxy', {
      action: 'get_accounts',
      ...params
    })
    return response.data
  },

  // Get transaction categories
  getTransactionCategories: async (params) => {
    const response = await axiosInstance.post('/proxy', {
      action: 'get_transaction_categories',
      ...params
    })
    return response.data
  },

  // Create operation
  createOperation: async (data) => {
    const response = await axiosInstance.post('/proxy', {
      action: 'create_operation',
      ...data
    })
    return response.data
  },

  // Update operation
  updateOperation: async (id, data) => {
    const response = await axiosInstance.post('/proxy', {
      action: 'update_operation',
      id,
      ...data
    })
    return response.data
  },

  // Delete operation
  deleteOperation: async (id) => {
    const response = await axiosInstance.post('/proxy', {
      action: 'delete_operation',
      id
    })
    return response.data
  }
}
