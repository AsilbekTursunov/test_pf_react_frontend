"use client"

import { useState, useRef, useEffect, Fragment, useMemo } from 'react'
import { cn } from '@/app/lib/utils'
import { useCounterparties, useBankAccounts, useOperationsTableStructure, useOperationsList } from '@/hooks/useDashboard'
import { OperationsFiltersSidebar } from '@/components/operations/OperationsFiltersSidebar/OperationsFiltersSidebar'
import { OperationsHeader } from '@/components/operations/OperationsHeader/OperationsHeader'
import { OperationsFooter } from '@/components/operations/OperationsFooter/OperationsFooter'
import { OperationModal } from '@/components/operations/OperationModal/OperationModal'
import styles from './operations.module.scss'

export default function OperationsPage() {
  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const [selectedFilters, setSelectedFilters] = useState({
    postupleniye: true,
    vyplata: true,
    peremeshcheniye: true,
    nachisleniye: true,
    otmena: true,
    postavka: true
  })

  const [dateFilters, setDateFilters] = useState({
    podtverzhdena: true,
    nePodtverzhdena: false
  })

  const [dateStartFilters, setDateStartFilters] = useState({
    podtverzhdena: true,
    nePodtverzhdena: false
  })

  const [selectedDatePaymentRange, setSelectedDatePaymentRange] = useState(null)
  const [selectedDateStartRange, setSelectedDateStartRange] = useState(null)
  const [selectedAccounts, setSelectedAccounts] = useState({}) // Will store account GUIDs
  const [selectedCounterAgents, setSelectedCounterAgents] = useState({})
  const [selectedFinancialAccounts, setSelectedFinancialAccounts] = useState({})

  // Build filters object for API request using correct API keys
  const filtersForAPI = useMemo(() => {
    const filters = {}
    
    // Type filters - tip is an array in API, so we build array of selected types
    const selectedTypes = []
    if (selectedFilters.postupleniye) selectedTypes.push('Поступление')
    if (selectedFilters.vyplata) selectedTypes.push('Выплата')
    if (selectedFilters.peremeshcheniye) selectedTypes.push('Перемещение')
    if (selectedFilters.nachisleniye) selectedTypes.push('Начисление')
    if (selectedFilters.otmena) selectedTypes.push('Отмена')
    if (selectedFilters.postavka) selectedTypes.push('Поставка')
    
    // Only add tip filter if not all types are selected (to avoid unnecessary filtering)
    if (selectedTypes.length > 0 && selectedTypes.length < 6) {
      filters.tip = selectedTypes
    }
    
    // Payment confirmation filter - oplata_podtverzhdena
    if (!dateFilters.podtverzhdena && !dateFilters.nePodtverzhdena) {
      // Both unchecked - don't filter
    } else if (dateFilters.podtverzhdena && !dateFilters.nePodtverzhdena) {
      filters.oplata_podtverzhdena = true
    } else if (!dateFilters.podtverzhdena && dateFilters.nePodtverzhdena) {
      filters.oplata_podtverzhdena = false
    }
    // If both are checked, don't add filter (show all)
    
    // Date ranges - using correct API keys
    if (selectedDatePaymentRange?.start) {
      filters.data_operatsii = selectedDatePaymentRange.start
      // If end date is provided, API might need it in a different format
      if (selectedDatePaymentRange?.end) {
        filters.data_operatsii_end = selectedDatePaymentRange.end
      }
    }
    
    if (selectedDateStartRange?.start) {
      filters.data_nachisleniya = selectedDateStartRange.start
      if (selectedDateStartRange?.end) {
        filters.data_nachisleniya_end = selectedDateStartRange.end
      }
    }
    
    // Bank accounts - bank_accounts_id (array of IDs)
    const selectedAccountGuids = Object.keys(selectedAccounts).filter(guid => selectedAccounts[guid])
    if (selectedAccountGuids.length > 0) {
      filters.bank_accounts_id = selectedAccountGuids
    }
    
    // Counter agents - counterparties_id (array of IDs)
    const selectedCounterAgentGuids = Object.keys(selectedCounterAgents).filter(guid => selectedCounterAgents[guid])
    if (selectedCounterAgentGuids.length > 0) {
      filters.counterparties_id = selectedCounterAgentGuids
    }
    
    // Financial accounts (chart of accounts) - chart_of_accounts_id (array of IDs)
    const selectedFinancialAccountGuids = Object.keys(selectedFinancialAccounts).filter(guid => selectedFinancialAccounts[guid])
    if (selectedFinancialAccountGuids.length > 0) {
      filters.chart_of_accounts_id = selectedFinancialAccountGuids
    }
    
    return filters
  }, [selectedFilters, dateFilters, dateStartFilters, selectedDatePaymentRange, selectedDateStartRange, selectedAccounts, selectedCounterAgents, selectedFinancialAccounts])

  // Fetch data from API
  const { data: counterAgentsData } = useCounterparties({ limit: 500 })
  const { data: bankAccountsData } = useBankAccounts({ limit: 500 })
  const { data: operationsTableStructureData, isLoading: isLoadingTableStructure } = useOperationsTableStructure()
  const { data: operationsListData, isLoading: isLoadingOperations } = useOperationsList({
    limit: 100,
    offset: 0,
    filters: filtersForAPI
  })

  // Extract and transform data from API responses
  const counterAgents = (counterAgentsData?.data?.data?.response || []).map(item => ({
    guid: item.guid,
    label: item.nazvanie || '',
    group: (Array.isArray(item.gruppa) && item.gruppa.length > 0) ? item.gruppa[0] : 'Без группы'
  }))

  // Transform bank accounts data
  const bankAccounts = (bankAccountsData?.data?.data?.response || []).map(item => ({
    guid: item.guid,
    label: item.nazvanie || '',
    group: item.legal_entity_id_data?.nazvanie || 'Без группы'
  }))
  
  // Extract operations table structure
  const operationsTableStructure = operationsTableStructureData?.data?.data || null
  const operationsFields = operationsTableStructure?.fields || []
  const operationsViews = operationsTableStructure?.views || []

  // Extract operations list from API response (v2/items/operations format)
  const operationsItems = operationsListData?.data?.data?.response || operationsListData?.data?.response || []
  
  // Transform operations data for display
  const operations = useMemo(() => {
    if (!operationsItems || operationsItems.length === 0) return []
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return operationsItems.map((item, index) => {
      const operationDate = item.data_operatsii ? new Date(item.data_operatsii) : null
      const accrualDate = item.data_nachisleniya ? new Date(item.data_nachisleniya) : null
      
      // Determine section based on date
      let section = 'yesterday'
      if (operationDate) {
        const opDate = new Date(operationDate)
        opDate.setHours(0, 0, 0, 0)
        const diffTime = today - opDate
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) {
          section = 'today'
        } else if (diffDays === 1) {
          section = 'yesterday'
        }
      }
      
      // Determine operation type from tip array
      let type = 'out'
      let typeLabel = 'Выплата'
      if (item.tip && Array.isArray(item.tip)) {
        if (item.tip.includes('Поступление')) {
          type = 'in'
          typeLabel = 'Поступление'
        } else if (item.tip.includes('Перемещение')) {
          type = 'transfer'
          typeLabel = 'Перемещение'
        } else if (item.tip.includes('Начисление')) {
          type = 'transfer'
          typeLabel = 'Начисление'
        } else if (item.tip.includes('Выплата')) {
          type = 'out'
          typeLabel = 'Выплата'
        } else {
          // Use first type from array
          typeLabel = item.tip[0] || 'Выплата'
        }
      }
      
      // Format dates
      const formatDate = (date) => {
        if (!date) return ''
        try {
          const d = new Date(date)
          const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
          return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
        } catch {
          return ''
        }
      }
      
      // Format amount
      const amount = item.summa || 0
      const amountFormatted = amount >= 0 ? `+${amount.toLocaleString('ru-RU')}` : `${amount.toLocaleString('ru-RU')}`
      
      // Get type text from tip array
      const typeText = typeLabel
      
      return {
        id: item.guid || index,
        guid: item.guid,
        type: typeText,
        typeCategory: type, // 'in', 'out', 'transfer'
        typeLabel: typeLabel,
        accrualDate: formatDate(accrualDate),
        operationDate: formatDate(operationDate),
        paymentConfirmed: item.oplata_podtverzhdena,
        amount: amountFormatted,
        amountRaw: amount,
        currency: item.currenies_id_data?.nazvanie || '',
        currencyId: item.currenies_id || null,
        description: item.opisanie || '',
        chartOfAccounts: item.chart_of_accounts_id_data?.nazvanie || '',
        chartOfAccountsId: item.chart_of_accounts_id || null,
        bankAccount: item.bank_accounts_id_data?.nazvanie || '',
        bankAccountId: item.bank_accounts_id || null,
        counterparty: item.counterparties_id_data?.nazvanie || '',
        counterpartyId: item.counterparties_id || null,
        createdAt: formatDate(item.data_sozdaniya ? new Date(item.data_sozdaniya) : null),
        createdAtRaw: item.data_sozdaniya,
        updatedAt: formatDate(item.data_obnovleniya ? new Date(item.data_obnovleniya) : null),
        updatedAtRaw: item.data_obnovleniya,
        section: section,
        rawData: item // Store raw data for modal
      }
    })
  }, [operationsItems])

  const [isDatePaymentModalOpen, setIsDatePaymentModalOpen] = useState(false)
  const [isDateStartModalOpen, setIsDateStartModalOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0))
  const [activeInput, setActiveInput] = useState(null) // 'start' or 'end'
  const [tempStartDate, setTempStartDate] = useState(null)
  const [tempEndDate, setTempEndDate] = useState(null)
  const [isClosing, setIsClosing] = useState(false)
  const datePickerRef = useRef(null)
  const dateStartPickerRef = useRef(null)
  const [openParameterDropdown, setOpenParameterDropdown] = useState(null)
  const parameterDropdownRef = useRef(null)
  
  const closeDatePaymentModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsDatePaymentModalOpen(false)
      setIsClosing(false)
      setActiveInput(null)
    }, 200)
  }
  
  const closeDateStartModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsDateStartModalOpen(false)
      setIsClosing(false)
      setActiveInput(null)
    }, 200)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target) &&
          dateStartPickerRef.current && !dateStartPickerRef.current.contains(event.target)) {
        closeDatePaymentModal()
        closeDateStartModal()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleAccount = (key) => {
    setSelectedAccounts(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const selectAllAccounts = () => {
    const allSelected = {}
    bankAccounts.forEach(account => allSelected[account.guid] = true)
    setSelectedAccounts(allSelected)
  }

  const [selectedOperations, setSelectedOperations] = useState([])
  const [expandedRows, setExpandedRows] = useState([])
  const [openModal, setOpenModal] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [isModalClosing, setIsModalClosing] = useState(false)
  const [isModalOpening, setIsModalOpening] = useState(false)
  
  const toggleOperation = (id) => {
    setSelectedOperations(prev => 
      prev.includes(id) ? prev.filter(opId => opId !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedOperations.length === operations.length) {
      setSelectedOperations([])
    } else {
      setSelectedOperations(operations.map(op => op.id))
    }
  }

  const isAllSelected = operations.length > 0 && selectedOperations.length === operations.length

  const toggleExpand = (id) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  const openOperationModal = (operation) => {
    setOpenModal(operation)
    setIsModalClosing(false)
    setIsModalOpening(true)
    // Блокируем скролл страницы
    document.body.style.overflow = 'hidden'
    // Определяем тип модалки по типу операции
    if (operation.typeCategory === 'transfer') {
      setModalType('accrual')
    } else if (operation.typeCategory === 'out') {
      setModalType('payment')
    } else if (operation.typeCategory === 'in') {
      setModalType('income')
    } else {
      setModalType('payment')
    }
    // Запускаем анимацию появления
    setTimeout(() => {
      setIsModalOpening(false)
    }, 50)
  }

  const closeOperationModal = () => {
    setIsModalClosing(true)
    // Разблокируем скролл страницы
    document.body.style.overflow = 'auto'
    setTimeout(() => {
      setOpenModal(null)
      setIsModalClosing(false)
    }, 300) // Длительность анимации
  }

  const selectedTotal = useMemo(() => {
    return operations
    .filter(op => selectedOperations.includes(op.id))
      .reduce((sum, op) => {
        const amount = op.rawData?.summa || 0
        return sum + amount
      }, 0)
  }, [operations, selectedOperations])


  const toggleFilter = (category, key) => {
    console.log('toggleFilter called:', { category, key })
    if (category === 'type') {
      setSelectedFilters(prev => {
        const newValue = !prev[key]
        console.log('Updating filter:', { key, oldValue: prev[key], newValue })
        return { ...prev, [key]: newValue }
      })
    } else if (category === 'date') {
      setDateFilters(prev => ({ ...prev, [key]: !prev[key] }))
    } else if (category === 'dateStart') {
      setDateStartFilters(prev => ({ ...prev, [key]: !prev[key] }))
    }
  }

  const handleAccountToggle = (key) => {
    setSelectedAccounts(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSelectAllCounterAgents = () => {
    const allSelected = {}
    counterAgents.forEach(ca => allSelected[ca.guid] = true)
    setSelectedCounterAgents(allSelected)
  }

  const handleCounterAgentToggle = (guid) => {
    setSelectedCounterAgents(prev => ({ ...prev, [guid]: !prev[guid] }))
  }


  return (
    <div className={styles.container}>
      {/* Sidebar Filters */}
      <OperationsFiltersSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedFilters={selectedFilters}
        onFilterChange={toggleFilter}
        dateFilters={dateFilters}
        onDateFilterChange={(key) => toggleFilter('date', key)}
        dateStartFilters={dateStartFilters}
        onDateStartFilterChange={(key) => toggleFilter('dateStart', key)}
        selectedDatePaymentRange={selectedDatePaymentRange}
        onDatePaymentRangeChange={setSelectedDatePaymentRange}
        selectedDateStartRange={selectedDateStartRange}
        onDateStartRangeChange={setSelectedDateStartRange}
        bankAccounts={bankAccounts}
        selectedAccounts={selectedAccounts}
        onAccountToggle={handleAccountToggle}
        onSelectAllAccounts={selectAllAccounts}
        counterAgents={counterAgents}
        selectedCounterAgents={selectedCounterAgents}
        onCounterAgentToggle={handleCounterAgentToggle}
        onSelectAllCounterAgents={handleSelectAllCounterAgents}
      />

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <OperationsHeader 
          isFilterOpen={isFilterOpen}
          onFilterToggle={() => setIsFilterOpen(true)}
        />

        {/* Table */}
        <div className={styles.tableArea}>
          {/* Selection Bar */}
          {selectedOperations.length > 0 && (
            <div className={styles.selectionBar}>
              <div className={styles.selectionBarLeft}>
                <button 
                  onClick={() => setSelectedOperations([])}
                  className={styles.selectionBarClose}
                >
                  ✕
                </button>
                <span className={styles.selectionBarText}>
                  Выбрано: <strong className={styles.selectionBarTextBold}>{selectedOperations.length}</strong> на сумму <strong className={cn(styles.selectionBarTextBold, selectedTotal >= 0 ? styles.selectionBarTextPositive : styles.selectionBarTextNegative)}>{selectedTotal >= 0 ? '+' : ''}{selectedTotal.toLocaleString('ru-RU')} ₽</strong>
                </span>
              </div>
              <div className={styles.selectionBarRight}>
                <button className={styles.selectionBarExport}>
                  <svg className={styles.selectionBarExportIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Экспорт выбранных
                </button>
              </div>
            </div>
          )}

          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr className={styles.tableHeaderRow}>
                <th className={cn(styles.tableHeaderCell, styles.tableHeaderCellCheckbox)}>
                  <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className={styles.checkboxInput}
                    />
                    <div 
                      className={cn(
                        styles.checkbox,
                        isAllSelected && styles.checkboxChecked
                      )}
                      style={{
                        '--checkbox-bg': isAllSelected ? '#17a2b8' : 'white',
                        '--checkbox-border': isAllSelected ? '#17a2b8' : '#cbd5e1',
                        '--checkbox-hover-border': '#94a3b8',
                        width: '18px',
                        height: '18px',
                        borderRadius: '0.125rem'
                      }}
                      onClick={toggleSelectAll}
                    >
                      {isAllSelected && (
                        <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" style={{ width: '0.75rem', height: '0.75rem' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </th>
                <th className={styles.tableHeaderCell}>Тип</th>
                <th className={styles.tableHeaderCell}>Дата начисления</th>
                <th className={styles.tableHeaderCell}>
                  <button className={styles.tableHeaderButton}>
                    Дата операции
                    <svg className={styles.tableHeaderIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </button>
                </th>
                <th className={styles.tableHeaderCell}>Оплата подтверждена</th>
                <th className={styles.tableHeaderCell}>Сумма</th>
                <th className={styles.tableHeaderCell}>Валюты</th>
                <th className={styles.tableHeaderCell}>Описание</th>
                <th className={styles.tableHeaderCell}>Учетные статьи</th>
                <th className={styles.tableHeaderCell}>Банковские счета</th>
                <th className={styles.tableHeaderCell}>Контрагенты</th>
                <th className={styles.tableHeaderCell}>Дата создания</th>
                <th className={styles.tableHeaderCell}>Дата обновления</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'white' }}>
              {isLoadingOperations ? (
                <tr>
                  <td colSpan="13" style={{ textAlign: 'center', padding: '2rem' }}>
                    Загрузка данных...
                  </td>
                </tr>
              ) : operations.length === 0 ? (
                <tr>
                  <td colSpan="13" style={{ textAlign: 'center', padding: '2rem' }}>
                    Нет данных
                  </td>
                </tr>
              ) : (
                <>
              {/* Сегодня - Section Header */}
              {operations.filter(op => op.section === 'today').length > 0 && (
                <tr className={styles.sectionHeader}>
                  <td colSpan="13" className={styles.sectionHeaderCell}>
                    <h3 className={styles.sectionHeaderTitle}>Сегодня</h3>
                  </td>
                </tr>
              )}

              {/* Today Operations */}
                  {operations.filter(op => op.section === 'today').map((op) => (
                    <tr key={op.id} className={styles.tableRow} onClick={(e) => {
                      if (!e.target.closest('input') && !e.target.closest('button')) {
                        openOperationModal(op)
                      }
                    }}>
                      <td className={cn(styles.tableCell, styles.tableCellCheckbox)} onClick={(e) => e.stopPropagation()}>
                        <div style={{ position: 'relative' }}>
                          <input 
                            type="checkbox" 
                            checked={selectedOperations.includes(op.id)}
                            onChange={() => toggleOperation(op.id)}
                            className={styles.checkboxInput}
                          />
                          <div 
                            className={cn(
                              styles.checkbox,
                              selectedOperations.includes(op.id) && styles.checkboxChecked
                            )}
                            style={{
                              '--checkbox-bg': selectedOperations.includes(op.id) ? '#17a2b8' : 'white',
                              '--checkbox-border': selectedOperations.includes(op.id) ? '#17a2b8' : '#cbd5e1',
                              '--checkbox-hover-border': '#94a3b8',
                              width: '18px',
                              height: '18px',
                              borderRadius: '0.125rem'
                            }}
                            onClick={() => toggleOperation(op.id)}
                          >
                            {selectedOperations.includes(op.id) && (
                              <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" style={{ width: '0.75rem', height: '0.75rem' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.dateCell}>
                          <span className={styles.datePrimary}>{op.date}</span>
                      {op.dateSecondary && (
                        <span className={styles.dateSecondary}>{op.dateSecondary}</span>
                      )}
                      </div>
                    </td>
                    <td className={cn(styles.tableCell, styles.accountCell)}>{op.account}</td>
                    <td className={styles.tableCell}>
                      {op.typeLabel ? (
                        <span className={cn(
                          styles.typeBadge,
                          op.typeCategory === 'in' && styles.typeBadgeIn,
                          op.typeCategory === 'out' && styles.typeBadgeOut,
                          op.typeCategory === 'transfer' && styles.typeBadgeTransfer
                        )}>
                          {op.typeLabel}
                        </span>
                      ) : null}
                    </td>
                  <td className={cn(styles.tableCell, styles.counterpartyCell)}>{op.counterparty}</td>
                  <td className={cn(styles.tableCell, styles.statusCell)}>{op.status}</td>
                    <td className={cn(styles.tableCell, styles.projectCell)}>{op.project}</td>
                    <td className={cn(styles.tableCell, styles.projectCell)}></td>
                    <td className={cn(
                      styles.tableCell,
                      styles.amountCell,
                      op.amount.startsWith('+') ? styles.positive : styles.negative
                    )}>
                    {op.amount}
                      </td>
                    </tr>
              ))}

              {/* Вчера и ранее - Section Header */}
              {operations.filter(op => op.section === 'yesterday').length > 0 && (
              <tr className={styles.sectionHeader}>
                  <td colSpan="13" className={styles.sectionHeaderCell}>
                  <h3 className={styles.sectionHeaderTitle}>Вчера и ранее</h3>
                </td>
              </tr>
              )}

              {/* Yesterday Operations */}
              {operations.filter(op => op.section === 'yesterday').map((op) => (
                <tr key={op.id} className={styles.tableRow} onClick={(e) => {
                  if (!e.target.closest('input') && !e.target.closest('button')) {
                    openOperationModal(op)
                  }
                }}>
                  <td className={cn(styles.tableCell, styles.tableCellCheckbox)} onClick={(e) => e.stopPropagation()}>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedOperations.includes(op.id)}
                        onChange={() => toggleOperation(op.id)}
                        className={styles.checkboxInput}
                      />
                      <div 
                        className={cn(
                          styles.checkbox,
                          selectedOperations.includes(op.id) && styles.checkboxChecked
                        )}
                        style={{
                          '--checkbox-bg': selectedOperations.includes(op.id) ? '#17a2b8' : 'white',
                          '--checkbox-border': selectedOperations.includes(op.id) ? '#17a2b8' : '#cbd5e1',
                          '--checkbox-hover-border': '#94a3b8',
                          width: '18px',
                          height: '18px',
                          borderRadius: '0.125rem'
                        }}
                        onClick={() => toggleOperation(op.id)}
                      >
                        {selectedOperations.includes(op.id) && (
                          <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" style={{ width: '0.75rem', height: '0.75rem' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    {op.typeLabel ? (
                      <span className={cn(
                        styles.typeBadge,
                        op.typeCategory === 'in' && styles.typeBadgeIn,
                        op.typeCategory === 'out' && styles.typeBadgeOut,
                        op.typeCategory === 'transfer' && styles.typeBadgeTransfer
                      )}>
                        {op.typeLabel}
                      </span>
                    ) : null}
                  </td>
                  <td className={styles.tableCell}>{op.accrualDate || null}</td>
                  <td className={styles.tableCell}>{op.operationDate || null}</td>
                  <td className={styles.tableCell}>
                    {op.paymentConfirmed !== undefined ? (op.paymentConfirmed ? 'Да' : 'Нет') : null}
                  </td>
                  <td className={cn(
                    styles.tableCell,
                    styles.amountCell,
                    op.amount.startsWith('+') ? styles.positive : styles.negative
                  )}>
                    {op.amount || null}
                  </td>
                  <td className={styles.tableCell}>{op.currency || null}</td>
                  <td className={styles.tableCell}>{op.description || null}</td>
                  <td className={styles.tableCell}>{op.chartOfAccounts || null}</td>
                  <td className={styles.tableCell}>{op.bankAccount || null}</td>
                  <td className={styles.tableCell}>{op.counterparty || null}</td>
                  <td className={styles.tableCell}>{op.createdAt || null}</td>
                  <td className={styles.tableCell}>{op.updatedAt || null}</td>
                </tr>
              ))}
                </>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Stats */}
        <OperationsFooter isFilterOpen={isFilterOpen} operations={operations} />
      </div>

      {/* Right Side Modal */}
      {openModal && (
        <OperationModal
          operation={openModal}
          modalType={modalType}
          isClosing={isModalClosing}
          isOpening={isModalOpening}
          onClose={closeOperationModal}
        />
      )}
    </div>
  )
}
