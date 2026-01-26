"use client"

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { FilterSidebar, FilterSection, FilterCheckbox } from '@/components/directories/FilterSidebar/FilterSidebar'
import { SearchBar } from '@/components/directories/SearchBar/SearchBar'
import { useCounterparties } from '@/hooks/useDashboard'
import { cn } from '@/app/lib/utils'
import styles from './counterparties.module.scss'

export default function CounterpartiesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Fetch counterparties from API
  const { data: counterpartiesData, isLoading: isLoadingCounterparties } = useCounterparties({
    limit: 100,
    offset: 0,
    search: searchQuery
  })

  const counterpartiesItems = counterpartiesData?.data?.data?.response || []
  const [selectedRows, setSelectedRows] = useState([])
  
  const [filters, setFilters] = useState({
    client: true,
    employee: true,
    supplier: true
  })

  const toggleRowSelection = (id) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const isRowSelected = (id) => {
    return selectedRows.includes(id)
  }

  const allSelected = () => {
    return counterparties.length > 0 && selectedRows.length === counterparties.length
  }

  const toggleSelectAll = () => {
    if (allSelected()) {
      setSelectedRows([])
    } else {
      setSelectedRows(counterparties.map(item => item.id))
    }
  }

  const toggleFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Convert counterparties API data to component format
  const counterparties = useMemo(() => {
    return counterpartiesItems.map((item, index) => ({
      id: item.guid || `counterparty-${index}`,
      name: item.nazvanie || 'Без названия',
      inn: item.inn ? String(item.inn) : null,
      group: item.gruppa && item.gruppa.length > 0 ? item.gruppa[0] : null,
      groups: item.gruppa || [],
    }))
  }, [counterpartiesItems])

  const totalCounterparties = counterparties.length

  return (
    <div className={styles.container}>
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <FilterSection title="Группа">
          <div className="space-y-2.5">
            <FilterCheckbox 
              checked={filters.client} 
              onChange={() => toggleFilter('client')} 
              label="Клиент" 
            />
            <FilterCheckbox 
              checked={filters.employee} 
              onChange={() => toggleFilter('employee')} 
              label="Сотрудник" 
            />
            <FilterCheckbox 
              checked={filters.supplier} 
              onChange={() => toggleFilter('supplier')} 
              label="Поставщик" 
            />
          </div>
        </FilterSection>
      </FilterSidebar>

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Контрагенты</h1>
            <div className={styles.headerActions}>
              <SearchBar 
                value={searchQuery} 
                onChange={setSearchQuery} 
                placeholder="Поиск по названию или ИНН" 
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
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
                      ИНН
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </th>
                  <th className={styles.tableHeaderCell}>
                    <button className={styles.tableHeaderButton}>
                      Группа
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoadingCounterparties ? (
                  <tr>
                    <td colSpan={4} className={cn(styles.tableCell, styles.textCenter)}>
                      Загрузка...
                    </td>
                  </tr>
                ) : counterparties.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={cn(styles.tableCell, styles.textCenter)}>
                      Нет данных
                    </td>
                  </tr>
                ) : (
                  counterparties.map((counterparty) => (
                    <tr key={counterparty.id} className={styles.entityRow}>
                      <td className={styles.tableCell}>
                        <div 
                          onClick={() => toggleRowSelection(counterparty.id)}
                          className={cn(
                            styles.checkbox,
                            isRowSelected(counterparty.id) ? styles.selected : styles.unselected
                          )}
                        >
                          {isRowSelected(counterparty.id) && (
                            <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className={cn(styles.tableCell, styles.text)}>{counterparty.name}</td>
                      <td className={cn(styles.tableCell, styles.textMuted)}>{counterparty.inn || '–'}</td>
                      <td className={cn(styles.tableCell, styles.textMuted)}>{counterparty.group || '–'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className={cn(styles.footer, isFilterOpen && styles.footerWithFilter)}>
          <div className={styles.footerText}>
            <span className={styles.footerTextBold}>
              {totalCounterparties} {totalCounterparties === 1 ? 'контрагент' : totalCounterparties < 5 ? 'контрагента' : 'контрагентов'}
              </span>
          </div>
        </div>
      </div>
    </div>
  )
}
