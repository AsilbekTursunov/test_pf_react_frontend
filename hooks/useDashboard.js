import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardAPI } from '@/lib/api/dashboard'

// Get dashboard data
export const useDashboardData = (params) => {
  return useQuery({
    queryKey: ['dashboard', params],
    queryFn: () => dashboardAPI.getDashboardData(params),
  })
}

// Get counter agents (Контрагенты)
export const useCounterAgents = (params = {}) => {
  return useQuery({
    queryKey: ['counterAgents', params],
    queryFn: () => dashboardAPI.getCounterAgents({ page: 1, limit: 500, search: '', ...params }),
    staleTime: 5 * 60 * 1000,
  })
}

// Get legal entities with accounts (Юрлица)
export const useLegalEntitiesWithAccounts = (params = {}) => {
  return useQuery({
    queryKey: ['legalEntitiesWithAccounts', params],
    queryFn: () => dashboardAPI.getLegalEntitiesWithAccounts({ page: 1, limit: 500, search: '', ...params }),
    staleTime: 5 * 60 * 1000,
  })
}

// Get projects (Проекты)
export const useProjects = (params = {}) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => dashboardAPI.getProjects({ page: 1, limit: 500, search: '', ...params }),
    staleTime: 5 * 60 * 1000,
  })
}

// Get financial accounts (Статьи учета)
export const useFinancialAccounts = (params = {}) => {
  return useQuery({
    queryKey: ['financialAccounts', params],
    queryFn: () => dashboardAPI.getFinancialAccounts({ page: 1, limit: 1000, ...params }),
    staleTime: 5 * 60 * 1000,
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
