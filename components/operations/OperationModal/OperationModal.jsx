"use client"

import { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/app/lib/utils'
import { GroupedSelect } from '@/components/common/GroupedSelect/GroupedSelect'
import { TreeSelect } from '@/components/common/TreeSelect/TreeSelect'
import { useCounterpartiesV2, useCounterpartiesGroupsV2, useChartOfAccountsV2, useMyAccountsV2, useLegalEntitiesV2, useCurrencies } from '@/hooks/useDashboard'
import { showSuccessNotification, showErrorNotification } from '@/lib/utils/notifications'
import styles from './OperationModal.module.scss'

export function OperationModal({ operation, modalType, isClosing, isOpening, onClose, preselectedCounterparty = null }) {
  const queryClient = useQueryClient()
  const isNew = operation?.isNew || false
  // Current active tab
  const [activeTab, setActiveTab] = useState(modalType || 'income')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Initialize form data from operation or defaults
  const getInitialFormData = () => {
    if (operation && !isNew && operation.rawData) {
      // Editing existing operation - use rawData
      const raw = operation.rawData
      const paymentDate = raw.data_operatsii ? new Date(raw.data_operatsii).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      const accrualDate = raw.data_nachisleniya ? new Date(raw.data_nachisleniya).toISOString().split('T')[0] : paymentDate
      
      return {
        paymentDate,
        confirmPayment: raw.oplata_podtverzhdena || false,
        accountAndLegalEntity: raw.bank_accounts_id || null,
        amount: raw.summa ? Math.abs(raw.summa) : '',
        counterparty: raw.counterparties_id || null,
        chartOfAccount: raw.chart_of_accounts_id || null,
    project: null,
    purchaseDeal: null,
    salesDeal: null,
        purpose: raw.opisanie || '',
    // For transfer
        fromDate: paymentDate,
        fromAccount: raw.bank_accounts_id || null,
        fromAmount: raw.summa ? Math.abs(raw.summa) : '',
        toDate: paymentDate,
    toAccount: null,
    toAmount: '0',
        // For accrual
        accrualDate,
    confirmAccrual: false,
    legalEntity: raw.legal_entity_id || null,
        expenseItem: raw.chart_of_accounts_id || null,
    cashMethod: true,
    creditItem: null,
        currenies_id: raw.currenies_id || null,
      }
    }
    
    // New operation - use defaults
    return {
      paymentDate: new Date().toISOString().split('T')[0],
      confirmPayment: false,
      accountAndLegalEntity: null,
      amount: '',
      counterparty: preselectedCounterparty || null,
      chartOfAccount: null,
      project: null,
      purchaseDeal: null,
      salesDeal: null,
      purpose: '',
      // For transfer
      fromDate: new Date().toISOString().split('T')[0],
      fromAccount: null,
      fromAmount: '',
      toDate: new Date().toISOString().split('T')[0],
      toAccount: null,
      toAmount: '0',
      // For accrual
      accrualDate: new Date().toISOString().split('T')[0],
      confirmAccrual: false,
      legalEntity: null,
      expenseItem: null,
      cashMethod: true,
      creditItem: null,
      currenies_id: null,
    }
  }

  // Form state
  const [formData, setFormData] = useState(getInitialFormData())
  // Fetch data from API - using V2 endpoints
  const { data: counterpartiesData, isLoading: loadingCounterparties } = useCounterpartiesV2({ data: {} })
  const { data: counterpartiesGroupsData } = useCounterpartiesGroupsV2({ data: {} })
  const { data: chartOfAccountsData, isLoading: loadingChartOfAccounts } = useChartOfAccountsV2({ data: {} })
  const { data: bankAccountsData, isLoading: loadingBankAccounts } = useMyAccountsV2({ data: {} })
  const { data: legalEntitiesData, isLoading: loadingLegalEntities } = useLegalEntitiesV2({ data: {} })
  const { data: currenciesData, isLoading: loadingCurrencies } = useCurrencies({ limit: 100 })

  // Build tree structure for counterparties (groups and their children)
  const counterAgentsTree = useMemo(() => {
    const counterparties = counterpartiesData?.data?.data?.response || []
    const groups = counterpartiesGroupsData?.data?.data?.response || []
    
    if (counterparties.length === 0) return []
    
    // Create a map of groups by guid
    const groupsMap = new Map()
    groups.forEach(group => {
      groupsMap.set(group.guid, group)
    })
    
    // Build child items map: groupGuid -> [counterparties]
    const childItemsMap = new Map()
    const allChildGuids = new Set()
    
    counterparties.forEach(item => {
      if (item.counterparties_group_id) {
        const groupGuid = item.counterparties_group_id
        if (!childItemsMap.has(groupGuid)) {
          childItemsMap.set(groupGuid, [])
        }
        childItemsMap.get(groupGuid).push(item)
        allChildGuids.add(item.guid)
      }
    })
    
    // Find root items (groups and ungrouped counterparties)
    const rootItems = []
    
    // Add groups with their children
    groups.forEach(group => {
      const children = childItemsMap.get(group.guid) || []
      rootItems.push({
        guid: group.guid,
        nazvanie: group.nazvanie_gruppy || 'Без названия',
        isGroup: true,
        children: children
      })
    })
    
    // Add ungrouped counterparties as root items
    counterparties.forEach(item => {
      if (!item.counterparties_group_id) {
        rootItems.push({
          guid: item.guid,
          nazvanie: item.nazvanie || 'Без названия',
          isGroup: false,
          children: []
        })
      }
    })
    
    // Build tree structure recursively
    const buildTree = (item) => {
      const treeNode = {
        value: item.guid,
        title: item.nazvanie || item.nazvanie_gruppy || 'Без названия',
        selectable: !item.isGroup, // Groups are not selectable, only counterparties
        children: item.children && item.children.length > 0 
          ? item.children.map(child => ({
              value: child.guid,
              title: child.nazvanie || 'Без названия',
              selectable: true
            }))
          : undefined
      }
      return treeNode
    }
    
    return rootItems.map(buildTree)
  }, [counterpartiesData, counterpartiesGroupsData])
  
  // Also keep flat list for backward compatibility (if needed)
  const counterAgents = (counterpartiesData?.data?.data?.response || []).map(item => ({
    guid: item.guid,
    label: item.nazvanie || '',
    group: item.counterparties_group_id_data?.nazvanie_gruppy || 'Без группы'
  }))
  
  // Transform legal entities data
  const legalEntities = useMemo(() => {
    const items = legalEntitiesData?.data?.data?.response || []
    return items.map(item => ({
      guid: item.guid,
      label: item.nazvanie || 'Без названия',
      group: 'Юрлица' // All legal entities in one group
    }))
  }, [legalEntitiesData])
  
  // Transform chart of accounts data
  const chartOfAccounts = useMemo(() => {
    const items = chartOfAccountsData?.data?.data?.response || []
    return items.map(item => ({
      guid: item.guid,
      label: item.nazvanie || '',
      group: (Array.isArray(item.tip) && item.tip.length > 0) ? item.tip[0] : 'Без группы'
    }))
  }, [chartOfAccountsData])

  const bankAccounts = useMemo(() => {
    const items = bankAccountsData?.data?.data?.response || []
    return items.map(item => ({
      guid: item.guid,
      label: item.nazvanie || '',
      group: item.legal_entity_id_data?.nazvanie || 'Без группы',
      currenies_id: item.currenies_id || null,
      currenies_id_data: item.currenies_id_data || null
    }))
  }, [bankAccountsData])

  // Transform currencies data
  const currencies = (currenciesData?.data?.data?.response || currenciesData?.data?.response || []).map(item => ({
    guid: item.guid,
    label: `${item.kod || ''} (${item.nazvanie || ''})`.trim(),
    kod: item.kod || '',
    nazvanie: item.nazvanie || ''
  }))

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Map form data to API format
      const tipMap = {
        'income': 'Поступление',
        'payment': 'Выплата',
        'transfer': 'Перемещение',
        'accrual': 'Начисление'
      }

      const now = new Date()
      
      // Parse dates correctly - if it's a date string (YYYY-MM-DD), set time to 19:00:00 UTC
      let paymentDate = now
      if (formData.paymentDate) {
        const dateStr = formData.paymentDate
        if (typeof dateStr === 'string') {
          // Check if it's already an ISO string
          if (dateStr.includes('T') || dateStr.includes('Z')) {
            paymentDate = new Date(dateStr)
          } else if (dateStr.includes('-')) {
            // Date string format (YYYY-MM-DD): set to 19:00:00 UTC
            paymentDate = new Date(dateStr + 'T19:00:00.000Z')
          } else {
            paymentDate = new Date(dateStr)
          }
        } else {
          paymentDate = new Date(dateStr)
        }
      }

      let accrualDate = paymentDate
      if (formData.accrualDate) {
        const dateStr = formData.accrualDate
        if (typeof dateStr === 'string') {
          if (dateStr.includes('T') || dateStr.includes('Z')) {
            accrualDate = new Date(dateStr)
          } else if (dateStr.includes('-')) {
            accrualDate = new Date(dateStr + 'T19:00:00.000Z')
          } else {
            accrualDate = new Date(dateStr)
          }
        } else {
          accrualDate = new Date(dateStr)
        }
      }
      
      // Validate dates
      if (isNaN(paymentDate.getTime())) {
        console.error('Invalid payment date:', formData.paymentDate)
        paymentDate = now
      }
      if (isNaN(accrualDate.getTime())) {
        console.error('Invalid accrual date:', formData.accrualDate)
        accrualDate = paymentDate
      }

      // Get currency ID from selected bank account if available
      let currencyId = formData.currenies_id
      if (!currencyId && formData.accountAndLegalEntity) {
        const selectedAccount = bankAccounts.find(acc => acc.guid === formData.accountAndLegalEntity)
        if (selectedAccount && selectedAccount.currenies_id) {
          currencyId = selectedAccount.currenies_id
        }
      }

      // Build request data object
      const requestData = {
        tip: [tipMap[activeTab] || 'Поступление'],
        data_operatsii: paymentDate.toISOString(),
        data_nachisleniya: activeTab === 'accrual' ? accrualDate.toISOString() : paymentDate.toISOString(),
        oplata_podtverzhdena: formData.confirmPayment || false,
        summa: parseFloat(formData.amount) || 0,
        opisanie: formData.purpose || '',
        data_sozdaniya: now.toISOString(),
        data_obnovleniya: now.toISOString(),
      }

      // Add optional fields only if they have values (don't send empty strings or null)
      if (formData.accountAndLegalEntity) {
        requestData.bank_accounts_id = formData.accountAndLegalEntity
      }
      if (formData.counterparty) {
        requestData.counterparties_id = formData.counterparty
      }
      if (formData.chartOfAccount) {
        requestData.chart_of_accounts_id = formData.chartOfAccount
      }
      if (formData.legalEntity) {
        requestData.legal_entity_id = formData.legalEntity
      }
      if (currencyId) {
        requestData.currenies_id = currencyId
      }

      // Remove empty strings
      Object.keys(requestData).forEach(key => {
        if (requestData[key] === '' || requestData[key] === null || requestData[key] === undefined) {
          delete requestData[key]
        }
      })

      // Determine if this is create or update
      const isUpdate = !isNew && operation?.rawData?.guid
      const endpoint = isUpdate ? '/api/operations/update' : '/api/operations/create'
      const method = isUpdate ? 'PUT' : 'POST'
      
      // For update, add guid to request data
      if (isUpdate && operation.rawData.guid) {
        requestData.guid = operation.rawData.guid
        // Keep original creation date for update
        if (operation.rawData.data_sozdaniya) {
          requestData.data_sozdaniya = operation.rawData.data_sozdaniya
        }
      }

      console.log(`${isUpdate ? 'Updating' : 'Creating'} operation with data:`, JSON.stringify({ data: requestData }, null, 2))
      console.log('Form data:', formData)
      console.log('Selected account:', formData.accountAndLegalEntity ? bankAccounts.find(acc => acc.guid === formData.accountAndLegalEntity) : 'none')

      // Use fetch to call the API endpoint
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: requestData }),
      })

      const result = await response.json()

      if (result.status === 'ERROR') {
        throw new Error(result.data || result.description || `Ошибка при ${isUpdate ? 'обновлении' : 'создании'} операции`)
      }

      showSuccessNotification(`Операция успешно ${isUpdate ? 'обновлена' : 'создана'}!`)
      // Инвалидируем запросы для обновления списка операций
      queryClient.invalidateQueries({ queryKey: ['operationsList'] })
      queryClient.invalidateQueries({ queryKey: ['operations'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      onClose()
    } catch (error) {
      console.error(`Error ${!isNew && operation?.rawData?.guid ? 'updating' : 'creating'} operation:`, error)
      showErrorNotification(error.message || `Ошибка при ${!isNew && operation?.rawData?.guid ? 'обновлении' : 'создании'} операции`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Don't return null for new operations
  if (!operation && !isNew) return null

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={onClose}
        className={cn(
          styles.overlay,
          isClosing ? styles.closing : styles.opening
        )}
      />

      {/* Modal */}
      <div 
        className={cn(
          styles.modal,
          isOpening ? styles.opening : isClosing ? styles.closing : styles.open
        )}
      >
        <div className={styles.modalContent}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <div className={styles.headerLeft}>
              <h2 className={styles.title}>{isNew ? 'Создание операции' : 'Редактирование операции'}</h2>
                <div className={styles.headerDate}>
                  <svg className={styles.headerIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {!isNew && <span>Создана {operation?.createdAt || '—'}</span>}
                </div>
              </div>
              <button 
                onClick={onClose}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>
            {/* Tabs */}
            {activeTab === 'accrual' ? (
              <div className={styles.tabs}>
                <button 
                  className={cn(
                    styles.tab,
                    styles.tabAccrual,
                    styles.active
                  )}
                >
                  Начисление
                </button>
              </div>
            ) : (
            <div className={styles.tabs}>
                <button 
                  className={cn(
                styles.tab,
                    activeTab === 'income' ? cn(styles.tabIncome, styles.active) : styles.inactive
                  )}
                  onClick={() => setActiveTab('income')}
                >
                Поступление
              </button>
                <button 
                  className={cn(
                styles.tab,
                    activeTab === 'payment' ? cn(styles.tabPayment, styles.active) : styles.inactive
                  )}
                  onClick={() => setActiveTab('payment')}
                >
                Выплата
              </button>
                <button 
                  className={cn(
                styles.tab,
                    activeTab === 'transfer' ? cn(styles.tabTransfer, styles.active) : styles.inactive
                  )}
                  onClick={() => setActiveTab('transfer')}
                >
                Перемещение
              </button>
            </div>
            )}

            </div>

            {/* Form */}
            <div className={styles.body}>
            <div className={styles.form}>
              {/* Поступление */}
              {activeTab === 'income' && (
                <>
              {/* Дата оплаты */}
              <div className={styles.formRow}>
                <label className={styles.label}>Дата оплаты</label>
                <div className={styles.inputGroup}>
                  <input 
                        type="date" 
                        value={formData.paymentDate}
                        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                        className={styles.input}
                      />
                      <button className={styles.calendarButton}>
                        <svg className={styles.calendarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                  </button>
                      <label className={styles.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          className={styles.checkbox}
                          checked={formData.confirmPayment}
                          onChange={(e) => setFormData({ ...formData, confirmPayment: e.target.checked })}
                        />
                        <span>Подтвердить оплату</span>
                      </label>
                </div>
              </div>

              {/* Счет и юрлицо */}
              <div className={styles.formRow}>
                <label className={styles.label}>Счет и юрлицо</label>
                <GroupedSelect
                      data={bankAccounts}
                      value={formData.accountAndLegalEntity}
                      onChange={(value) => setFormData({ ...formData, accountAndLegalEntity: value })}
                  placeholder="Выберите счет..."
                  groupBy={true}
                  labelKey="label"
                  valueKey="guid"
                  groupKey="group"
                      loading={loadingBankAccounts}
                  className="flex-1"
                />
              </div>

              {/* Сумма */}
              <div className={styles.formRow}>
                <label className={styles.label}>Сумма</label>
                <div className={styles.inputGroup}>
                  <input 
                        type="number" 
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0"
                        className={styles.input}
                      />
                      <GroupedSelect
                        data={currencies}
                        value={formData.currenies_id}
                        onChange={(value) => setFormData({ ...formData, currenies_id: value })}
                        placeholder="Выберите валюту..."
                        groupBy={false}
                        labelKey="label"
                        valueKey="guid"
                        loading={loadingCurrencies}
                        className="flex-1"
                        style={{ minWidth: '180px', maxWidth: '250px' }}
                      />
                </div>
              </div>

                  {/* Разбить сумму / Добавить начисление */}
              <div className={styles.formRow}>
                <div className={styles.labelSpacer}></div>
                    <div className={styles.buttonGroup}>
                <button className={styles.button}>Разбить сумму</button>
                <button className={styles.button}>Добавить начисление</button>
                    </div>
              </div>

              {/* Контрагент */}
              <div className={styles.formRow}>
                <label className={styles.label}>Контрагент</label>
                <TreeSelect
                  data={counterAgentsTree}
                  value={formData.counterparty}
                  onChange={(value) => setFormData({ ...formData, counterparty: value })}
                  placeholder="Выберите контрагента..."
                  className="flex-1"
                />
              </div>

              {/* Статья */}
              <div className={styles.formRow}>
                <label className={styles.label}>Статья</label>
                    <GroupedSelect
                      data={chartOfAccounts}
                      value={formData.chartOfAccount}
                      onChange={(value) => setFormData({ ...formData, chartOfAccount: value })}
                  placeholder="Выберите статью..."
                      groupBy={true}
                      labelKey="label"
                      valueKey="guid"
                      groupKey="group"
                      loading={loadingChartOfAccounts}
                  className="flex-1"
                />
              </div>

              {/* Проект */}
              <div className={styles.formRow}>
                <label className={styles.label}>Проект</label>
                <GroupedSelect
                      data={[]}
                      value={formData.project}
                      onChange={(value) => setFormData({ ...formData, project: value })}
                      placeholder="Выберите проект..."
                      groupBy={false}
                      labelKey="label"
                      valueKey="guid"
                      className="flex-1"
                      disabled={true}
                    />
                  </div>

                  {/* Сделка продажи */}
                  <div className={styles.formRow}>
                    <label className={cn(styles.label, styles.labelWithIcon)}>
                      Сделка продажи
                      <svg className={styles.labelIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </label>
                    <GroupedSelect
                      data={[]}
                      value={formData.salesDeal}
                      onChange={(value) => setFormData({ ...formData, salesDeal: value })}
                  placeholder="Не выбран"
                  disabled={true}
                  groupBy={false}
                  labelKey="label"
                  valueKey="guid"
                      className="flex-1"
                    />
                  </div>

                  {/* Назначение платежа */}
                  <div className={styles.formRowStart}>
                    <label className={styles.label} style={{ paddingTop: '0.5rem' }}>Назначение платежа</label>
                    <textarea 
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      placeholder="Назначение платежа"
                      rows={3}
                      className={styles.textarea}
                    />
                  </div>
                </>
              )}

              {/* Выплата */}
              {activeTab === 'payment' && (
                <>
                  {/* Дата оплаты */}
                  <div className={styles.formRow}>
                    <label className={styles.label}>Дата оплаты</label>
                    <div className={styles.inputGroup}>
                      <input 
                        type="date" 
                        value={formData.paymentDate}
                        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                        className={styles.input}
                      />
                      <button className={styles.calendarButton}>
                        <svg className={styles.calendarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <label className={styles.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          className={styles.checkbox}
                          checked={formData.confirmPayment}
                          onChange={(e) => setFormData({ ...formData, confirmPayment: e.target.checked })}
                        />
                        <span>Подтвердить оплату</span>
                      </label>
                    </div>
                  </div>

                  {/* Счет и юрлицо */}
                  <div className={styles.formRow}>
                    <label className={styles.label}>Счет и юрлицо</label>
                    <GroupedSelect
                      data={bankAccounts}
                      value={formData.accountAndLegalEntity}
                      onChange={(value) => setFormData({ ...formData, accountAndLegalEntity: value })}
                      placeholder="Выберите счет..."
                      groupBy={true}
                      labelKey="label"
                      valueKey="guid"
                      groupKey="group"
                      loading={loadingBankAccounts}
                      className="flex-1"
                    />
                  </div>

                  {/* Сумма */}
                  <div className={styles.formRow}>
                    <label className={styles.label}>Сумма</label>
                    <div className={styles.inputGroup}>
                      <input 
                        type="number" 
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0"
                        className={styles.input}
                      />
                      <span className={styles.inputText}>{operation.currency || 'RUB (Российский рубль)'}</span>
                    </div>
                  </div>

                  {/* Разбить сумму / Добавить начисление */}
                  <div className={styles.formRow}>
                    <div className={styles.labelSpacer}></div>
                    <div className={styles.buttonGroup}>
                      <button className={styles.button}>Разбить сумму</button>
                      <button className={styles.button}>Добавить начисление</button>
                    </div>
                  </div>

                  {/* Контрагент */}
                  <div className={styles.formRow}>
                    <label className={styles.label}>Контрагент</label>
                    <TreeSelect
                      data={counterAgentsTree}
                      value={formData.counterparty}
                      onChange={(value) => setFormData({ ...formData, counterparty: value })}
                      placeholder="Выберите контрагента..."
                      className="flex-1"
                    />
                  </div>

                  {/* Статья */}
                  <div className={styles.formRow}>
                    <label className={styles.label}>Статья</label>
                    <GroupedSelect
                      data={chartOfAccounts}
                      value={formData.chartOfAccount}
                      onChange={(value) => setFormData({ ...formData, chartOfAccount: value })}
                      placeholder="Выберите статью..."
                      groupBy={true}
                      labelKey="label"
                      valueKey="guid"
                      groupKey="group"
                      loading={loadingChartOfAccounts}
                  className="flex-1"
                />
              </div>

                  {/* Проект */}
                  <div className={styles.formRow}>
                    <label className={styles.label}>Проект</label>
                    <GroupedSelect
                      data={[]}
                      value={formData.project}
                      onChange={(value) => setFormData({ ...formData, project: value })}
                      placeholder="Выберите проект..."
                      groupBy={false}
                      labelKey="label"
                      valueKey="guid"
                  className="flex-1"
                  disabled={true}
                />
              </div>

              {/* Сделка закупки */}
              <div className={styles.formRow}>
                <label className={cn(styles.label, styles.labelWithIcon)}>
                  Сделка закупки
                  <svg className={styles.labelIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </label>
                <GroupedSelect
                  data={[]}
                  value={formData.purchaseDeal}
                  onChange={(value) => setFormData({ ...formData, purchaseDeal: value })}
                  placeholder="Не выбран"
                  disabled={true}
                  groupBy={false}
                  labelKey="label"
                  valueKey="guid"
                  className="flex-1"
                />
              </div>

                  {/* Сделка продажи */}
                  <div className={styles.formRow}>
                    <label className={cn(styles.label, styles.labelWithIcon)}>
                      Сделка продажи
                      <svg className={styles.labelIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </label>
                    <GroupedSelect
                      data={[]}
                      value={formData.salesDeal}
                      onChange={(value) => setFormData({ ...formData, salesDeal: value })}
                      placeholder="Не выбран"
                      disabled={true}
                      groupBy={false}
                      labelKey="label"
                      valueKey="guid"
                      className="flex-1"
                    />
              </div>

              {/* Назначение платежа */}
              <div className={styles.formRowStart}>
                <label className={styles.label} style={{ paddingTop: '0.5rem' }}>Назначение платежа</label>
                <textarea 
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      placeholder="Назначение платежа"
                      rows={3}
                      className={styles.textarea}
                    />
                  </div>
                </>
              )}

              {/* Перемещение */}
              {activeTab === 'transfer' && (
                <>
                  {/* Секция ОТКУДА */}
                  <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                      <div className={styles.sectionLine}></div>
                      <h3 className={styles.sectionTitle}>ОТКУДА</h3>
                      <div className={styles.sectionLine}></div>
                    </div>

                    {/* Дата оплаты */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Дата оплаты</label>
                      <div className={styles.inputGroup}>
                        <input 
                          type="date" 
                          value={formData.fromDate}
                          onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                          className={styles.input}
                        />
                        <button className={styles.calendarButton}>
                          <svg className={styles.calendarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <label className={styles.checkboxLabel}>
                          <input 
                            type="checkbox" 
                            className={styles.checkbox}
                            checked={formData.confirmPayment}
                            onChange={(e) => setFormData({ ...formData, confirmPayment: e.target.checked })}
                          />
                          <span>Подтвердить оплату</span>
                        </label>
                      </div>
                    </div>

                    {/* Счет и юрлицо */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Счет и юрлицо</label>
                      <GroupedSelect
                        data={bankAccounts}
                        value={formData.fromAccount}
                        onChange={(value) => setFormData({ ...formData, fromAccount: value })}
                        placeholder="Выберите счет..."
                        groupBy={true}
                        labelKey="label"
                        valueKey="guid"
                        groupKey="group"
                        loading={loadingBankAccounts}
                        className="flex-1"
                      />
                    </div>

                    {/* Сумма списания */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Сумма списания</label>
                      <div className={styles.inputGroup}>
                        <input 
                          type="number" 
                          value={formData.fromAmount}
                          onChange={(e) => setFormData({ ...formData, fromAmount: e.target.value })}
                          placeholder="0"
                          className={styles.input}
                        />
                        <GroupedSelect
                          data={currencies}
                          value={formData.currenies_id}
                          onChange={(value) => setFormData({ ...formData, currenies_id: value })}
                          placeholder="Выберите валюту..."
                          groupBy={false}
                          labelKey="label"
                          valueKey="guid"
                          loading={loadingCurrencies}
                          className="flex-1"
                          style={{ minWidth: '180px', maxWidth: '250px' }}
                        />
                      </div>
                    </div>

                    {/* Привязать к проекту */}
                    <div className={styles.formRow}>
                      <div className={styles.labelSpacer}></div>
                      <button className={styles.button}>Привязать к проекту</button>
                    </div>

                    {/* Проект */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Проект</label>
                      <GroupedSelect
                        data={[]}
                        value={formData.project}
                        onChange={(value) => setFormData({ ...formData, project: value })}
                        placeholder="Выберите проект..."
                        groupBy={false}
                        labelKey="label"
                        valueKey="guid"
                        className="flex-1"
                        disabled={true}
                      />
                    </div>
                  </div>

                  {/* Секция КУДА */}
                  <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                      <div className={styles.sectionLine}></div>
                      <h3 className={styles.sectionTitle}>КУДА</h3>
                      <div className={styles.sectionLine}></div>
                    </div>

                    {/* Дата */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Дата</label>
                      <div className={styles.inputGroup}>
                        <input 
                          type="date" 
                          value={formData.toDate}
                          onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                          className={styles.input}
                        />
                        <button className={styles.calendarButton}>
                          <svg className={styles.calendarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Счет и юрлицо */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Счет и юрлицо</label>
                      <GroupedSelect
                        data={bankAccounts}
                        value={formData.toAccount}
                        onChange={(value) => setFormData({ ...formData, toAccount: value })}
                        placeholder="Выберите счет..."
                        groupBy={true}
                        labelKey="label"
                        valueKey="guid"
                        groupKey="group"
                        loading={loadingBankAccounts}
                        className="flex-1"
                      />
                    </div>

                    {/* Сумма зачисления */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Сумма зачисления</label>
                      <div className={styles.inputGroup}>
                        <input 
                          type="number" 
                          value={formData.toAmount}
                          onChange={(e) => setFormData({ ...formData, toAmount: e.target.value })}
                          placeholder="0"
                          className={styles.input}
                        />
                        <GroupedSelect
                          data={currencies}
                          value={formData.currenies_id}
                          onChange={(value) => setFormData({ ...formData, currenies_id: value })}
                          placeholder="Выберите валюту..."
                          groupBy={false}
                          labelKey="label"
                          valueKey="guid"
                          loading={loadingCurrencies}
                          className="flex-1"
                          style={{ minWidth: '180px', maxWidth: '250px' }}
                        />
                      </div>
                    </div>

                    {/* Назначение платежа */}
                    <div className={styles.formRowStart}>
                      <label className={styles.label} style={{ paddingTop: '0.5rem' }}>Назначение платежа</label>
                      <textarea 
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        placeholder="Назначение платежа"
                        rows={3}
                        className={styles.textarea}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Начисление */}
              {activeTab === 'accrual' && (
                <>
                  {/* Секция ОТКУДА */}
                  <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                      <div className={styles.sectionLine}></div>
                      <h3 className={styles.sectionTitle}>ОТКУДА</h3>
                      <div className={styles.sectionLine}></div>
                    </div>

                    {/* Дата начисления */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Дата начисления</label>
                      <div className={styles.inputGroup}>
                        <input 
                          type="date" 
                          value={formData.accrualDate}
                          onChange={(e) => setFormData({ ...formData, accrualDate: e.target.value })}
                          className={styles.input}
                        />
                        <button className={styles.calendarButton}>
                          <svg className={styles.calendarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Подтвердить начисление */}
                    <div className={styles.formRow}>
                      <div className={styles.labelSpacer}></div>
                      <label className={styles.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          className={styles.checkbox}
                          checked={formData.confirmAccrual}
                          onChange={(e) => setFormData({ ...formData, confirmAccrual: e.target.checked })}
                        />
                        <span>Подтвердить начисление</span>
                      </label>
                    </div>

                    {/* Юрлицо */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Юрлицо</label>
                      <GroupedSelect
                        data={legalEntities}
                        value={formData.legalEntity}
                        onChange={(value) => setFormData({ ...formData, legalEntity: value })}
                        placeholder="Выберите юрлицо..."
                        groupBy={false}
                        labelKey="label"
                        valueKey="guid"
                        loading={loadingLegalEntities}
                        className="flex-1"
                      />
                    </div>

                    {/* Статья списания */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Статья списания</label>
                      <GroupedSelect
                        data={chartOfAccounts}
                        value={formData.expenseItem}
                        onChange={(value) => setFormData({ ...formData, expenseItem: value })}
                        placeholder="Выберите статью списания..."
                        groupBy={true}
                        labelKey="label"
                        valueKey="guid"
                        groupKey="group"
                        loading={loadingChartOfAccounts}
                        className="flex-1"
                      />
                    </div>

                    {/* Сумма */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Сумма</label>
                      <div className={styles.inputGroup}>
                        <input 
                          type="number" 
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          placeholder="0"
                          className={styles.input}
                        />
                        <GroupedSelect
                          data={currencies}
                          value={formData.currenies_id}
                          onChange={(value) => setFormData({ ...formData, currenies_id: value })}
                          placeholder="Выберите валюту..."
                          groupBy={false}
                          labelKey="label"
                          valueKey="guid"
                          loading={loadingCurrencies}
                          className="flex-1"
                          style={{ minWidth: '180px', maxWidth: '250px' }}
                        />
                      </div>
                    </div>

                    {/* Учитывать в ОПиУ кассовым методом */}
                    <div className={styles.formRow}>
                      <div className={styles.labelSpacer}></div>
                      <label className={styles.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          className={styles.checkbox}
                          checked={formData.cashMethod}
                          onChange={(e) => setFormData({ ...formData, cashMethod: e.target.checked })}
                        />
                        <span>Учитывать в ОПиУ кассовым методом</span>
                      </label>
                    </div>
                  </div>

                  {/* Секция КУДА */}
                  <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                      <div className={styles.sectionLine}></div>
                      <h3 className={styles.sectionTitle}>КУДА</h3>
                      <div className={styles.sectionLine}></div>
                    </div>

                    {/* Статья зачисления */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Статья зачисления</label>
                      <GroupedSelect
                        data={chartOfAccounts}
                        value={formData.creditItem}
                        onChange={(value) => setFormData({ ...formData, creditItem: value })}
                        placeholder="Выберите статью зачисления..."
                        groupBy={true}
                        labelKey="label"
                        valueKey="guid"
                        groupKey="group"
                        loading={loadingChartOfAccounts}
                        className="flex-1"
                      />
                    </div>

                    {/* Контрагент */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Контрагент</label>
                      <TreeSelect
                        data={counterAgentsTree}
                        value={formData.counterparty}
                        onChange={(value) => setFormData({ ...formData, counterparty: value })}
                        placeholder="Не выбран"
                        className="flex-1"
                      />
                    </div>

                    {/* Проект */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Проект</label>
                      <GroupedSelect
                        data={[]}
                        value={formData.project}
                        onChange={(value) => setFormData({ ...formData, project: value })}
                        placeholder="Не выбран"
                        groupBy={false}
                        labelKey="label"
                        valueKey="guid"
                        className="flex-1"
                        disabled={true}
                      />
                    </div>

                    {/* Сделка продажи */}
                    <div className={styles.formRow}>
                      <label className={cn(styles.label, styles.labelWithIcon)}>
                        Сделка продажи
                        <svg className={styles.labelIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </label>
                      <GroupedSelect
                        data={[]}
                        value={formData.salesDeal}
                        onChange={(value) => setFormData({ ...formData, salesDeal: value })}
                        placeholder="Не выбран"
                        disabled={true}
                        groupBy={false}
                        labelKey="label"
                        valueKey="guid"
                        className="flex-1"
                      />
                    </div>

                    {/* Назначение */}
                    <div className={styles.formRowStart}>
                      <label className={styles.label} style={{ paddingTop: '0.5rem' }}>Назначение</label>
                      <textarea 
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Назначение платежа"
                  rows={3}
                  className={styles.textarea}
                />
              </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button 
              className={styles.saveButton}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Создание...' : isNew ? 'Создать' : 'Сохранить'}
            </button>
            <button className={styles.cancelButton} onClick={onClose}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
