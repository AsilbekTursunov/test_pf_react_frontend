"use client"

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/app/lib/utils'
import styles from './GroupedSelect.module.scss'

export function GroupedSelect({ 
  data = [], 
  value, 
  onChange, 
  placeholder = "Выберите...",
  groupBy = null,
  labelKey = 'label',
  valueKey = 'guid',
  groupKey = 'group',
  className = "",
  disabled = false,
  loading = false,
  onCreate = null,
  createButtonText = "Создать"
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter data by search
  const filteredData = data.filter(item => 
    item[labelKey]?.toLowerCase().includes(search.toLowerCase())
  )

  // Group data if groupBy is enabled
  const groupedData = groupBy 
    ? filteredData.reduce((acc, item) => {
        const group = item[groupKey] || 'Без группы'
        if (!acc[group]) acc[group] = []
        acc[group].push(item)
        return acc
      }, {})
    : { 'all': filteredData }

  // Check if data is empty
  const isEmpty = filteredData.length === 0

  // Get selected item label
  const selectedItem = data.find(item => item[valueKey] === value)
  const selectedLabel = selectedItem ? selectedItem[labelKey] : placeholder

  const handleSelect = (item) => {
    onChange(item[valueKey], item)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div className={cn(styles.container, className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={cn(
          styles.button,
          disabled || loading ? styles.disabled : styles.enabled,
          !value && styles.empty
        )}
      >
        <div className={styles.buttonContent}>
          <span className={styles.buttonText}>{loading ? "Загрузка..." : selectedLabel}</span>
          <svg 
            className={cn(styles.buttonIcon, isOpen && styles.open)} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {/* Search input - only show if there's data */}
          {!isEmpty && (
            <div className={styles.searchContainer}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск..."
                className={styles.searchInput}
                autoFocus
              />
            </div>
          )}

          {/* Options list */}
          <div className={styles.optionsList}>
            {isEmpty ? (
              <div className={styles.emptyState}>
                Ничего не найдено
              </div>
            ) : (
              Object.entries(groupedData).map(([groupName, items]) => (
                <div key={groupName} className={styles.group}>
                  {groupBy && (
                    <div className={styles.groupHeader}>
                      {groupName}
                    </div>
                  )}
                  {items.map((item) => (
                    <button
                      key={item[valueKey]}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className={cn(
                        styles.option,
                        value === item[valueKey] ? styles.selected : ''
                      )}
                    >
                      {item[labelKey]}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Create button */}
          {onCreate && (
            <div className={styles.createButtonContainer}>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onCreate()
                }}
                className={styles.createButton}
              >
                <svg className={styles.createButtonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {createButtonText}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
