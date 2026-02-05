"use client"

import { useState, useEffect, useMemo } from 'react'
import { cn } from '@/app/lib/utils'
import { dashboardAPI } from '@/lib/api/dashboard'
import { useQueryClient } from '@tanstack/react-query'
import { useChartOfAccountsV2 } from '@/hooks/useDashboard'
import { TreeSelect } from '@/components/common/TreeSelect/TreeSelect'
import styles from './CreateChartOfAccountsModal.module.scss'

export default function CreateChartOfAccountsModal({ isOpen, onClose, initialTab = 'income' }) {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [formData, setFormData] = useState({
    nazvanie: '',
    chart_of_accounts_id_2: '',
    komentariy: '',
    tip_operatsii: []
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Get all chart of accounts for parent selection
  const { data: allAccountsData } = useChartOfAccountsV2({ data: {} })
  const allAccounts = allAccountsData?.data?.data?.response || []

  // Map tab keys to API tip values
  const tabToTipMap = {
    'income': 'Доходы',
    'expense': 'Расходы',
    'assets': 'Актив',
    'liabilities': 'Обязательства',
    'capital': 'Капитал'
  }

  const tabs = [
    { key: 'income', label: 'Доходы' },
    { key: 'expense', label: 'Расходы' },
    { key: 'assets', label: 'Активы' },
    { key: 'liabilities', label: 'Обязательства' },
    { key: 'capital', label: 'Капитал' }
  ]

  // Build tree structure for TreeSelect - filter by active tab
  // For 'income' and 'expense' tabs: allow selecting 1st generation (root items)
  // For other tabs: only allow selecting 2nd generation and below
  const treeData = useMemo(() => {
    const currentTip = tabToTipMap[activeTab]
    if (!currentTip || allAccounts.length === 0) return []

    // Check if this is income or expense tab (allow root selection)
    const allowRootSelection = activeTab === 'income' || activeTab === 'expense'

    // Filter accounts by current tab tip
    const filteredAccounts = allAccounts.filter(item => {
      if (!item.tip || !Array.isArray(item.tip)) return false
      return item.tip.includes(currentTip)
    })

    if (filteredAccounts.length === 0) return []

    // Create a map of all filtered items by guid for quick lookup
    const itemsMap = new Map()
    filteredAccounts.forEach(item => {
      itemsMap.set(item.guid, item)
    })

    // Build child items map: parentGuid -> [children]
    const childItemsMap = new Map()
    const allChildGuids = new Set()

    filteredAccounts.forEach(item => {
      if (item.chart_of_accounts_id_2) {
        const parentGuid = item.chart_of_accounts_id_2
        if (itemsMap.has(parentGuid)) {
          if (!childItemsMap.has(parentGuid)) {
            childItemsMap.set(parentGuid, [])
          }
          childItemsMap.get(parentGuid).push(item)
          allChildGuids.add(item.guid)
        }
      }
    })

    // Find root items (1st generation)
    const rootItems = []
    filteredAccounts.forEach(item => {
      if (allChildGuids.has(item.guid)) {
        return
      }

      if (!item.chart_of_accounts_id_2) {
        rootItems.push(item)
      } else {
        const parentGuid = item.chart_of_accounts_id_2
        const parentInFiltered = itemsMap.has(parentGuid)
        
        if (!parentInFiltered) {
          rootItems.push(item)
        }
      }
    })

    // Build tree structure
    // For income/expense: 1st generation (level 0) is selectable
    // For others: only 2nd generation (level 1) and below are selectable
    const buildTree = (item, level = 0) => {
      const children = childItemsMap.get(item.guid) || []
      const treeNode = {
        value: item.guid,
        title: item.nazvanie,
        selectable: allowRootSelection ? true : level >= 1, // Income/expense: all levels selectable, others: only level 1+
        children: children.length > 0 ? children.map(child => buildTree(child, level + 1)) : undefined
      }
      
      return treeNode
    }

    const result = rootItems.map(item => buildTree(item, 0))
    
    console.log('TreeSelect data for tab', activeTab, ':', {
      allowRootSelection,
      filteredCount: filteredAccounts.length,
      rootItemsCount: rootItems.length,
      treeStructure: JSON.stringify(result, null, 2)
    })
    
    return result
  }, [allAccounts, activeTab])

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false)
      setIsVisible(true)
      setFormData({
        nazvanie: '',
        chart_of_accounts_id_2: '',
        komentariy: '',
        tip_operatsii: []
      })
      setErrors({})
      setActiveTab(initialTab)
    }
  }, [isOpen, initialTab])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 250)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nazvanie.trim()) {
      newErrors.nazvanie = 'Укажите название статьи'
    }
    
    // For income and expense, parent is optional (can create root items)
    // For other tabs, parent is required
    if (activeTab !== 'income' && activeTab !== 'expense' && !formData.chart_of_accounts_id_2) {
      newErrors.chart_of_accounts_id_2 = 'Выберите родительскую статью (2-е поколение или ниже)'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const submitData = {
        nazvanie: formData.nazvanie.trim(),
        tip: [tabToTipMap[activeTab]],
        ...(formData.chart_of_accounts_id_2 && { chart_of_accounts_id_2: formData.chart_of_accounts_id_2 }),
        ...(formData.komentariy && { komentariy: formData.komentariy }),
        ...(formData.tip_operatsii && formData.tip_operatsii.length > 0 && { tip_operatsii: formData.tip_operatsii }),
        attributes: {}
      }

      await dashboardAPI.createChartOfAccounts(submitData)
      
      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['chartOfAccountsV2'] })
      
      handleClose()
    } catch (error) {
      console.error('Error creating chart of accounts:', error)
      setErrors({ submit: error.message || 'Не удалось создать учетную статью' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen && !isVisible) return null

  return (
    <>
      <div 
        className={cn(styles.overlay, isClosing ? styles.closing : styles.opening)}
        onClick={handleClose}
      />

      <div 
        className={cn(styles.modal, isClosing ? styles.closing : styles.opening)}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Создание учетной статьи</h2>
          <button onClick={handleClose} className={styles.closeButton}>
            <svg className={styles.closeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {/* Tabs */}
          <div className={styles.tabsContainer}>
            {tabs.map((tab, index) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  styles.tab,
                  index === 0 && styles.first,
                  index === tabs.length - 1 && styles.last,
                  index > 0 && styles.notFirst,
                  activeTab === tab.key ? styles.active : styles.inactive
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form */}
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
                  placeholder="Укажите название статьи"
                  className={cn(styles.input, errors.nazvanie && styles.inputError)}
                />
                {errors.nazvanie && (
                  <div className={styles.errorMessage}>{errors.nazvanie}</div>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.label}>Относится к</label>
              <div className={styles.inputContainer}>
                <TreeSelect
                  data={treeData}
                  value={formData.chart_of_accounts_id_2}
                  onChange={(value) => setFormData({ ...formData, chart_of_accounts_id_2: value || '' })}
                  placeholder="Выберите родительскую статью"
                  allowRoot={activeTab === 'income' || activeTab === 'expense'}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.label}>Комментарий</label>
              <div className={styles.inputContainer}>
                <textarea
                  value={formData.komentariy}
                  onChange={(e) => setFormData({ ...formData, komentariy: e.target.value })}
                  placeholder="Пояснение к статье"
                  className={styles.textarea}
                  rows={4}
                />
              </div>
            </div>

            {errors.submit && (
              <div className={styles.errorMessage}>{errors.submit}</div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerRight}>
            <button 
              onClick={handleClose} 
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Отменить
            </button>
            <button 
              onClick={handleSubmit} 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
