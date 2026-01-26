import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardAPI } from '@/lib/api/dashboard'

// Get dashboard data
export const useDashboardData = (params) => {
  return useQuery({
    queryKey: ['dashboard', params],
    queryFn: () => dashboardAPI.getDashboardData(params),
  })
}

// Get operations
export const useOperations = (params) => {
  return useQuery({
    queryKey: ['operations', params],
    queryFn: () => dashboardAPI.getOperations(params),
  })
}

// Get products
export const useProducts = (params) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => dashboardAPI.getProducts(params),
  })
}

// Get accounts
export const useAccounts = (params) => {
  return useQuery({
    queryKey: ['accounts', params],
    queryFn: () => dashboardAPI.getAccounts(params),
  })
}

// Get transaction categories
export const useTransactionCategories = (params) => {
  return useQuery({
    queryKey: ['transactionCategories', params],
    queryFn: () => dashboardAPI.getTransactionCategories(params),
  })
}

// Create operation mutation
export const useCreateOperation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: dashboardAPI.createOperation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Update operation mutation
export const useUpdateOperation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => dashboardAPI.updateOperation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Delete operation mutation
export const useDeleteOperation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: dashboardAPI.deleteOperation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Get chart of accounts (План счетов)
export const useChartOfAccounts = (params = {}) => {
  return useQuery({
    queryKey: ['chartOfAccounts', params],
    queryFn: async () => {
      console.log('useChartOfAccounts: Making request with params:', params)
      try {
        const result = await dashboardAPI.getChartOfAccounts(params)
        console.log('useChartOfAccounts: Response received:', result)
        return result
      } catch (error) {
        console.error('useChartOfAccounts: Error:', error)
        console.error('useChartOfAccounts: Error response:', error.response?.data)
        // Return empty data structure instead of throwing to prevent app crash
        return {
          status: 'ERROR',
          data: { data: { count: 0, response: [] } }
        }
      }
    },
    enabled: true, // projectId is now in config, so always enabled
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry on error to prevent infinite loops
  })
}

// Get bank accounts (Мои счета)
export const useBankAccounts = (params = {}) => {
  return useQuery({
    queryKey: ['bankAccounts', params],
    queryFn: async () => {
      console.log('useBankAccounts: Making request with params:', params)
      try {
        const result = await dashboardAPI.getBankAccounts(params)
        console.log('useBankAccounts: Response received:', result)
        return result
      } catch (error) {
        console.error('useBankAccounts: Error:', error)
        console.error('useBankAccounts: Error response:', error.response?.data)
        // Return empty data structure instead of throwing to prevent app crash
        return {
          status: 'ERROR',
          data: { data: { count: 0, response: [] } }
        }
      }
    },
    enabled: true, // projectId is now in config, so always enabled
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry on error to prevent infinite loops
  })
}

// Get counterparties (Контрагенты)
export const useCounterparties = (params = {}) => {
  return useQuery({
    queryKey: ['counterparties', params],
    queryFn: async () => {
      console.log('useCounterparties: Making request with params:', params)
      try {
        const result = await dashboardAPI.getCounterparties(params)
        console.log('useCounterparties: Response received:', result)
        return result
      } catch (error) {
        console.error('useCounterparties: Error:', error)
        console.error('useCounterparties: Error response:', error.response?.data)
        // Return empty data structure instead of throwing to prevent app crash
        return {
          status: 'ERROR',
          data: { data: { count: 0, response: [] } }
        }
      }
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry on error to prevent infinite loops
  })
}

// Get operations table structure (Структура таблицы операций)
export const useOperationsTableStructure = (params = {}) => {
  return useQuery({
    queryKey: ['operationsTableStructure', params],
    queryFn: async () => {
      console.log('useOperationsTableStructure: Making request with params:', params)
      try {
        const result = await dashboardAPI.getOperationsTableStructure(params)
        console.log('useOperationsTableStructure: Response received:', result)
        return result
      } catch (error) {
        console.error('useOperationsTableStructure: Error:', error)
        console.error('useOperationsTableStructure: Error response:', error.response?.data)
        // Return empty data structure instead of throwing to prevent app crash
        return {
          status: 'ERROR',
          data: { data: { fields: [], views: [] } }
        }
      }
    },
    enabled: true,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes as structure doesn't change often
    retry: false, // Don't retry on error to prevent infinite loops
  })
}

// Get operations list (Список операций) using v2/items/operations
export const useOperationsList = (params = {}) => {
  return useQuery({
    queryKey: ['operationsList', params],
    queryFn: async () => {
      console.log('useOperationsList: Making request with params:', params)
      try {
        const result = await dashboardAPI.getOperationsList(params)
        console.log('useOperationsList: Response received:', result)
        return result
      } catch (error) {
        console.error('useOperationsList: Error:', error)
        console.error('useOperationsList: Error response:', error.response?.data)
        // Return empty data structure instead of throwing to prevent app crash
        return {
          status: 'ERROR',
          data: { data: { count: 0, response: [] } }
        }
      }
    },
    enabled: true,
    staleTime: 1 * 60 * 1000, // Cache for 1 minute
    retry: false, // Don't retry on error to prevent infinite loops
  })
}
