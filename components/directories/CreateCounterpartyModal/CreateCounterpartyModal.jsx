"use client"

import { useState, useEffect, useMemo } from 'react'
import { cn } from '@/app/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { useChartOfAccountsV2, useCreateCounterparty, useCreateCounterpartiesGroup, useCounterpartiesGroupsV2 } from '@/hooks/useDashboard'
import { GroupedSelect } from '@/components/common/GroupedSelect/GroupedSelect'
import styles from './CreateCounterpartyModal.module.scss'

export default function CreateCounterpartyModal({ isOpen, onClose, preselectedGroupId = null }) {
  const queryClient = useQueryClient()
  const createMutation = useCreateCounterparty()
  const createGroupMutation = useCreateCounterpartiesGroup()
  
  const [activeTab, setActiveTab] = useState('counterparty') // 'counterparty' or 'group'
  
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
  
  const [groupFormData, setGroupFormData] = useState({
    nazvanie_gruppy: '',
    opisanie_gruppy: ''
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
    if (isOpen) {
      setIsClosing(false)
      setIsVisible(true)
      setActiveTab('counterparty')
      setFormData({
        nazvanie: '',
        polnoe_imya: '',
        counterparties_group_id: preselectedGroupId || '',
        gruppa: [],
        inn: '',
        kpp: '',
        nomer_scheta: '',
        primenyat_stat_i_po_umolchaniyu: false,
        chart_of_accounts_id: '',
        chart_of_accounts_id_2: '',
        komentariy: ''
      })
      setGroupFormData({
        nazvanie_gruppy: '',
        opisanie_gruppy: ''
      })
      setErrors({})
    }
  }, [isOpen, preselectedGroupId])

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
      newErrors.nazvanie = 'Укажите название'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateGroupForm = () => {
    const newErrors = {}
    
    if (!groupFormData.nazvanie_gruppy.trim()) {
      newErrors.nazvanie_gruppy = 'Укажите название группы'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (activeTab === 'group') {
      if (!validateGroupForm()) return

      setIsSubmitting(true)
      try {
        const submitData = {
          nazvanie_gruppy: groupFormData.nazvanie_gruppy.trim(),
          ...(groupFormData.opisanie_gruppy && { opisanie_gruppy: groupFormData.opisanie_gruppy }),
          data_sozdaniya: new Date().toISOString(),
          attributes: {}
        }

        await createGroupMutation.mutateAsync(submitData)
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['counterpartiesGroupsV2'] })
        queryClient.invalidateQueries({ queryKey: ['counterpartiesV2'] })
        
        handleClose()
      } catch (error) {
        console.error('Error creating counterparties group:', error)
        setErrors({ submit: error.message || 'Не удалось создать группу контрагентов' })
      } finally {
        setIsSubmitting(false)
      }
    } else {
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

        const now = new Date()
        const submitData = {
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
          data_sozdaniya: now.toISOString(),
          attributes: {}
        }

        await createMutation.mutateAsync(submitData)
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['counterpartiesV2'] })
        queryClient.invalidateQueries({ queryKey: ['counterpartiesGroupsV2'] })
        
        handleClose()
      } catch (error) {
        console.error('Error creating counterparty:', error)
        setErrors({ submit: error.message || 'Не удалось создать контрагента' })
      } finally {
        setIsSubmitting(false)
      }
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
          <h2 className={styles.title}>
            {activeTab === 'counterparty' ? 'Создать контрагента' : 'Создать группу контрагентов'}
          </h2>
          <button onClick={handleClose} className={styles.closeButton}>
            <svg className={styles.closeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {/* Tabs */}
          <div className={styles.tabsContainer}>
            <button
              onClick={() => setActiveTab('counterparty')}
              className={cn(
                styles.tab,
                styles.first,
                activeTab === 'counterparty' ? styles.active : styles.inactive
              )}
            >
              Создать контрагента
            </button>
            <button
              onClick={() => setActiveTab('group')}
              className={cn(
                styles.tab,
                styles.last,
                styles.notFirst,
                activeTab === 'group' ? styles.active : styles.inactive
              )}
            >
              Создать группу
            </button>
          </div>

          {/* Form */}
          <div className={styles.form}>
            {activeTab === 'counterparty' ? (
              <>
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
                  type="text"
                  value={formData.inn}
                  onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
                  placeholder="Укажите ИНН"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.label}>КПП</label>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={formData.kpp}
                  onChange={(e) => setFormData({ ...formData, kpp: e.target.value })}
                  placeholder="Укажите КПП"
                  className={styles.input}
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
                    <GroupedSelect
                      data={chartOfAccountsOptions}
                      value={formData.chart_of_accounts_id}
                      onChange={(value) => setFormData({ ...formData, chart_of_accounts_id: value })}
                      placeholder="Выберите статью"
                      groupBy={true}
                      labelKey="label"
                      valueKey="guid"
                      groupKey="group"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <label className={styles.label}>Статья для выплат</label>
                  <div className={styles.inputContainer}>
                    <GroupedSelect
                      data={chartOfAccountsOptions}
                      value={formData.chart_of_accounts_id_2}
                      onChange={(value) => setFormData({ ...formData, chart_of_accounts_id_2: value })}
                      placeholder="Выберите статью"
                      groupBy={true}
                      labelKey="label"
                      valueKey="guid"
                      groupKey="group"
                      className="flex-1"
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
              </>
            ) : (
              <>
                <div className={styles.formRow}>
                  <label className={styles.label}>
                    Название <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputContainer}>
                    <input
                      type="text"
                      value={groupFormData.nazvanie_gruppy}
                      onChange={(e) => setGroupFormData({ ...groupFormData, nazvanie_gruppy: e.target.value })}
                      placeholder="Например, мои поставщики"
                      className={cn(styles.input, errors.nazvanie_gruppy && styles.inputError)}
                    />
                    {errors.nazvanie_gruppy && (
                      <div className={styles.errorMessage}>{errors.nazvanie_gruppy}</div>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <label className={styles.label}>Комментарий</label>
                  <div className={styles.inputContainer}>
                    <textarea
                      value={groupFormData.opisanie_gruppy}
                      onChange={(e) => setGroupFormData({ ...groupFormData, opisanie_gruppy: e.target.value })}
                      placeholder="Пояснение к группе контрагентов"
                      className={styles.textarea}
                      rows={4}
                    />
                  </div>
                </div>

                {errors.submit && (
                  <div className={styles.errorMessage}>{errors.submit}</div>
                )}
              </>
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
