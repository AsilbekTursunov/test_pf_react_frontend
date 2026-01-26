"use client"

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/app/lib/utils'
import styles from './OperationsFiltersSidebar.module.scss'

export function OperationsFiltersSidebar({ 
  isOpen, 
  onClose,
  selectedFilters,
  onFilterChange,
  dateFilters,
  onDateFilterChange,
  dateStartFilters,
  onDateStartFilterChange,
  selectedDatePaymentRange,
  onDatePaymentRangeChange,
  selectedDateStartRange,
  onDateStartRangeChange,
  bankAccounts,
  selectedAccounts,
  onAccountToggle,
  onSelectAllAccounts,
  counterAgents,
  selectedCounterAgents,
  onCounterAgentToggle,
  onSelectAllCounterAgents
}) {
  const [isDatePaymentModalOpen, setIsDatePaymentModalOpen] = useState(false)
  const [isDateStartModalOpen, setIsDateStartModalOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0))
  const [activeInput, setActiveInput] = useState(null)
  const [tempStartDate, setTempStartDate] = useState(null)
  const [tempEndDate, setTempEndDate] = useState(null)
  const [isClosing, setIsClosing] = useState(false)
  const [openParameterDropdown, setOpenParameterDropdown] = useState(null)
  const datePickerRef = useRef(null)
  const dateStartPickerRef = useRef(null)
  const parameterDropdownRef = useRef(null)
  const accountsDropdownRef = useRef(null)
  const counterAgentsDropdownRef = useRef(null)

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
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        closeDatePaymentModal()
      }
      if (dateStartPickerRef.current && !dateStartPickerRef.current.contains(event.target)) {
        closeDateStartModal()
      }
      
      // Check for accounts dropdown
      if (openParameterDropdown === 'accounts') {
        if (accountsDropdownRef.current) {
          // Check if click was inside the dropdown container (including menu)
          const clickedInside = accountsDropdownRef.current.contains(event.target) ||
            event.target.closest(`.${styles.parameterDropdownMenu}`) !== null ||
            event.target.closest(`.${styles.parameterItem}`) !== null ||
            event.target.closest(`.${styles.checkboxWrapper}`) !== null ||
            event.target.type === 'checkbox' ||
            event.target.closest('input[type="checkbox"]') !== null
          
          // Check if click was on the button that opens the dropdown
          const button = event.target.closest(`.${styles.parameterDropdownButton}`)
          const isButtonClick = button && accountsDropdownRef.current.contains(button)
          
          if (!clickedInside && !isButtonClick) {
            setOpenParameterDropdown(null)
          }
        }
      }
      
      // Check for counteragents dropdown
      if (openParameterDropdown === 'counteragents') {
        if (counterAgentsDropdownRef.current) {
          // Check if click was inside the dropdown container (including menu)
          const clickedInside = counterAgentsDropdownRef.current.contains(event.target) ||
            event.target.closest(`.${styles.parameterDropdownMenu}`) !== null ||
            event.target.closest(`.${styles.parameterItem}`) !== null ||
            event.target.closest(`.${styles.checkboxWrapper}`) !== null ||
            event.target.type === 'checkbox' ||
            event.target.closest('input[type="checkbox"]') !== null
          
          // Check if click was on the button that opens the dropdown
          const button = event.target.closest(`.${styles.parameterDropdownButton}`)
          const isButtonClick = button && counterAgentsDropdownRef.current.contains(button)
          
          if (!clickedInside && !isButtonClick) {
            setOpenParameterDropdown(null)
          }
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openParameterDropdown])

  const formatDateRange = (range) => {
    if (!range) return null
    return `${range.start.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })}–${range.end.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })}`
  }

  const quickDateRanges = [
    { label: 'Просроченные', getValue: () => ({ start: new Date(2025, 0, 1), end: new Date() }) },
    { label: 'Вчера', getValue: () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return { start: yesterday, end: yesterday }
    }},
    { label: 'Прошлая неделя', getValue: () => ({ start: new Date(2026, 0, 5), end: new Date(2026, 0, 11) }) },
    { label: 'Прошлый месяц', getValue: () => ({ start: new Date(2025, 11, 1), end: new Date(2025, 11, 31) }) },
    { label: 'Прошлый квартал', getValue: () => ({ start: new Date(2025, 9, 1), end: new Date(2025, 11, 31) }) },
    { label: 'Прошлый год', getValue: () => ({ start: new Date(2025, 0, 1), end: new Date(2025, 11, 31) }) },
    { label: 'Будущие', getValue: () => ({ start: new Date(), end: new Date(2026, 11, 31) }) },
    { label: 'Сегодня', getValue: () => {
      const today = new Date()
      return { start: today, end: today }
    }},
    { label: 'Эта неделя', getValue: () => ({ start: new Date(2026, 0, 12), end: new Date(2026, 0, 18) }) },
    { label: 'Этот месяц', getValue: () => ({ start: new Date(2026, 0, 1), end: new Date(2026, 0, 31) }) },
    { label: 'Этот квартал', getValue: () => ({ start: new Date(2026, 0, 1), end: new Date(2026, 2, 31) }) },
    { label: 'Этот год', getValue: () => ({ start: new Date(2026, 0, 1), end: new Date(2026, 11, 31) }) }
  ]

  if (!isOpen) return null

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Фильтры</h2>
          <button 
            onClick={onClose}
            className={styles.sidebarCloseButton}
          >
            ✕
          </button>
        </div>

        {/* Тип операции - Начисление */}
        <div className={styles.filterSection}>
          <div className={styles.filterSectionHeader}>
            <label className={styles.checkboxWrapper} style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedFilters.nachisleniye || false}
                onChange={() => onFilterChange('type', 'nachisleniye')}
                className={styles.checkboxInput}
              />
              <div 
                className={cn(
                  styles.checkbox,
                  selectedFilters.nachisleniye && styles.checkboxChecked
                )}
                onClick={(e) => {
                  e.preventDefault()
                  onFilterChange('type', 'nachisleniye')
                }}
                style={{
                  '--checkbox-bg': selectedFilters.nachisleniye ? '#17a2b8' : 'white',
                  '--checkbox-border': selectedFilters.nachisleniye ? '#17a2b8' : '#cbd5e1',
                  '--checkbox-hover-border': '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                {selectedFilters.nachisleniye && (
                  <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </label>
            <h3 
              className={styles.filterSectionTitle}
              onClick={() => onFilterChange('type', 'nachisleniye')}
              style={{ cursor: 'pointer' }}
            >
              Начисление
            </h3>
          </div>
          <div className={styles.filterOptions}>
            {[
              { key: 'postupleniye', label: 'Отгрузка' },
              { key: 'vyplata', label: 'Поставка' }
            ].map(item => (
              <label key={item.key} className={styles.filterOption}>
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    checked={selectedFilters[item.key]}
                    onChange={() => onFilterChange('type', item.key)}
                    className={styles.checkboxInput}
                  />
                  <div 
                    className={cn(
                      styles.checkbox,
                      selectedFilters[item.key] && styles.checkboxChecked
                    )}
                    style={{
                      '--checkbox-bg': selectedFilters[item.key] ? '#17a2b8' : 'white',
                      '--checkbox-border': selectedFilters[item.key] ? '#17a2b8' : '#cbd5e1',
                      '--checkbox-hover-border': '#94a3b8'
                    }}
                  >
                    {selectedFilters[item.key] && (
                      <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className={styles.filterOptionLabel}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Дата оплаты - упрощенная версия, полная версия будет в отдельном компоненте */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterSectionTitle} style={{ marginBottom: '0.75rem' }}>Дата оплаты</h3>
          <div className={styles.filterOptions}>
            {[
              { key: 'podtverzhdena', label: 'Подтверждена' },
              { key: 'nePodtverzhdena', label: 'Не подтверждена' }
            ].map(item => (
              <label key={item.key} className={styles.filterOption}>
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    checked={dateFilters[item.key]}
                    onChange={() => onDateFilterChange(item.key)}
                    className={styles.checkboxInput}
                  />
                  <div 
                    className={cn(
                      styles.checkbox,
                      dateFilters[item.key] && styles.checkboxChecked
                    )}
                    style={{
                      '--checkbox-bg': dateFilters[item.key] ? '#17a2b8' : 'white',
                      '--checkbox-border': dateFilters[item.key] ? '#17a2b8' : '#cbd5e1',
                      '--checkbox-hover-border': '#94a3b8'
                    }}
                  >
                    {dateFilters[item.key] && (
                      <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className={styles.filterOptionLabel}>{item.label}</span>
              </label>
            ))}
          </div>
          
          {selectedDatePaymentRange ? (
            <div className={styles.dateRangeDisplay}>
              <div className={styles.dateRangeDisplayInner}>
                <svg className={styles.dateRangeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span className={styles.dateRangeText}>{formatDateRange(selectedDatePaymentRange)}</span>
                <button 
                  onClick={() => onDatePaymentRangeChange(null)}
                  className={styles.dateRangeClear}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.datePickerButton} ref={datePickerRef}>
              <button 
                onClick={() => {
                  setIsDatePaymentModalOpen(!isDatePaymentModalOpen)
                  if (isDateStartModalOpen) {
                    closeDateStartModal()
                  }
                  if (!isDatePaymentModalOpen) {
                    setTempStartDate(null)
                    setTempEndDate(null)
                    setActiveInput(null)
                  }
                }}
                className={styles.datePickerButtonInner}
              >
                <svg className={styles.datePickerIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Указать период
              </button>

              {/* Date Picker Dropdown */}
              {isDatePaymentModalOpen && (
                <div 
                  key="date-payment-modal"
                  className={styles.datePickerModal}
                  style={{ 
                    top: datePickerRef.current?.getBoundingClientRect().bottom + 8 + 'px',
                    left: '280px',
                    '--modal-width': activeInput ? '600px' : '440px',
                    '--modal-animation': isClosing ? 'fadeSlideOut 0.2s ease-in' : 'fadeSlideIn 0.25s ease-out'
                  }}
                >
                  <div className={styles.datePickerModalContent}>
                    <h3 className={styles.datePickerModalTitle}>Укажите период</h3>
                    
                    <div className={styles.datePickerModalBody}>
                      {/* Quick Ranges */}
                      <div className={styles.quickRanges}>
                        {quickDateRanges.map((range, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              const dateRange = range.getValue()
                              onDatePaymentRangeChange(dateRange)
                              closeDatePaymentModal()
                            }}
                            className={styles.quickRangeButton}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>

                      {/* Calendar - показывается только когда активен инпут */}
                      {activeInput && (
                        <div className={styles.calendar}>
                          <div className={styles.calendarHeader}>
                            <button 
                              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                              className={styles.calendarNavButton}
                            >
                              «
                            </button>
                            <span className={styles.calendarMonth}>
                              {currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }).replace(/^./, str => str.toUpperCase())}
                            </span>
                            <button 
                              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                              className={styles.calendarNavButton}
                            >
                              »
                            </button>
                          </div>

                          <div className={styles.calendarWeekdays}>
                            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                              <div key={day} className={styles.calendarWeekday}>
                                {day}
                              </div>
                            ))}
                          </div>

                          <div className={styles.calendarDays}>
                            {Array.from({ length: 35 }, (_, i) => {
                              const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
                              const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
                              const dayNum = i - startDay + 1
                              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum)
                              const isCurrentMonth = dayNum > 0 && dayNum <= new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
                              const isToday = date.toDateString() === new Date(2026, 0, 14).toDateString()
                              const isSelected = (tempStartDate && date.toDateString() === tempStartDate.toDateString()) || 
                                                   (tempEndDate && date.toDateString() === tempEndDate.toDateString())

                              return (
                                <button
                                  key={i}
                                  disabled={!isCurrentMonth}
                                  onClick={() => {
                                    if (isCurrentMonth) {
                                      if (activeInput === 'start') {
                                        setTempStartDate(date)
                                      } else if (activeInput === 'end') {
                                        setTempEndDate(date)
                                      }
                                    }
                                  }}
                                  className={cn(
                                    styles.calendarDay,
                                    !isCurrentMonth && styles.disabled,
                                    isCurrentMonth && !isToday && !isSelected && styles.normal,
                                    isToday && !isSelected && styles.today,
                                    isSelected && styles.selected
                                  )}
                                >
                                  {isCurrentMonth ? dayNum : ''}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Date Inputs */}
                    <div className={styles.dateInputs}>
                      <button
                        onClick={() => setActiveInput('start')}
                        className={cn(
                          styles.dateInput,
                          activeInput === 'start' ? styles.active : styles.inactive
                        )}
                      >
                        <svg className={styles.dateInputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span className={styles.dateInputText}>
                          {tempStartDate ? tempStartDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Начало периода'}
                        </span>
                      </button>
                      <span className={styles.dateInputSeparator}>—</span>
                      <button
                        onClick={() => setActiveInput('end')}
                        className={cn(
                          styles.dateInput,
                          activeInput === 'end' ? styles.active : styles.inactive
                        )}
                      >
                        <svg className={styles.dateInputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span className={styles.dateInputText}>
                          {tempEndDate ? tempEndDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Конец периода'}
                        </span>
                      </button>
                    </div>

                    {/* Actions */}
                    <div className={styles.datePickerActions}>
                      <button
                        onClick={() => {
                          setTempStartDate(null)
                          setTempEndDate(null)
                          closeDatePaymentModal()
                        }}
                        className={cn(styles.datePickerActionButton, styles.cancel)}
                      >
                        Сбросить
                      </button>
                      <button
                        onClick={() => {
                          if (tempStartDate && tempEndDate) {
                            onDatePaymentRangeChange({ start: tempStartDate, end: tempEndDate })
                          }
                          closeDatePaymentModal()
                        }}
                        className={cn(styles.datePickerActionButton, styles.apply)}
                      >
                        Применить
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Дата начисления - аналогично */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterSectionTitle} style={{ marginBottom: '0.75rem' }}>Дата начисления</h3>
          <div className={styles.filterOptions}>
            {[
              { key: 'podtverzhdena', label: 'Подтверждена' },
              { key: 'nePodtverzhdena', label: 'Не подтверждена' }
            ].map(item => (
              <label key={item.key} className={styles.filterOption}>
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    checked={dateStartFilters[item.key]}
                    onChange={() => onDateStartFilterChange(item.key)}
                    className={styles.checkboxInput}
                  />
                  <div 
                    className={cn(
                      styles.checkbox,
                      dateStartFilters[item.key] && styles.checkboxChecked
                    )}
                    style={{
                      '--checkbox-bg': dateStartFilters[item.key] ? '#17a2b8' : 'white',
                      '--checkbox-border': dateStartFilters[item.key] ? '#17a2b8' : '#cbd5e1',
                      '--checkbox-hover-border': '#94a3b8'
                    }}
                  >
                    {dateStartFilters[item.key] && (
                      <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className={styles.filterOptionLabel}>{item.label}</span>
              </label>
            ))}
          </div>
          
          {selectedDateStartRange ? (
            <div className={styles.dateRangeDisplay}>
              <div className={styles.dateRangeDisplayInner}>
                <svg className={styles.dateRangeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span className={styles.dateRangeText}>{formatDateRange(selectedDateStartRange)}</span>
                <button 
                  onClick={() => onDateStartRangeChange(null)}
                  className={styles.dateRangeClear}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.datePickerButton} ref={dateStartPickerRef}>
              <button 
                onClick={() => {
                  setIsDateStartModalOpen(!isDateStartModalOpen)
                  if (isDatePaymentModalOpen) {
                    closeDatePaymentModal()
                  }
                  if (!isDateStartModalOpen) {
                    setTempStartDate(null)
                    setTempEndDate(null)
                    setActiveInput(null)
                  }
                }}
                className={styles.datePickerButtonInner}
              >
                <svg className={styles.datePickerIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Указать период
              </button>

              {/* Date Picker Dropdown */}
              {isDateStartModalOpen && (
                <div 
                  key="date-start-modal"
                  className={styles.datePickerModal}
                  style={{ 
                    top: dateStartPickerRef.current?.getBoundingClientRect().bottom + 8 + 'px',
                    left: '280px',
                    '--modal-width': activeInput ? '600px' : '440px',
                    '--modal-animation': isClosing ? 'fadeSlideOut 0.2s ease-in' : 'fadeSlideIn 0.25s ease-out'
                  }}
                >
                  <div className={styles.datePickerModalContent}>
                    <h3 className={styles.datePickerModalTitle}>Укажите период</h3>
                    
                    <div className={styles.datePickerModalBody}>
                      {/* Quick Ranges */}
                      <div className={styles.quickRanges}>
                        {quickDateRanges.map((range, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              const dateRange = range.getValue()
                              onDateStartRangeChange(dateRange)
                              closeDateStartModal()
                            }}
                            className={styles.quickRangeButton}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>

                      {/* Calendar - показывается только когда активен инпут */}
                      {activeInput && (
                        <div className={styles.calendar}>
                          <div className={styles.calendarHeader}>
                            <button 
                              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                              className={styles.calendarNavButton}
                            >
                              «
                            </button>
                            <span className={styles.calendarMonth}>
                              {currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }).replace(/^./, str => str.toUpperCase())}
                            </span>
                            <button 
                              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                              className={styles.calendarNavButton}
                            >
                              »
                            </button>
                          </div>

                          <div className={styles.calendarWeekdays}>
                            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                              <div key={day} className={styles.calendarWeekday}>
                                {day}
                              </div>
                            ))}
                          </div>

                          <div className={styles.calendarDays}>
                            {Array.from({ length: 35 }, (_, i) => {
                              const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
                              const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
                              const dayNum = i - startDay + 1
                              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum)
                              const isCurrentMonth = dayNum > 0 && dayNum <= new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
                              const isToday = date.toDateString() === new Date(2026, 0, 14).toDateString()
                              const isSelected = (tempStartDate && date.toDateString() === tempStartDate.toDateString()) || 
                                                   (tempEndDate && date.toDateString() === tempEndDate.toDateString())

                              return (
                                <button
                                  key={i}
                                  disabled={!isCurrentMonth}
                                  onClick={() => {
                                    if (isCurrentMonth) {
                                      if (activeInput === 'start') {
                                        setTempStartDate(date)
                                      } else if (activeInput === 'end') {
                                        setTempEndDate(date)
                                      }
                                    }
                                  }}
                                  className={cn(
                                    styles.calendarDay,
                                    !isCurrentMonth && styles.disabled,
                                    isCurrentMonth && !isToday && !isSelected && styles.normal,
                                    isToday && !isSelected && styles.today,
                                    isSelected && styles.selected
                                  )}
                                >
                                  {isCurrentMonth ? dayNum : ''}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Date Inputs */}
                    <div className={styles.dateInputs}>
                      <button
                        onClick={() => setActiveInput('start')}
                        className={cn(
                          styles.dateInput,
                          activeInput === 'start' ? styles.active : styles.inactive
                        )}
                      >
                        <svg className={styles.dateInputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span className={styles.dateInputText}>
                          {tempStartDate ? tempStartDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Начало периода'}
                        </span>
                      </button>
                      <span className={styles.dateInputSeparator}>—</span>
                      <button
                        onClick={() => setActiveInput('end')}
                        className={cn(
                          styles.dateInput,
                          activeInput === 'end' ? styles.active : styles.inactive
                        )}
                      >
                        <svg className={styles.dateInputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span className={styles.dateInputText}>
                          {tempEndDate ? tempEndDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Конец периода'}
                        </span>
                      </button>
                    </div>

                    {/* Actions */}
                    <div className={styles.datePickerActions}>
                      <button
                        onClick={() => {
                          setTempStartDate(null)
                          setTempEndDate(null)
                          closeDateStartModal()
                        }}
                        className={cn(styles.datePickerActionButton, styles.cancel)}
                      >
                        Сбросить
                      </button>
                      <button
                        onClick={() => {
                          if (tempStartDate && tempEndDate) {
                            onDateStartRangeChange({ start: tempStartDate, end: tempEndDate })
                          }
                          closeDateStartModal()
                        }}
                        className={cn(styles.datePickerActionButton, styles.apply)}
                      >
                        Применить
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Параметры */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterSectionTitle} style={{ marginBottom: '0.75rem' }}>Параметры</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* Юрлица и счета */}
            <div className={styles.parameterDropdown} ref={accountsDropdownRef}>
              <button 
                onClick={() => setOpenParameterDropdown(openParameterDropdown === 'accounts' ? null : 'accounts')}
                className={styles.parameterDropdownButton}
              >
                <div className={styles.parameterDropdownButtonContent}>
                  {bankAccounts && Object.keys(selectedAccounts).filter(guid => selectedAccounts[guid]).length > 0 ? (
                    <div className={styles.parameterDropdownChips}>
                      {Object.keys(selectedAccounts)
                        .filter(guid => selectedAccounts[guid])
                        .slice(0, 2)
                        .map(guid => {
                          const account = bankAccounts.find(acc => acc.guid === guid)
                          if (!account) return null
                          return (
                            <div key={guid} className={styles.parameterDropdownChip}>
                              <span className={styles.parameterDropdownChipLabel}>{account.label}</span>
                              <button
                                className={styles.parameterDropdownChipRemove}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onAccountToggle(guid)
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                              >
                                <svg className={styles.parameterDropdownChipRemoveIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          )
                        })}
                      {Object.keys(selectedAccounts).filter(guid => selectedAccounts[guid]).length > 2 && (
                        <span className={styles.parameterDropdownChipMore}>
                          +{Object.keys(selectedAccounts).filter(guid => selectedAccounts[guid]).length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span>Юрлица и счета</span>
                  )}
                </div>
                <svg className={cn(styles.parameterDropdownIcon, openParameterDropdown === 'accounts' && styles.open)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openParameterDropdown === 'accounts' && (
                <div 
                  className={styles.parameterDropdownMenu}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className={styles.parameterDropdownSearch}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="Поиск по списку"
                        className={styles.parameterDropdownSearchInput}
                      />
                      <svg className={styles.parameterDropdownSearchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <div className={styles.parameterDropdownSelectAll}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectAllAccounts()
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className={styles.parameterDropdownSelectAllButton}
                    >
                      Выбрать все
                    </button>
                  </div>
                  
                  <div className={styles.parameterDropdownList}>
                    <div className={styles.parameterDropdownListInner}>
                      {bankAccounts && bankAccounts.length > 0 ? (
                        Object.entries(
                          bankAccounts.reduce((acc, account) => {
                            const group = account.group || 'Без группы'
                            if (!acc[group]) acc[group] = []
                            acc[group].push(account)
                            return acc
                          }, {})
                        ).map(([groupName, items]) => (
                          <div key={groupName} className={styles.parameterGroup}>
                            <div className={styles.parameterGroupTitle}>
                              {groupName}
                            </div>
                            {items.map((account) => (
                              <label 
                                key={account.guid} 
                                className={cn(styles.parameterItem, styles.nested)}
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                              >
                                <div className={styles.checkboxWrapper}>
                                  <input
                                    type="checkbox"
                                    checked={selectedAccounts[account.guid] || false}
                                    onChange={(e) => {
                                      e.stopPropagation()
                                      onAccountToggle(account.guid)
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                    }}
                                    onMouseDown={(e) => {
                                      e.stopPropagation()
                                    }}
                                    className={styles.checkboxInput}
                                  />
                                  <div 
                                    className={cn(
                                      styles.checkbox,
                                      selectedAccounts[account.guid] && styles.checkboxChecked
                                    )}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onAccountToggle(account.guid)
                                    }}
                                    onMouseDown={(e) => {
                                      e.stopPropagation()
                                      onAccountToggle(account.guid)
                                    }}
                                    style={{
                                      '--checkbox-bg': selectedAccounts[account.guid] ? '#17a2b8' : 'white',
                                      '--checkbox-border': selectedAccounts[account.guid] ? '#17a2b8' : '#cbd5e1',
                                      '--checkbox-hover-border': '#94a3b8'
                                    }}
                                  >
                                    {selectedAccounts[account.guid] && (
                                      <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                                <span className={styles.parameterItemLabel}>{account.label}</span>
                              </label>
                            ))}
                          </div>
                        ))
                      ) : (
                        <div className={styles.parameterItemLabel} style={{ padding: '0.5rem', color: '#94a3b8' }}>
                          Нет доступных счетов
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Контрагенты */}
            <div className={styles.parameterDropdown} ref={counterAgentsDropdownRef}>
              <button 
                onClick={() => setOpenParameterDropdown(openParameterDropdown === 'counteragents' ? null : 'counteragents')}
                className={styles.parameterDropdownButton}
              >
                <div className={styles.parameterDropdownButtonContent}>
                  {counterAgents && Object.keys(selectedCounterAgents).filter(guid => selectedCounterAgents[guid]).length > 0 ? (
                    <div className={styles.parameterDropdownChips}>
                      {Object.keys(selectedCounterAgents)
                        .filter(guid => selectedCounterAgents[guid])
                        .slice(0, 2)
                        .map(guid => {
                          const agent = counterAgents.find(ca => ca.guid === guid)
                          if (!agent) return null
                          return (
                            <div key={guid} className={styles.parameterDropdownChip}>
                              <span className={styles.parameterDropdownChipLabel}>{agent.label}</span>
                              <button
                                className={styles.parameterDropdownChipRemove}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onCounterAgentToggle(guid)
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                              >
                                <svg className={styles.parameterDropdownChipRemoveIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          )
                        })}
                      {Object.keys(selectedCounterAgents).filter(guid => selectedCounterAgents[guid]).length > 2 && (
                        <span className={styles.parameterDropdownChipMore}>
                          +{Object.keys(selectedCounterAgents).filter(guid => selectedCounterAgents[guid]).length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span>Контрагенты</span>
                  )}
                </div>
                <svg className={cn(styles.parameterDropdownIcon, openParameterDropdown === 'counteragents' && styles.open)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openParameterDropdown === 'counteragents' && (
                <div 
                  className={styles.parameterDropdownMenu}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className={styles.parameterDropdownSearch}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="Поиск по списку"
                        className={styles.parameterDropdownSearchInput}
                      />
                      <svg className={styles.parameterDropdownSearchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <div className={styles.parameterDropdownSelectAll}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectAllCounterAgents()
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className={styles.parameterDropdownSelectAllButton}
                    >
                      Выбрать все
                    </button>
                  </div>
                  
                  <div className={styles.parameterDropdownList}>
                    <div className={styles.parameterDropdownListInner}>
                      {counterAgents && counterAgents.length > 0 ? (
                        Object.entries(
                          counterAgents.reduce((acc, ca) => {
                            const group = ca.group || 'Без группы'
                            if (!acc[group]) acc[group] = []
                            acc[group].push(ca)
                            return acc
                          }, {})
                        ).map(([groupName, items]) => (
                          <div key={groupName} className={styles.parameterGroup}>
                            <div className={styles.parameterGroupTitle}>
                              {groupName}
                            </div>
                            {items.map((ca) => (
                              <label 
                                key={ca.guid} 
                                className={cn(styles.parameterItem, styles.nested)}
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                              >
                                <div className={styles.checkboxWrapper}>
                                  <input
                                    type="checkbox"
                                    checked={selectedCounterAgents[ca.guid] || false}
                                    onChange={(e) => {
                                      e.stopPropagation()
                                      onCounterAgentToggle(ca.guid)
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                    }}
                                    onMouseDown={(e) => {
                                      e.stopPropagation()
                                    }}
                                    className={styles.checkboxInput}
                                  />
                                <div 
                                  className={cn(
                                    styles.checkbox,
                                    selectedCounterAgents[ca.guid] && styles.checkboxChecked
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onCounterAgentToggle(ca.guid)
                                  }}
                                  onMouseDown={(e) => {
                                    e.stopPropagation()
                                    onCounterAgentToggle(ca.guid)
                                  }}
                                  style={{
                                    '--checkbox-bg': selectedCounterAgents[ca.guid] ? '#17a2b8' : 'white',
                                    '--checkbox-border': selectedCounterAgents[ca.guid] ? '#17a2b8' : '#cbd5e1',
                                    '--checkbox-hover-border': '#94a3b8'
                                  }}
                                >
                                  {selectedCounterAgents[ca.guid] && (
                                    <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              <span className={styles.parameterItemLabel}>{ca.label}</span>
                            </label>
                            ))}
                          </div>
                        ))
                      ) : (
                        <div className={styles.parameterItemLabel} style={{ padding: '0.5rem', color: '#94a3b8' }}>
                          Нет доступных контрагентов
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Сумма */}
        <div className={styles.filterSection}>
          <h3 className={styles.filterSectionTitle} style={{ marginBottom: '0.75rem' }}>Сумма от</h3>
          <div className={styles.amountInputs}>
            <input
              type="text"
              placeholder=""
              className={styles.amountInput}
            />
            <span className={styles.amountInputSeparator}>до</span>
            <input
              type="text"
              placeholder=""
              className={styles.amountInput}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
