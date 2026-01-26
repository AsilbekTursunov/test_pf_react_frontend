import axiosInstance from '../axios'

// Dashboard API endpoints
export const dashboardAPI = {
  // Get dashboard data
  getDashboardData: async (params) => {
    const response = await axiosInstance.post('/proxy', params)
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
  },

  // Get chart of accounts (План счетов)
  // @deprecated Use chartOfAccountsAPI.getList() instead
  getChartOfAccounts: async (params) => {
    const { chartOfAccountsAPI } = await import('./ucode/chartOfAccounts')
    return chartOfAccountsAPI.getList(params)
  },

  // Get bank accounts (Мои счета)
  // @deprecated Use bankAccountsAPI.getList() instead
  getBankAccounts: async (params) => {
    const { bankAccountsAPI } = await import('./ucode/bankAccounts')
    return bankAccountsAPI.getList(params)
  },

  // Get counterparties (Контрагенты)
  getCounterparties: async (params) => {
    const { counterpartiesAPI } = await import('./ucode/counterparties')
    return counterpartiesAPI.getList(params)
  },

  // Get operations table structure (Структура таблицы операций)
  getOperationsTableStructure: async (params) => {
    const { operationsAPI } = await import('./ucode/operations')
    return operationsAPI.getTableStructure(params)
  },

  // Get operations list (Список операций)
  getOperationsList: async (params) => {
    const { operationsAPI } = await import('./ucode/operations')
    return operationsAPI.getList(params)
  }
}
