"use client"

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { FilterSidebar, FilterSection, FilterCheckbox } from '@/components/directories/FilterSidebar/FilterSidebar'
import { SearchBar } from '@/components/directories/SearchBar/SearchBar'
import { DataTable } from '@/components/directories/DataTable/DataTable'
import { DropdownFilter } from '@/components/directories/DropdownFilter/DropdownFilter'
import { useBankAccounts } from '@/hooks/useDashboard'
import { cn } from '@/app/lib/utils'
import styles from './accounts.module.scss'

export default function AccountsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Fetch bank accounts from API
  const { data: bankAccountsData, isLoading: isLoadingBankAccounts } = useBankAccounts({
    limit: 100,
    offset: 0,
    search: searchQuery
  })

  const bankAccountsItems = bankAccountsData?.data?.data?.response || []
  const [selectedRows, setSelectedRows] = useState([])
  const [accountingMethod, setAccountingMethod] = useState('cash')
  const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false)
  const methodDropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (methodDropdownRef.current && !methodDropdownRef.current.contains(event.target)) {
        setIsMethodDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  
  const [filters, setFilters] = useState({
    nalichnye: true,
    beznalichnye: true,
    kartaFizlica: true,
    elektronnye: true,
    showActive: true,
    showArchived: true
  })

  const [selectedEntity, setSelectedEntity] = useState([])
  const [selectedAccountsGroups, setSelectedAccountsGroups] = useState([])

  const entities = [
    { value: 1, label: 'ИП Иванов' },
    { value: 2, label: 'ООО Прометей' },
    { value: 3, label: 'ООО Строй-Мастер' }
  ]

  const accountsGroups = [
    { value: 1, label: 'Основные счета' },
    { value: 2, label: 'Резервные счета' },
    { value: 3, label: 'Проектные счета' }
  ]

  const accountingMethods = [
    { value: 'cash', label: 'Кассовый метод' },
    { value: 'accrual', label: 'Метод начисления' }
  ]

  const toggleFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Convert bank accounts API data to component format
  const accounts = useMemo(() => {
    return bankAccountsItems.map((item, index) => ({
      id: item.guid || `account-${index}`,
      name: item.nazvanie || 'Без названия',
      type: 'account',
      currentBalance: item.balans != null ? `${item.balans.toLocaleString('ru-RU')} ${item.currenies_id_data?.kod || ''}` : null,
      accountType: item.currenies_id_data?.nazvanie || null,
      accountNumber: item.nomer_scheta ? String(item.nomer_scheta) : null,
      currency: item.currenies_id_data || null,
      children: undefined
    }))
  }, [bankAccountsItems])

  const [expandedEntities, setExpandedEntities] = useState([1, 2])
  const [closingEntities, setClosingEntities] = useState([])

  const toggleEntity = (id) => {
    if (expandedEntities.includes(id)) {
      // Start closing animation
      setClosingEntities(prev => [...prev, id])
      setTimeout(() => {
        setExpandedEntities(prev => prev.filter(eid => eid !== id))
        setClosingEntities(prev => prev.filter(eid => eid !== id))
      }, 300) // Match animation duration (0.3s)
    } else {
      setExpandedEntities(prev => [...prev, id])
    }
  }

  const toggleAllEntities = () => {
    if (expandedEntities.length === accounts.length) {
      // All expanded, collapse all with animation
      setClosingEntities(expandedEntities)
      setTimeout(() => {
        setExpandedEntities([])
        setClosingEntities([])
      }, 300)
    } else {
      // Some or none expanded, expand all
      setExpandedEntities(accounts.map(a => a.id))
    }
  }

  const allEntitiesExpanded = expandedEntities.length === accounts.length

  const isEntityExpanded = (id) => expandedEntities.includes(id)

  const isRowSelected = (id) => selectedRows.includes(id)
  
  const getAllSelectableIds = () => {
    const ids = []
    accounts.forEach(entity => {
      ids.push(entity.id)
      if (entity.children) {
        entity.children.forEach(child => ids.push(child.id))
      }
    })
    return ids
  }

  const allSelected = () => {
    const allIds = getAllSelectableIds()
    return allIds.length > 0 && allIds.every(id => selectedRows.includes(id))
  }

  const toggleSelectAll = () => {
    if (allSelected()) {
      setSelectedRows([])
    } else {
      setSelectedRows(getAllSelectableIds())
    }
  }
  
  const toggleRowSelection = (id) => {
    const entity = accounts.find(e => e.id === id)
    
    if (entity && entity.children) {
      // This is a parent entity
      const childIds = entity.children.map(c => c.id)
      const allIds = [id, ...childIds]
      
      if (selectedRows.includes(id)) {
        // Unselect parent and all children
        setSelectedRows(prev => prev.filter(rid => !allIds.includes(rid)))
      } else {
        // Select parent and all children
        setSelectedRows(prev => [...new Set([...prev, ...allIds])])
      }
    } else {
      // This is a child or standalone item
      if (selectedRows.includes(id)) {
        setSelectedRows(prev => prev.filter(rid => rid !== id))
      } else {
        setSelectedRows(prev => [...prev, id])
      }
    }
  }

  const totalCurrentBalance = accounts.reduce((sum, entity) => {
    if (!entity.currentBalance) return sum
    const balance = parseFloat(entity.currentBalance.replace(/[^\d.-]/g, ''))
    return sum + (isNaN(balance) ? 0 : balance)
  }, 0)

  return (
    <div className={styles.container}>
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <FilterSection title="Тип">
          <div className="space-y-2.5">
            <FilterCheckbox 
              checked={filters.nalichnye} 
              onChange={() => toggleFilter('nalichnye')} 
              label="Наличный" 
            />
            <FilterCheckbox 
              checked={filters.beznalichnye} 
              onChange={() => toggleFilter('beznalichnye')} 
              label="Безналичный" 
            />
            <FilterCheckbox 
              checked={filters.kartaFizlica} 
              onChange={() => toggleFilter('kartaFizlica')} 
              label="Карта физлица" 
            />
            <FilterCheckbox 
              checked={filters.elektronnye} 
              onChange={() => toggleFilter('elektronnye')} 
              label="Электронный" 
            />
          </div>
        </FilterSection>

        <FilterSection title="Параметры">
          <div className="space-y-3">
            <DropdownFilter
              label="Юрлица"
              options={entities}
              selectedValues={selectedEntity}
              onChange={setSelectedEntity}
              placeholder="Выберите юрлицо"
            />
            
            <DropdownFilter
              label="Счета и группы"
              options={accountsGroups}
              selectedValues={selectedAccountsGroups}
              onChange={setSelectedAccountsGroups}
              placeholder="Выберите счета"
            />
          </div>
        </FilterSection>

        <FilterSection title="Архив">
          <div className="space-y-2.5">
            <FilterCheckbox 
              checked={filters.showActive} 
              onChange={() => toggleFilter('showActive')} 
              label="Показать активные" 
            />
            <FilterCheckbox 
              checked={filters.showArchived} 
              onChange={() => toggleFilter('showArchived')} 
              label="Показать архивные" 
            />
          </div>
        </FilterSection>
      </FilterSidebar>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Мои счета</h1>
            
            <div className={styles.headerActions}>
              {/* Accounting Method Dropdown */}
              <div className={styles.methodDropdown} ref={methodDropdownRef}>
                <button
                  onClick={() => setIsMethodDropdownOpen(!isMethodDropdownOpen)}
                  className={styles.methodButton}
                >
                  <span>{accountingMethods.find(m => m.value === accountingMethod)?.label}</span>
                  <svg 
                    className={cn(styles.methodButtonIcon, isMethodDropdownOpen && styles.open)}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isMethodDropdownOpen && (
                  <div className={styles.methodDropdownMenu}>
                    <div className={styles.methodDropdownList}>
                      {accountingMethods.map((method) => (
                        <button
                          key={method.value}
                          onClick={() => {
                            setAccountingMethod(method.value)
                            setIsMethodDropdownOpen(false)
                          }}
                          className={cn(
                            styles.methodDropdownItem,
                            accountingMethod === method.value ? styles.active : styles.inactive
                          )}
                        >
                          {method.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Search */}
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по названию"
                  className={styles.searchInput}
                />
                <svg className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={cn(styles.tableHeaderCell)}>
                    <div 
                      onClick={toggleSelectAll}
                      className={cn(
                        styles.checkbox,
                        styles.headerCheckbox,
                        allSelected() ? styles.selected : styles.unselected
                      )}
                    >
                      {allSelected() && (
                        <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className={cn(styles.tableHeaderCell, styles.expand)}>
                    <button
                      onClick={toggleAllEntities}
                      className={styles.expandButton}
                    >
                      <div className={styles.expandIcon}>
                        <svg className={styles.expandIconHorizontal} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                        <svg 
                          className={cn(
                            styles.expandIconVertical,
                            allEntitiesExpanded ? styles.expanded : styles.collapsed
                          )}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth="2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V4" />
                        </svg>
                      </div>
                    </button>
                  </th>
                  <th className={styles.tableHeaderCell}>
                    <button className={styles.tableHeaderButton}>
                      Название
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </th>
                  <th className={styles.tableHeaderCell}>
                    <button className={styles.tableHeaderButton}>
                      Номер счета
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </th>
                  <th className={cn(styles.tableHeaderCell, styles.right)}>
                    <button className={styles.tableHeaderButton}>
                      Баланс
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </th>
                  <th className={styles.tableHeaderCell}>
                    <button className={styles.tableHeaderButton}>
                      Валюта
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((entity) => (
                  <React.Fragment key={entity.id}>
                    {/* Entity Row */}
                    <tr className={styles.entityRow}>
                      <td className={styles.tableCell}>
                        <div 
                          onClick={() => toggleRowSelection(entity.id)}
                          className={cn(
                            styles.checkbox,
                            isRowSelected(entity.id) ? styles.selected : styles.unselected
                          )}
                        >
                          {isRowSelected(entity.id) && (
                            <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className={cn(styles.tableCell, styles.childExpandCell)}>
                        {entity.children && entity.children.length > 0 ? (
                          <button
                            onClick={() => toggleEntity(entity.id)}
                            className={styles.expandButton}
                          >
                            <div className={styles.expandIcon}>
                              <svg className={styles.expandIconHorizontal} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                              </svg>
                              <svg 
                                className={cn(
                                  styles.expandIconVertical,
                                  isEntityExpanded(entity.id) ? styles.expanded : styles.collapsed
                                )}
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor" 
                                strokeWidth="2.5"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V4" />
                              </svg>
                            </div>
                          </button>
                        ) : (
                          <div className={styles.emptyExpandCell}></div>
                        )}
                      </td>
                      <td className={cn(styles.tableCell, styles.text)}>{entity.name}</td>
                      <td className={cn(styles.tableCell, styles.textMuted)}>{entity.accountNumber || '–'}</td>
                      <td className={cn(styles.tableCell, styles.text, styles.fontMedium, styles.textRight)}>
                        {entity.currentBalance || '–'}
                      </td>
                      <td className={cn(styles.tableCell, styles.textMuted)}>{entity.accountType || '–'}</td>
                    </tr>

                    {/* Children Rows Wrapper */}
                    {(isEntityExpanded(entity.id) || closingEntities.includes(entity.id)) && entity.children && (
                      <tr>
                        <td colSpan={6} className={styles.childrenWrapper}>
                          <div 
                            className={cn(
                              styles.childrenContainer,
                              closingEntities.includes(entity.id) ? styles.collapsing : styles.expanding
                            )}
                          >
                            <div className={styles.childrenTable}>
                              <table className={styles.table}>
                                <tbody>
                                  {entity.children.map((child, childIndex) => (
                                    <tr 
                                      key={child.id} 
                                      className={cn(
                                        styles.childRow,
                                        !closingEntities.includes(entity.id) && styles.childRowAnimated
                                      )}
                                      style={{
                                        animationDelay: !closingEntities.includes(entity.id) ? `${childIndex * 0.04}s` : undefined
                                      }}
                                    >
                                      <td className={cn(styles.tableCell, styles.childCheckbox)}>
                                        <div 
                                          onClick={() => toggleRowSelection(child.id)}
                                          className={cn(
                                            styles.checkbox,
                                            isRowSelected(child.id) ? styles.selected : styles.unselected
                                          )}
                                        >
                                          {isRowSelected(child.id) && (
                                            <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                          )}
                                        </div>
                                      </td>
                                      <td className={cn(styles.tableCell, styles.childExpandCell)}>
                                        <div 
                                          className={styles.dashedLineVertical}
                                          style={{ 
                                            top: '0',
                                            height: childIndex === entity.children.length - 1 ? '50%' : '100%'
                                          }}
                                        ></div>
                                        <div 
                                          className={styles.dashedLineHorizontal}
                                          style={{ 
                                            left: '50%',
                                            width: 'calc(50% + 8px)'
                                          }}
                                        ></div>
                                      </td>
                                      <td className={cn(styles.tableCell, styles.text)}>{child.name}</td>
                                      <td className={cn(styles.tableCell, styles.textMuted)}>{child.accountNumber || '–'}</td>
                                      <td className={cn(
                                        styles.tableCell,
                                        styles.text,
                                        styles.fontMedium,
                                        styles.textRight,
                                        child.currentBalance && child.currentBalance.includes('-') ? styles.balanceNegative : styles.balancePositive
                                      )}>{child.currentBalance || '–'}</td>
                                      <td className={cn(styles.tableCell, styles.textMuted)}>{child.accountType || '–'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer - Always visible at bottom */}
        <div className={cn(styles.footer, isFilterOpen && styles.footerWithFilter)}>
          <div className={styles.footerText}>
            <span className={styles.footerTextBold}>
              {bankAccountsData?.data?.data?.count || 0} {bankAccountsData?.data?.data?.count === 1 ? 'счет' : bankAccountsData?.data?.data?.count && bankAccountsData.data.data.count < 5 ? 'счета' : 'счетов'}
            </span>
          </div>
          <div className={styles.footerTextMuted}>
            {isLoadingBankAccounts ? (
              'Загрузка...'
            ) : (
              <>
                Текущий остаток: <span className={styles.footerTextBold}>
                  {accounts.reduce((sum, acc) => {
                    const balance = parseFloat((acc.currentBalance || '0').replace(/[^\d.-]/g, ''))
                    return sum + (isNaN(balance) ? 0 : balance)
                  }, 0).toLocaleString('ru-RU')} ₽
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
