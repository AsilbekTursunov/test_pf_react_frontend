import { useState, useEffect, useMemo } from 'react'

export function useDashboardData() {
  const [activeMethod, setActiveMethod] = useState('accrual')
  const [activeCashFlow, setActiveCashFlow] = useState('general')
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [selectedPeriod, setSelectedPeriod] = useState('months')
  const [selectedEntity, setSelectedEntity] = useState('all')
  const [selectedProject, setSelectedProject] = useState('all')
  const [dateRange, setDateRange] = useState([0, 11])
  const [cashFlowDateRange, setCashFlowDateRange] = useState([0, 11])
  const [balanceRange, setBalanceRange] = useState([0, 17])
  const [paymentRange, setPaymentRange] = useState([0, 6])
  const [expensesRange, setExpensesRange] = useState([0, 6])
  const [activePaymentView, setActivePaymentView] = useState('income')
  const [activeClientMethod, setActiveClientMethod] = useState('accrual')
  const [activeProjectMethod, setActiveProjectMethod] = useState('accrual')
  const [activeProjectView, setActiveProjectView] = useState('profit')
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          setIsLoading(false)
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  // Simulate data refresh when filters change
  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true)
      setLoadingProgress(0)
      
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            setIsLoading(false)
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 20
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [selectedPeriod, selectedEntity, selectedProject, activeMethod])

  const getDateRangeText = () => {
    const startMonth = monthNames[dateRange[0]]
    const endMonth = monthNames[dateRange[1]]
    return `${startMonth} '26–${endMonth} '26`
  }

  const dateRangeText = useMemo(() => getDateRangeText(), [dateRange])

  return {
    activeMethod,
    setActiveMethod,
    activeCashFlow,
    setActiveCashFlow,
    isLoading,
    loadingProgress,
    selectedPeriod,
    setSelectedPeriod,
    selectedEntity,
    setSelectedEntity,
    selectedProject,
    setSelectedProject,
    dateRange,
    setDateRange,
    cashFlowDateRange,
    setCashFlowDateRange,
    balanceRange,
    setBalanceRange,
    paymentRange,
    setPaymentRange,
    expensesRange,
    setExpensesRange,
    activePaymentView,
    setActivePaymentView,
    activeClientMethod,
    setActiveClientMethod,
    activeProjectMethod,
    setActiveProjectMethod,
    activeProjectView,
    setActiveProjectView,
    isDateRangeOpen,
    setIsDateRangeOpen,
    isDragging,
    setIsDragging,
    monthNames,
    dateRangeText
  }
}
