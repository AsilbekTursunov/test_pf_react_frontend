"use client"

import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/app/lib/utils'
import { useChartOfAccountsV2, useUpdateCounterparty, useCounterpartiesGroupsV2 } from '@/hooks/useDashboard'
import { GroupedSelect } from '@/components/common/GroupedSelect/GroupedSelect'
import { TreeSelect } from '@/components/common/TreeSelect/TreeSelect'
import styles from '../CreateCounterpartyModal/CreateCounterpartyModal.module.scss'

export default function EditCounterpartyModal({ isOpen, onClose, counterparty }) {
  const queryClient = useQueryClient()
  const updateMutation = useUpdateCounterparty()
  
  const [formData, setFormData] = useState({
    nazvanie: '',
    polnoe_imya: '',
    counterparties_group_id: '',
    gruppa: [],
    inn: '',
    kpp: '',
    nomer_scheta: '',
    primenyat_stat_i_po_umolchaniyu: false,
    chart_of_accounts_id: '',
    chart_of_accounts_id_2: '',
    komentariy: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Get chart of accounts for articles dropdowns
  const { data: chartOfAccountsData } = useChartOfAccountsV2({ data: {} })
  const chartOfAccounts = chartOfAccountsData?.data?.data?.response || []

  // Get counterparties groups for dropdown
  const { data: counterpartiesGroupsData } = useCounterpartiesGroupsV2({ data: {} })
  const counterpartiesGroups = counterpartiesGroupsData?.data?.data?.response || []

  // Transform chart of accounts for GroupedSelect
  const chartOfAccountsOptions = useMemo(() => {
    return chartOfAccounts.map(item => ({
      guid: item.guid,
      label: item.nazvanie || '',
      group: (Array.isArray(item.tip) && item.tip.length > 0) ? item.tip[0] : 'Без группы'
    }))
  }, [chartOfAccounts])

  // Build tree for chart of accounts - separate trees for income and expenses
  const chartOfAccountsTreeIncome = useMemo(() => {
    if (chartOfAccounts.length === 0) return []
    
    // Build a map for quick lookup
    const itemsMap = new Map()
    chartOfAccounts.forEach(item => {
      itemsMap.set(item.guid, item)
    })
    
    // Build child items map: parentGuid -> [children]
    const childItemsMap = new Map()
    chartOfAccounts.forEach(item => {
      if (item.chart_of_accounts_id_2) {
        const parentGuid = item.chart_of_accounts_id_2
        if (!childItemsMap.has(parentGuid)) {
          childItemsMap.set(parentGuid, [])
        }
        childItemsMap.get(parentGuid).push(item)
      }
    })
    
    // Helper to check if item or any of its descendants match the filter (Доходы)
    const hasMatchingDescendants = (item) => {
      const children = childItemsMap.get(item.guid) || []
      
      // Check if item itself matches the filter
      const itemMatches = item.tip && Array.isArray(item.tip) && item.tip.length > 0 && 
        item.tip.some(t => t && t.includes('Доход'))
      
      // If item has children, check if any child matches
      if (children.length > 0) {
        const hasMatchingChild = children.some(child => hasMatchingDescendants(child))
        return itemMatches || hasMatchingChild
      }
      
      return itemMatches
    }
    
    // Build tree structure recursively
    const buildTree = (item, level = 0) => {
      const children = childItemsMap.get(item.guid) || []
      
      // Filter children - only include those that match or have matching descendants
      const filteredChildren = children.filter(child => hasMatchingDescendants(child))
      
      const hasChildren = filteredChildren.length > 0
      
      const treeNode = {
        value: item.guid,
        title: item.nazvanie || 'Без названия',
        selectable: true, // Allow selecting any node
        expanded: false, // Collapsed by default
        tip: item.tip,
        level: level,
        children: hasChildren 
          ? filteredChildren.map(child => buildTree(child, level + 1))
          : undefined
      }
      return treeNode
    }
    
    // Find root items
    const rootItems = chartOfAccounts.filter(item => !item.chart_of_accounts_id_2)
    
    // Filter root items - only include those that have matching descendants
    const filteredRootItems = rootItems.filter(root => hasMatchingDescendants(root))
    
    return filteredRootItems.map(item => buildTree(item, 0))
  }, [chartOfAccounts])

  const chartOfAccountsTreeExpense = useMemo(() => {
    if (chartOfAccounts.length === 0) return []
    
    // Build a map for quick lookup
    const itemsMap = new Map()
    chartOfAccounts.forEach(item => {
      itemsMap.set(item.guid, item)
    })
    
    // Build child items map: parentGuid -> [children]
    const childItemsMap = new Map()
    chartOfAccounts.forEach(item => {
      if (item.chart_of_accounts_id_2) {
        const parentGuid = item.chart_of_accounts_id_2
        if (!childItemsMap.has(parentGuid)) {
          childItemsMap.set(parentGuid, [])
        }
        childItemsMap.get(parentGuid).push(item)
      }
    })
    
    // Helper to check if item or any of its descendants match the filter (Расходы)
    const hasMatchingDescendants = (item) => {
      const children = childItemsMap.get(item.guid) || []
      
      // Check if item itself matches the filter
      const itemMatches = item.tip && Array.isArray(item.tip) && item.tip.length > 0 && 
        item.tip.some(t => t && t.includes('Расход'))
      
      // If item has children, check if any child matches
      if (children.length > 0) {
        const hasMatchingChild = children.some(child => hasMatchingDescendants(child))
        return itemMatches || hasMatchingChild
      }
      
      return itemMatches
    }
    
    // Build tree structure recursively
    const buildTree = (item, level = 0) => {
      const children = childItemsMap.get(item.guid) || []
      
      // Filter children - only include those that match or have matching descendants
      const filteredChildren = children.filter(child => hasMatchingDescendants(child))
      
      const hasChildren = filteredChildren.length > 0
      
      const treeNode = {
        value: item.guid,
        title: item.nazvanie || 'Без названия',
        selectable: true, // Allow selecting any node
        expanded: false, // Collapsed by default
        tip: item.tip,
        level: level,
        children: hasChildren 
          ? filteredChildren.map(child => buildTree(child, level + 1))
          : undefined
      }
      return treeNode
    }
    
    // Find root items
    const rootItems = chartOfAccounts.filter(item => !item.chart_of_accounts_id_2)
    
    // Filter root items - only include those that have matching descendants
    const filteredRootItems = rootItems.filter(root => hasMatchingDescendants(root))
    
    return filteredRootItems.map(item => buildTree(item, 0))
  }, [chartOfAccounts])

  // Transform counterparties groups for GroupedSelect
  const counterpartiesGroupsOptions = useMemo(() => {
    return counterpartiesGroups.map(item => ({
      guid: item.guid,
      label: item.nazvanie_gruppy || '',
    }))
  }, [counterpartiesGroups])

  // Group options for counterparties groups
  const groupOptions = [
    { guid: 'client', label: 'Клиент' },
    { guid: 'supplier', label: 'Поставщик' },
    { guid: 'employee', label: 'Сотрудник' }
  ]

  useEffect(() => {
    if (isOpen && counterparty) {
      setIsClosing(false)
      setIsVisible(true)
      
      // Map gruppa array to group guid
      const gruppaValue = counterparty.gruppa && Array.isArray(counterparty.gruppa) && counterparty.gruppa.length > 0
        ? groupOptions.find(g => counterparty.gruppa.includes(g.label))?.guid || ''
        : ''
      
      // Get rawData once for all functions
      const rawData = counterparty.rawData || counterparty
      
      // Extract UUID from _data fields if they exist, otherwise use direct field
      const getChartOfAccountsId = (field) => {
        // First check rawData
        if (rawData[field]) {
          // If it's already a UUID string, use it
          if (typeof rawData[field] === 'string') {
            // Check if it looks like a UUID (36 chars with dashes)
            if (rawData[field].length === 36 && rawData[field].match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
              return rawData[field]
            }
          }
          // If it's an object with guid, extract it
          if (rawData[field]?.guid) {
            return rawData[field].guid
          }
        }
        // Try _data field in rawData
        const dataField = `${field}_data`
        if (rawData[dataField]?.guid) {
          return rawData[dataField].guid
        }
        // Check direct counterparty object
        if (counterparty[field]) {
          if (typeof counterparty[field] === 'string' && counterparty[field].length === 36) {
            return counterparty[field]
          }
        }
        return ''
      }

      // Get counterparties_group_id - check rawData first, then direct field, then _data
      const getCounterpartiesGroupId = () => {
        // Check rawData first
        if (rawData.counterparties_group_id) {
          if (typeof rawData.counterparties_group_id === 'string') {
            // Check if it looks like a UUID (36 chars with dashes)
            if (rawData.counterparties_group_id.length === 36 && rawData.counterparties_group_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
              return rawData.counterparties_group_id
            }
          }
        }
        if (rawData.counterparties_group_id_data?.guid) {
          return rawData.counterparties_group_id_data.guid
        }
        // Check direct counterparty object
        if (counterparty.counterparties_group_id) {
          if (typeof counterparty.counterparties_group_id === 'string' && counterparty.counterparties_group_id.length === 36) {
            return counterparty.counterparties_group_id
          }
        }
        return ''
      }

      setFormData({
        nazvanie: counterparty.nazvanie || '',
        polnoe_imya: counterparty.polnoe_imya || '',
        counterparties_group_id: getCounterpartiesGroupId(),
        gruppa: counterparty.gruppa || [],
        inn: counterparty.inn ? String(counterparty.inn) : '',
        kpp: counterparty.kpp ? String(counterparty.kpp) : '',
        nomer_scheta: counterparty.nomer_scheta ? String(counterparty.nomer_scheta) : '',
        primenyat_stat_i_po_umolchaniyu: counterparty.primenyat_stat_i_po_umolchaniyu || false,
        chart_of_accounts_id: getChartOfAccountsId('chart_of_accounts_id'),
        chart_of_accounts_id_2: getChartOfAccountsId('chart_of_accounts_id_2'),
        komentariy: counterparty.komentariy || ''
      })
      setErrors({})
    } else {
      setIsClosing(true)
      setTimeout(() => {
        setIsVisible(false)
      }, 300)
    }
  }, [isOpen, counterparty])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 300)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nazvanie.trim()) {
      newErrors.nazvanie = 'Укажите название'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Определяем тип на основе выбранных статей
      let tip = []
      if (formData.chart_of_accounts_id && !formData.chart_of_accounts_id_2) {
        tip = ['Плательщик']
      } else if (!formData.chart_of_accounts_id && formData.chart_of_accounts_id_2) {
        tip = ['Получатель']
      } else if (formData.chart_of_accounts_id && formData.chart_of_accounts_id_2) {
        tip = ['Смешанный']
      }

      const rawData = counterparty.rawData || counterparty
      const now = new Date()
      
      // Parse data_sozdaniya from rawData - it might be in different formats
      let dataSozdaniya = null
      if (rawData.data_sozdaniya) {
        if (typeof rawData.data_sozdaniya === 'string') {
          // Try to parse different date formats
          const parsed = new Date(rawData.data_sozdaniya)
          if (!isNaN(parsed.getTime())) {
            dataSozdaniya = parsed.toISOString()
          }
        }
      }
      
      const submitData = {
        guid: rawData.guid || counterparty.guid,
        nazvanie: formData.nazvanie.trim(),
        ...(formData.polnoe_imya && { polnoe_imya: formData.polnoe_imya }),
        ...(formData.gruppa && formData.gruppa.length > 0 && { gruppa: formData.gruppa }),
        ...(tip.length > 0 && { tip }),
        ...(formData.inn && { inn: Number(formData.inn) }),
        ...(formData.kpp && { kpp: Number(formData.kpp) }),
        ...(formData.nomer_scheta && { nomer_scheta: Number(formData.nomer_scheta) }),
        ...(formData.counterparties_group_id && { counterparties_group_id: formData.counterparties_group_id }),
        primenyat_stat_i_po_umolchaniyu: formData.primenyat_stat_i_po_umolchaniyu,
        ...(formData.chart_of_accounts_id && { chart_of_accounts_id: formData.chart_of_accounts_id }),
        ...(formData.chart_of_accounts_id_2 && { chart_of_accounts_id_2: formData.chart_of_accounts_id_2 }),
        ...(formData.komentariy && { komentariy: formData.komentariy }),
        ...(dataSozdaniya && { data_sozdaniya: dataSozdaniya }),
        data_obnovleniya: now.toISOString(),
        attributes: {}
      }

      await updateMutation.mutateAsync(submitData)
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['counterpartiesV2'] })
      
      handleClose()
    } catch (error) {
      console.error('Error updating counterparty:', error)
      setErrors({ submit: error.message || 'Не удалось обновить контрагента' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGroupChange = (value) => {
    const groupMap = {
      'client': 'Клиент',
      'supplier': 'Поставщик',
      'employee': 'Сотрудник'
    }
    setFormData({ ...formData, gruppa: value ? [groupMap[value]] : [] })
  }

  if (!isOpen && !isVisible) return null

  const modalContent = (
    <>
      <div 
        className={cn(styles.overlay, isClosing ? styles.closing : styles.opening)}
        onClick={handleClose}
      />

      <div 
        className={cn(styles.modal, isClosing ? styles.closing : styles.opening)}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Редактировать контрагента</h2>
          <button onClick={handleClose} className={styles.closeButton}>
            <svg className={styles.closeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.content}>
          <div className={styles.form}>
            <div className={styles.formRow}>
              <label className={styles.label}>
                Название <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={formData.nazvanie}
                  onChange={(e) => setFormData({ ...formData, nazvanie: e.target.value })}
                  placeholder="Например, Васильев"
                  className={cn(styles.input, errors.nazvanie && styles.inputError)}
                />
                {errors.nazvanie && (
                  <div className={styles.errorMessage}>{errors.nazvanie}</div>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.label}>Полное название</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={formData.polnoe_imya}
                  onChange={(e) => setFormData({ ...formData, polnoe_imya: e.target.value })}
                  placeholder="Например, ООО «Васильев и партнеры»"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.label}>Группа</label>
              <div className={styles.inputContainer}>
                <GroupedSelect
                  data={groupOptions}
                  value={formData.gruppa.length > 0 ? groupOptions.find(g => formData.gruppa.includes(g.label))?.guid : ''}
                  onChange={handleGroupChange}
                  placeholder="Выберите группу контрагентов"
                  groupBy={false}
                  labelKey="label"
                  valueKey="guid"
                  className="flex-1"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.label}>Группа контрагентов</label>
              <div className={styles.inputContainer}>
                <GroupedSelect
                  data={counterpartiesGroupsOptions}
                  value={formData.counterparties_group_id}
                  onChange={(value) => setFormData({ ...formData, counterparties_group_id: value })}
                  placeholder="Выберите группу контрагентов"
                  groupBy={false}
                  labelKey="label"
                  valueKey="guid"
                  className="flex-1"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.label}>
                ИНН
                <span className={styles.infoIcon}>?</span>
              </label>
              <div className={styles.inputContainer}>
                <input
                  type="number"
                  value={formData.inn}
                  onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
                  placeholder="Укажите ИНН"
                  className={styles.input}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.label}>КПП</label>
              <div className={styles.inputContainer}>
                <input
                  type="number"
                  value={formData.kpp}
                  onChange={(e) => setFormData({ ...formData, kpp: e.target.value })}
                  placeholder="Укажите КПП"
                  className={styles.input}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.label}>Номер счета</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={formData.nomer_scheta}
                  onChange={(e) => setFormData({ ...formData, nomer_scheta: e.target.value })}
                  placeholder="Укажите номер счета"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.primenyat_stat_i_po_umolchaniyu}
                  onChange={(e) => setFormData({ ...formData, primenyat_stat_i_po_umolchaniyu: e.target.checked })}
                  className={styles.checkbox}
                />
                Применять статьи по умолчанию ?
                <span className={styles.infoIcon}>?</span>
              </label>
            </div>

            {formData.primenyat_stat_i_po_umolchaniyu && (
              <>
                <div className={styles.formRow}>
                  <label className={styles.label}>Статья для поступлений</label>
                  <div className={styles.inputContainer}>
                    <TreeSelect
                      data={chartOfAccountsTreeIncome}
                      value={formData.chart_of_accounts_id}
                      onChange={(value) => setFormData({ ...formData, chart_of_accounts_id: value })}
                      placeholder="Выберите статью"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <label className={styles.label}>Статья для выплат</label>
                  <div className={styles.inputContainer}>
                    <TreeSelect
                      data={chartOfAccountsTreeExpense}
                      value={formData.chart_of_accounts_id_2}
                      onChange={(value) => setFormData({ ...formData, chart_of_accounts_id_2: value })}
                      placeholder="Выберите статью"
                    />
                  </div>
                </div>
              </>
            )}

            <div className={styles.formRow}>
              <label className={styles.label}>Комментарий</label>
              <div className={styles.inputContainer}>
                <textarea
                  value={formData.komentariy}
                  onChange={(e) => setFormData({ ...formData, komentariy: e.target.value })}
                  placeholder="Пояснение к контрагенту"
                  className={styles.textarea}
                  rows={4}
                />
              </div>
            </div>

            {errors.submit && (
              <div className={styles.errorMessage}>{errors.submit}</div>
            )}
          </div>

          <div className={styles.footer}>
            <div className={styles.footerRight}>
              <button 
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button 
                type="button"
                onClick={handleClose} 
                className={styles.cancelButton}
                disabled={isSubmitting}
              >
                Отменить
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null
}
