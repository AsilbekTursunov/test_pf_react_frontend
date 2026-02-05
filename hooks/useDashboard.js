import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardAPI } from '@/lib/api/dashboard'
import { showSuccessNotification, showErrorNotification } from '@/lib/utils/notifications'

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
      queryClient.invalidateQueries({ queryKey: ['operationsList'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      showSuccessNotification('Операция успешно удалена!')
    },
    onError: (error) => {
      showErrorNotification(error.message || 'Ошибка при удалении операции')
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

// Get chart of accounts using v2/items/chart_of_accounts endpoint (GET)
export const useChartOfAccountsV2 = (params = {}) => {
  return useQuery({
    queryKey: ['chartOfAccountsV2', params],
    queryFn: async () => {
      console.log('useChartOfAccountsV2: Making request with params:', params)
      try {
        const result = await dashboardAPI.getChartOfAccountsV2(params)
        console.log('useChartOfAccountsV2: Response received:', result)
        return result
      } catch (error) {
        console.error('useChartOfAccountsV2: Error:', error)
        console.error('useChartOfAccountsV2: Error response:', error.response?.data)
        // Return empty data structure instead of throwing to prevent app crash
        return {
          status: 'ERROR',
          data: { data: { count: 0, response: [] } }
        }
      }
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
    retry: false,
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

// Get currencies (Валюты)
export const useCurrencies = (params = {}) => {
  return useQuery({
    queryKey: ['currencies', params],
    queryFn: async () => {
      console.log('useCurrencies: Making request with params:', params)
      try {
        const response = await fetch('/api/currencies?' + new URLSearchParams({
          data: JSON.stringify({ limit: params.limit || 100, offset: params.offset || 0 })
        }))
        const result = await response.json()
        console.log('useCurrencies: Response received:', result)
        return result
      } catch (error) {
        console.error('useCurrencies: Error:', error)
        return {
          status: 'ERROR',
          data: { data: { count: 0, response: [] } }
        }
      }
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
    retry: false,
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

// Get counterparties using v2/items/counterparties endpoint
export const useCounterpartiesV2 = (params = {}) => {
  return useQuery({
    queryKey: ['counterpartiesV2', params],
    queryFn: () => dashboardAPI.getCounterpartiesV2(params),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  })
}

// Create counterparty mutation
export const useCreateCounterparty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dashboardAPI.createCounterparty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counterpartiesV2'] })
      queryClient.invalidateQueries({ queryKey: ['counterparties'] })
      showSuccessNotification('Контрагент успешно создан!')
    },
    onError: (error) => {
      showErrorNotification(error.message || 'Ошибка при создании контрагента')
    },
  })
}

// Get counterparties groups using v2/items/counterparties_group endpoint
export const useCounterpartiesGroupsV2 = (params = {}) => {
  return useQuery({
    queryKey: ['counterpartiesGroupsV2', params],
    queryFn: () => dashboardAPI.getCounterpartiesGroupsV2(params),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  })
}

// Create counterparties group mutation
export const useCreateCounterpartiesGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dashboardAPI.createCounterpartiesGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counterpartiesGroupsV2'] })
      showSuccessNotification('Группа контрагентов успешно создана!')
    },
    onError: (error) => {
      showErrorNotification(error.message || 'Ошибка при создании группы контрагентов')
    },
  })
}

// Update counterparties group mutation
export const useUpdateCounterpartiesGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dashboardAPI.updateCounterpartiesGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counterpartiesGroupsV2'] })
      queryClient.invalidateQueries({ queryKey: ['counterpartiesV2'] })
      showSuccessNotification('Группа контрагентов успешно обновлена!')
    },
    onError: (error) => {
      showErrorNotification(error.message || 'Ошибка при обновлении группы контрагентов')
    },
  })
}

// Delete counterparties groups mutation
export const useDeleteCounterpartiesGroups = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dashboardAPI.deleteCounterpartiesGroups,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counterpartiesGroupsV2'] })
      queryClient.invalidateQueries({ queryKey: ['counterpartiesV2'] })
      showSuccessNotification('Группы контрагентов успешно удалены!')
    },
    onError: (error) => {
      showErrorNotification(error.message || 'Ошибка при удалении групп контрагентов')
    },
  })
}

// Update counterparty mutation
export const useUpdateCounterparty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dashboardAPI.updateCounterparty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counterpartiesV2'] })
      queryClient.invalidateQueries({ queryKey: ['counterparties'] })
      showSuccessNotification('Контрагент успешно обновлен!')
    },
    onError: (error) => {
      showErrorNotification(error.message || 'Ошибка при обновлении контрагента')
    },
  })
}

// Delete counterparties mutation
export const useDeleteCounterparties = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dashboardAPI.deleteCounterparties,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counterpartiesV2'] })
      queryClient.invalidateQueries({ queryKey: ['counterparties'] })
      showSuccessNotification('Контрагент(ы) успешно удален(ы)!')
    },
    onError: (error) => {
      showErrorNotification(error.message || 'Ошибка при удалении контрагента(ов)')
    },
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

// Create chart of accounts mutation
export const useCreateChartOfAccounts = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dashboardAPI.createChartOfAccounts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chartOfAccountsV2'] })
    },
  })
}

// Update chart of accounts mutation
export const useUpdateChartOfAccounts = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dashboardAPI.updateChartOfAccounts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chartOfAccountsV2'] })
    },
  })
}

// Delete chart of accounts mutation
export const useDeleteChartOfAccounts = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dashboardAPI.deleteChartOfAccounts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chartOfAccountsV2'] })
    },
  })
}

// Get my accounts (Мои счета) - v2/items/my_accounts
export const useMyAccountsV2 = (params = {}) => {
  return useQuery({
    queryKey: ['myAccountsV2', params],
    queryFn: () => dashboardAPI.getMyAccountsV2(params),
  })
}

// Create my account mutation
export const useCreateMyAccount = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: dashboardAPI.createMyAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAccountsV2'] })
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] })
      showSuccessNotification('Счет успешно создан!')
    },
    onError: (error) => {
      showErrorNotification(error.response?.data?.description || error.message || 'Ошибка при создании счета')
    },
  })
}

// Update my account mutation
export const useUpdateMyAccount = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: dashboardAPI.updateMyAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAccountsV2'] })
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] })
      showSuccessNotification('Счет успешно обновлен!')
    },
    onError: (error) => {
      showErrorNotification(error.response?.data?.description || error.message || 'Ошибка при обновлении счета')
    },
  })
}

// Delete my accounts mutation
export const useDeleteMyAccounts = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: dashboardAPI.deleteMyAccounts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAccountsV2'] })
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] })
      showSuccessNotification('Счета успешно удалены!')
    },
    onError: (error) => {
      showErrorNotification(error.response?.data?.description || error.message || 'Ошибка при удалении счетов')
    },
  })
}

// Get legal entities (Юрлица) - v2/items/legal_entities
export const useLegalEntitiesV2 = (params = {}) => {
  return useQuery({
    queryKey: ['legalEntitiesV2', params],
    queryFn: () => dashboardAPI.getLegalEntitiesV2(params),
    enabled: true,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: false, // Don't retry on error to prevent infinite loops
  })
}

// Get accounts groups (Группы счетов) - v2/items/accounts_group
export const useAccountsGroupsV2 = (params = {}) => {
  return useQuery({
    queryKey: ['accountsGroupsV2', params],
    queryFn: () => dashboardAPI.getAccountsGroupsV2(params),
    enabled: true,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: false, // Don't retry on error to prevent infinite loops
  })
}

// Create legal entity mutation
export const useCreateLegalEntity = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: dashboardAPI.createLegalEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legalEntitiesV2'] })
      showSuccessNotification('Юрлицо успешно создано!')
    },
    onError: (error) => {
      showErrorNotification(error.response?.data?.description || error.message || 'Ошибка при создании юрлица')
    },
  })
}

// Update legal entity mutation
export const useUpdateLegalEntity = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: dashboardAPI.updateLegalEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legalEntitiesV2'] })
      showSuccessNotification('Юрлицо успешно обновлено!')
    },
    onError: (error) => {
      showErrorNotification(error.response?.data?.description || error.message || 'Ошибка при обновлении юрлица')
    },
  })
}

// Delete legal entities mutation
export const useDeleteLegalEntities = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: dashboardAPI.deleteLegalEntities,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legalEntitiesV2'] })
      showSuccessNotification('Юрлицо успешно удалено!')
    },
    onError: (error) => {
      showErrorNotification(error.response?.data?.description || error.message || 'Ошибка при удалении юрлица')
    },
  })
}


// Get finance summary
export const useFinanceSummary = (params) => {
  return useQuery({
    queryKey: ['financeSummary', params],
    queryFn: () => dashboardAPI.getFinanceSummary(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
