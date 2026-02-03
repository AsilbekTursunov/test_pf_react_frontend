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

  // Build tree structure for TreeSelect - filter by active tab and show only items from that category
  // Returns empty array if no items found (allows creating root items)
  const treeData = useMemo(() => {
    const currentTip = tabToTipMap[activeTab]
    if (!currentTip || allAccounts.length === 0) return [] // Empty array allows creating root items

    // Filter accounts by current tab tip
    const filteredAccounts = allAccounts.filter(item => {
      if (!item.tip || !Array.isArray(item.tip)) return false
      return item.tip.includes(currentTip)
    })

    if (filteredAccounts.length === 0) return []

    // Create a map of all filtered items by guid for quick lookup
    // Use the last occurrence if there are duplicates (shouldn't happen, but just in case)
    const itemsMap = new Map()
    filteredAccounts.forEach(item => {
      itemsMap.set(item.guid, item)
    })

    // Build child items map: parentGuid -> [children]
    // Include ALL children that have a parent in filtered accounts
    const childItemsMap = new Map()
    const allChildGuids = new Set()

    // First pass: build child-parent relationships
    filteredAccounts.forEach(item => {
      if (item.chart_of_accounts_id_2) {
        const parentGuid = item.chart_of_accounts_id_2
        // Check if parent exists in filtered accounts
        if (itemsMap.has(parentGuid)) {
          if (!childItemsMap.has(parentGuid)) {
            childItemsMap.set(parentGuid, [])
          }
          childItemsMap.get(parentGuid).push(item)
          allChildGuids.add(item.guid)
        }
      }
    })

    // Find root items: items that are in filtered accounts AND either:
    // 1. Have no parent (chart_of_accounts_id_2 is null)
    // 2. Have a parent that is NOT in filtered accounts
    // 3. Are not already added as children
    const rootItems = []
    filteredAccounts.forEach(item => {
      // Skip if this item is already a child
      if (allChildGuids.has(item.guid)) {
        return
      }

      if (!item.chart_of_accounts_id_2) {
        // No parent - definitely a root item
        rootItems.push(item)
      } else {
        const parentGuid = item.chart_of_accounts_id_2
        const parentInFiltered = itemsMap.has(parentGuid)
        
        if (!parentInFiltered) {
          // Parent is not in filtered accounts, so this item is a root item
          rootItems.push(item)
        }
        // If parent is in filtered accounts, this item should have been added as child above
        // If it wasn't, it means there's a data inconsistency, but we'll treat it as root
      }
    })

    // Build tree structure for TreeSelect recursively
    const buildTree = (item) => {
      const children = childItemsMap.get(item.guid) || []
      const treeNode = {
        value: item.guid,
        title: item.nazvanie,
        selectable: true,
        children: children.length > 0 ? children.map(buildTree) : undefined
      }
      
      // Debug: log each node being built
      if (children.length > 0) {
        console.log(`Building tree for ${item.nazvanie} (${item.guid}):`, {
          childrenCount: children.length,
          children: children.map(c => ({ guid: c.guid, name: c.nazvanie }))
        })
      }
      
      return treeNode
    }

    const result = rootItems.map(buildTree)
    
    // Debug logging
    console.log('TreeSelect data for tab', activeTab, ':', {
      filteredCount: filteredAccounts.length,
      rootItemsCount: rootItems.length,
      childItemsMapSize: childItemsMap.size,
      allGuids: filteredAccounts.map(i => ({ guid: i.guid, name: i.nazvanie, parent: i.chart_of_accounts_id_2 })),
      childItemsMapEntries: Array.from(childItemsMap.entries()).map(([guid, children]) => ({
        parent: itemsMap.get(guid)?.nazvanie || guid,
        children: children.map(c => ({ guid: c.guid, name: c.nazvanie }))
      })),
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
                {treeData.length > 0 ? (
                  <TreeSelect
                    data={treeData}
                    value={formData.chart_of_accounts_id_2}
                    onChange={(value) => setFormData({ ...formData, chart_of_accounts_id_2: value || '' })}
                    placeholder="Выберите родительскую статью"
                    allowRoot={true}
                  />
                ) : (
                  <div className={styles.emptyState}>
                    <p className={styles.emptyStateText}>
                      В этом разделе пока нет элементов. Создаваемая статья будет корневой.
                    </p>
                  </div>
                )}
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
