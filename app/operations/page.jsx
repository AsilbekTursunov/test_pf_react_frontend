"use client"

import { useState, useRef, useEffect, Fragment } from 'react'
import { cn } from '@/app/lib/utils'

export default function OperationsPage() {
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

  const [isDatePaymentModalOpen, setIsDatePaymentModalOpen] = useState(false)
  const [isDateStartModalOpen, setIsDateStartModalOpen] = useState(false)
  const [selectedDatePaymentRange, setSelectedDatePaymentRange] = useState(null)
  const [selectedDateStartRange, setSelectedDateStartRange] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0))
  const [activeInput, setActiveInput] = useState(null) // 'start' or 'end'
  const [tempStartDate, setTempStartDate] = useState(null)
  const [tempEndDate, setTempEndDate] = useState(null)
  const [isClosing, setIsClosing] = useState(false)
  const datePickerRef = useRef(null)
  const dateStartPickerRef = useRef(null)
  
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
  
  const [openParameterDropdown, setOpenParameterDropdown] = useState(null)
  const [selectedAccounts, setSelectedAccounts] = useState({
    ip: true,
    seif: true,
    alfa: true,
    karta: true,
    prometey: true,
    tbank: true
  })
  const parameterDropdownRef = useRef(null)

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
    setSelectedAccounts({
      ip: true,
      seif: true,
      alfa: true,
      karta: true,
      prometey: true,
      tbank: true
    })
  }

  const operations = [
    // Сегодня
    { id: 1, date: '19 янв 2026', dateSecondary: '12 ноя 2025', account: 'Сейф', type: 'in', counterparty: 'Королев А. А.', status: 'Услуги ремонта [Доходы]', project: 'Ленина, 15', amount: '+198 620', section: 'today' },
    { id: 2, date: '18 янв 2026', dateSecondary: '12 ноя 2025', account: 'Наличка', type: 'out', counterparty: 'ООО Вода', status: 'Хозяйственные расход...', project: '', amount: '-6 000', section: 'today' },
    { id: 3, date: '18 янв 2026', dateSecondary: '12 ноя 2025', account: 'Альфа банк', type: 'out', counterparty: 'ООО Бизнес Сити', status: 'Аренда [Расходы]', project: '', amount: '-48 600', section: 'today' },
    { id: 4, date: '17 янв 2026', dateSecondary: '12 ноя 2025', account: 'Наличка', type: 'out', counterparty: 'ООО Топливная ко...', status: 'ГСМ [Расходы]', project: '', amount: '-10 000', section: 'today' },
    { id: 5, date: '15 янв 2026', dateSecondary: '12 ноя 2025', account: 'Альфа банк', type: 'out', counterparty: 'ИП Муравьева Анн...', status: 'Аренда склада [Расходы]', project: '', amount: '-21 400', section: 'today' },
    
    // Сегодня (выделенные с подстроками)
    { id: 6, date: '20 апр 2026', dateSecondary: 'Распределе...', account: '[ООО "Прометей"]', type: 'transfer', counterparty: '[Начисление]', status: 'Транспорт [Активы] [Спис...', project: '', amount: '-80 000', section: 'selected', selected: true, hasChildren: true, expanded: false },
    { id: 61, parentId: 6, date: '', dateSecondary: '', account: '', type: '', counterparty: '', status: 'Амортизация [Расход] [Ам...', project: '', amount: '+80 000', section: 'selected', isChild: true },
    { id: 7, date: '19 апр 2026', dateSecondary: 'Распределе...', account: 'Сейф', type: 'out', counterparty: 'Сбербанк', status: '2 статьи', project: '', amount: '-10 425', section: 'selected', selected: true, hasChildren: true, expanded: false },
    { id: 71, parentId: 7, date: '19 апр 2026', dateSecondary: '', account: '', type: 'out', counterparty: 'Сбербанк', status: 'Кредит от 19.05.2025 [О...', project: '', amount: '-7 500 • (71.94%)', section: 'selected', isChild: true },
    { id: 72, parentId: 7, date: '08 июл 2026', dateSecondary: '', account: '', type: 'out', counterparty: 'Сбербанк', status: 'Проценты по кредитам ...', project: '', amount: '-2 925 • (28.06%)', section: 'selected', isChild: true },
    
    // Вчера и ранее
    { id: 8, date: '13 янв 2026', dateSecondary: '12 ноя 2025', account: 'Альфа банк', type: 'out', counterparty: 'ООО Комус', status: 'Канцелярия [Расходы]', project: '', amount: '-14 789', section: 'yesterday' },
    { id: 9, date: '12 янв 2026', dateSecondary: '12 ноя 2025', account: 'Сбер', type: 'in', counterparty: 'Королев А. А.', status: 'Услуги ремонта [Доходы]', project: 'Ленина, 15', amount: '+80 000', section: 'yesterday' },
    { id: 10, date: '06 янв 2026', dateSecondary: '18 дек 2025', account: 'Т-Банк', type: 'out', counterparty: 'Листьева А.И.', status: 'ЗП отдел продаж [Расхо...', project: '', amount: '-50 000', section: 'yesterday' },
    { id: 11, date: '06 янв 2026', dateSecondary: '20 дек 2025', account: 'Т-Банк', type: 'out', counterparty: 'Петренко Нина Сем...', status: 'ЗП бухгалтера [Расходы]', project: '', amount: '-52 000', section: 'yesterday' },
    { id: 12, date: '06 янв 2026', dateSecondary: '20 дек 2025', account: 'Т-Банк', type: 'out', counterparty: 'Яндекс Директ', status: 'Реклама [Расходы]', project: '', amount: '-50 000', section: 'yesterday' }
  ]

  const [selectedOperations, setSelectedOperations] = useState([6, 7])
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
    if (operation.type === 'transfer') {
      setModalType('accrual')
    } else if (operation.type === 'out') {
      setModalType('payment')
    } else if (operation.type === 'in') {
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

  const selectedTotal = operations
    .filter(op => selectedOperations.includes(op.id))
    .reduce((sum, op) => sum + parseInt(op.amount.replace(/[^0-9-]/g, '')), 0)

  const toggleFilter = (category, key) => {
    if (category === 'type') {
      setSelectedFilters(prev => ({ ...prev, [key]: !prev[key] }))
    } else if (category === 'date') {
      setDateFilters(prev => ({ ...prev, [key]: !prev[key] }))
    } else if (category === 'dateStart') {
      setDateStartFilters(prev => ({ ...prev, [key]: !prev[key] }))
    }
  }

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

  return (
    <div className="flex h-screen bg-slate-50 relative">
      {/* Sidebar Filters */}
      {isFilterOpen && (
        <div className="w-[280px] bg-white border-r border-slate-200 flex flex-col h-screen relative z-10">
          <div className="p-6 overflow-y-auto flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[16px] font-semibold text-slate-900">Фильтры</h2>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-[18px]"
              >
                ✕
              </button>
            </div>

            {/* Тип операции */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="relative">
                  <input type="checkbox" checked readOnly className="peer sr-only" />
                  <div className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all bg-[#17a2b8] border-[#17a2b8]">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-[13px] font-medium text-slate-900">Начисление</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { key: 'postupleniye', label: 'Отгрузка' },
                  { key: 'vyplata', label: 'Поставка' }
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedFilters[item.key]}
                        onChange={() => toggleFilter('type', item.key)}
                        className="peer sr-only"
                      />
                      <div className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                        selectedFilters[item.key] 
                          ? "bg-[#17a2b8] border-[#17a2b8]" 
                          : "border-slate-300 group-hover:border-slate-400"
                      )}>
                        {selectedFilters[item.key] && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-[13px] text-slate-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Дата оплаты */}
            <div className="mb-6">
              <h3 className="text-[13px] font-medium text-slate-900 mb-3">Дата оплаты</h3>
              <div className="space-y-2.5">
                {[
                  { key: 'podtverzhdena', label: 'Подтверждена' },
                  { key: 'nePodtverzhdena', label: 'Не подтверждена' }
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={dateFilters[item.key]}
                        onChange={() => toggleFilter('date', item.key)}
                        className="peer sr-only"
                      />
                      <div className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                        dateFilters[item.key] 
                          ? "bg-[#17a2b8] border-[#17a2b8]" 
                          : "border-slate-300 group-hover:border-slate-400"
                      )}>
                        {dateFilters[item.key] && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-[13px] text-slate-700">{item.label}</span>
                  </label>
                ))}
              </div>
              
              {selectedDatePaymentRange ? (
                <div className="mt-3 relative">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span className="text-[13px] text-slate-700 flex-1">{formatDateRange(selectedDatePaymentRange)}</span>
                    <button 
                      onClick={() => setSelectedDatePaymentRange(null)}
                      className="text-slate-400 hover:text-slate-600 text-[16px]"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 relative" ref={datePickerRef}>
                  <button 
                    onClick={() => {
                      setIsDatePaymentModalOpen(!isDatePaymentModalOpen)
                      if (isDateStartModalOpen) {
                        closeDateStartModal()
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-2 w-full text-left text-[13px] text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded hover:border-slate-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      className="fixed left-[280px] bg-white rounded-lg shadow-xl border border-slate-200 z-[1000]" 
                      style={{ 
                        top: datePickerRef.current?.getBoundingClientRect().bottom + 8 + 'px',
                        width: activeInput ? '600px' : '440px',
                        animation: isClosing ? 'fadeSlideOut 0.2s ease-in' : 'fadeSlideIn 0.25s ease-out'
                      }}
                    >
                      <div className="p-4">
                        <h3 className="text-[14px] font-normal text-slate-500 mb-3">Укажите период</h3>
                        
                        <div className="flex gap-3">
                          {/* Quick Ranges */}
                          <div className="flex-1 grid grid-cols-2 gap-1.5">
                            {quickDateRanges.map((range, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  const dateRange = range.getValue()
                                  setSelectedDatePaymentRange(dateRange)
                                  closeDatePaymentModal()
                                }}
                                className="px-3 py-1.5 text-[13px] text-[#17a2b8] bg-slate-50 hover:bg-[#e8f4f6] transition-colors text-left font-normal rounded"
                              >
                                {range.label}
                              </button>
                            ))}
                          </div>

                          {/* Calendar - показывается только когда активен инпут */}
                          {activeInput && (
                            <div className="w-[240px] bg-slate-50 rounded p-2.5" style={{ animation: 'fadeSlideRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                              <div className="flex items-center justify-between mb-2">
                                <button 
                                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                  className="text-slate-600 hover:text-slate-900 text-[14px] w-5 h-5 flex items-center justify-center"
                                >
                                  «
                                </button>
                                <span className="text-[12px] font-medium text-slate-900">
                                  {currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }).replace(/^./, str => str.toUpperCase())}
                                </span>
                                <button 
                                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                  className="text-slate-600 hover:text-slate-900 text-[14px] w-5 h-5 flex items-center justify-center"
                                >
                                  »
                                </button>
                              </div>

                              <div className="grid grid-cols-7 gap-1 mb-2">
                                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                                  <div key={day} className="text-center text-[10px] text-slate-500 font-medium py-1">
                                    {day}
                                  </div>
                                ))}
                              </div>

                              <div className="grid grid-cols-7 gap-0.5">
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
                                        "aspect-square flex items-center justify-center text-[11px] rounded transition-colors",
                                        !isCurrentMonth && "text-slate-300 cursor-default",
                                        isCurrentMonth && !isToday && !isSelected && "text-slate-700 hover:bg-white cursor-pointer",
                                        isToday && !isSelected && "bg-[#ffd54f] text-slate-900 font-semibold hover:bg-[#ffca28] cursor-pointer",
                                        isSelected && "bg-[#17a2b8] text-white font-semibold cursor-pointer"
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
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => setActiveInput('start')}
                            className={cn(
                              "flex-1 flex items-center gap-2 px-3 py-2 border rounded transition-colors",
                              activeInput === 'start' ? "border-[#17a2b8] bg-[#f0f9fa]" : "border-slate-300 hover:bg-slate-50"
                            )}
                          >
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
            <span className="text-[13px] text-slate-700">
                              {tempStartDate ? tempStartDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Начало периода'}
                            </span>
                          </button>
                          <span className="text-slate-400 text-[14px]">—</span>
                          <button
                            onClick={() => setActiveInput('end')}
                            className={cn(
                              "flex-1 flex items-center gap-2 px-3 py-2 border rounded transition-colors",
                              activeInput === 'end' ? "border-[#17a2b8] bg-[#f0f9fa]" : "border-slate-300 hover:bg-slate-50"
                            )}
                          >
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span className="text-[13px] text-slate-700">
                              {tempEndDate ? tempEndDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Конец периода'}
                            </span>
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-200">
                          <button
                            onClick={() => {
                              setTempStartDate(null)
                              setTempEndDate(null)
                              closeDatePaymentModal()
                            }}
                            className="px-4 py-1.5 text-[14px] text-slate-600 hover:text-slate-800 font-normal"
                          >
                            Сбросить
                          </button>
                          <button
                            onClick={() => {
                              if (tempStartDate && tempEndDate) {
                                setSelectedDatePaymentRange({ start: tempStartDate, end: tempEndDate })
                              }
                              closeDatePaymentModal()
                            }}
                            className="px-5 py-1.5 text-[14px] bg-[#17a2b8] text-white rounded hover:bg-[#138496] font-normal"
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

            {/* Дата начисления */}
            <div className="mb-6">
              <h3 className="text-[13px] font-medium text-slate-900 mb-3">Дата начисления</h3>
              <div className="space-y-2.5">
                {[
                  { key: 'podtverzhdena', label: 'Подтверждена' },
                  { key: 'nePodtverzhdena', label: 'Не подтверждена' }
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={dateStartFilters[item.key]}
                        onChange={() => toggleFilter('dateStart', item.key)}
                        className="peer sr-only"
                      />
                      <div className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                        dateStartFilters[item.key] 
                          ? "bg-[#17a2b8] border-[#17a2b8]" 
                          : "border-slate-300 group-hover:border-slate-400"
                      )}>
                        {dateStartFilters[item.key] && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-[13px] text-slate-700">{item.label}</span>
                  </label>
                ))}
              </div>
              
              {selectedDateStartRange ? (
                <div className="mt-3 relative">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span className="text-[13px] text-slate-700 flex-1">{formatDateRange(selectedDateStartRange)}</span>
                    <button 
                      onClick={() => setSelectedDateStartRange(null)}
                      className="text-slate-400 hover:text-slate-600 text-[16px]"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 relative" ref={dateStartPickerRef}>
                  <button 
                    onClick={() => {
                      setIsDateStartModalOpen(!isDateStartModalOpen)
                      if (isDatePaymentModalOpen) {
                        closeDatePaymentModal()
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-2 w-full text-left text-[13px] text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded hover:border-slate-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      className="fixed left-[280px] bg-white rounded-lg shadow-xl border border-slate-200 z-[1000]" 
                      style={{ 
                        top: dateStartPickerRef.current?.getBoundingClientRect().bottom + 8 + 'px',
                        width: activeInput ? '600px' : '440px',
                        animation: isClosing ? 'fadeSlideOut 0.2s ease-in' : 'fadeSlideIn 0.25s ease-out'
                      }}
                    >
                      <div className="p-4">
                        <h3 className="text-[14px] font-normal text-slate-500 mb-3">Укажите период</h3>
                        
                        <div className="flex gap-3">
                          {/* Quick Ranges */}
                          <div className="flex-1 grid grid-cols-2 gap-1.5">
                            {quickDateRanges.map((range, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  const dateRange = range.getValue()
                                  setSelectedDateStartRange(dateRange)
                                  closeDateStartModal()
                                }}
                                className="px-3 py-1.5 text-[13px] text-[#17a2b8] bg-slate-50 hover:bg-[#e8f4f6] transition-colors text-left font-normal rounded"
                              >
                                {range.label}
                              </button>
                            ))}
                          </div>

                          {/* Calendar - показывается только когда активен инпут */}
                          {activeInput && (
                            <div className="w-[240px] bg-slate-50 rounded p-2.5" style={{ animation: 'fadeSlideRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                              <div className="flex items-center justify-between mb-2">
                                <button 
                                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                  className="text-slate-600 hover:text-slate-900 text-[14px] w-5 h-5 flex items-center justify-center"
                                >
                                  «
                                </button>
                                <span className="text-[12px] font-medium text-slate-900">
                                  {currentMonth.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }).replace(/^./, str => str.toUpperCase())}
                                </span>
                                <button 
                                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                  className="text-slate-600 hover:text-slate-900 text-[14px] w-5 h-5 flex items-center justify-center"
                                >
                                  »
                                </button>
                              </div>

                              <div className="grid grid-cols-7 gap-0.5 mb-1.5">
                                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                                  <div key={day} className="text-center text-[9px] text-slate-500 font-medium py-0.5">
                                    {day}
                                  </div>
                                ))}
                              </div>

                              <div className="grid grid-cols-7 gap-0.5">
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
                                        "aspect-square flex items-center justify-center text-[11px] rounded transition-colors",
                                        !isCurrentMonth && "text-slate-300 cursor-default",
                                        isCurrentMonth && !isToday && !isSelected && "text-slate-700 hover:bg-white cursor-pointer",
                                        isToday && !isSelected && "bg-[#ffd54f] text-slate-900 font-semibold hover:bg-[#ffca28] cursor-pointer",
                                        isSelected && "bg-[#17a2b8] text-white font-semibold cursor-pointer"
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
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => setActiveInput('start')}
                            className={cn(
                              "flex-1 flex items-center gap-2 px-3 py-2 border rounded transition-colors",
                              activeInput === 'start' ? "border-[#17a2b8] bg-[#f0f9fa]" : "border-slate-300 hover:bg-slate-50"
                            )}
                          >
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span className="text-[13px] text-slate-700">
                              {tempStartDate ? tempStartDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Начало периода'}
                            </span>
                          </button>
                          <span className="text-slate-400 text-[14px]">—</span>
                          <button
                            onClick={() => setActiveInput('end')}
                            className={cn(
                              "flex-1 flex items-center gap-2 px-3 py-2 border rounded transition-colors",
                              activeInput === 'end' ? "border-[#17a2b8] bg-[#f0f9fa]" : "border-slate-300 hover:bg-slate-50"
                            )}
                          >
                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span className="text-[13px] text-slate-700">
                              {tempEndDate ? tempEndDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Конец периода'}
                            </span>
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-200">
                          <button
                            onClick={() => {
                              setTempStartDate(null)
                              setTempEndDate(null)
                              closeDateStartModal()
                            }}
                            className="px-4 py-1.5 text-[14px] text-slate-600 hover:text-slate-800 font-normal"
                          >
                            Сбросить
                          </button>
                          <button
                            onClick={() => {
                              if (tempStartDate && tempEndDate) {
                                setSelectedDateStartRange({ start: tempStartDate, end: tempEndDate })
                              }
                              closeDateStartModal()
                            }}
                            className="px-5 py-1.5 text-[14px] bg-[#17a2b8] text-white rounded hover:bg-[#138496] font-normal"
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
            <div className="mb-6">
              <h3 className="text-[13px] font-medium text-slate-900 mb-3">Параметры</h3>
              <div className="space-y-2">
                {/* Юрлица и счета */}
                <div className="relative" ref={parameterDropdownRef}>
                  <button 
                    onClick={() => setOpenParameterDropdown(openParameterDropdown === 'accounts' ? null : 'accounts')}
                    className="w-full text-left text-[13px] text-slate-600 flex items-center justify-between py-2 px-3 rounded bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <span>Юрлица и счета</span>
                    <svg className={cn("w-3.5 h-3.5 text-slate-400 transition-transform", openParameterDropdown === 'accounts' && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {openParameterDropdown === 'accounts' && (
                    <div className="absolute left-0 right-0 bottom-full mb-2 bg-white rounded-lg shadow-xl border border-slate-200 z-[1000] max-h-[400px] overflow-hidden flex flex-col">
                      <div className="p-3 border-b border-slate-200">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Поиск по списку"
                            className="w-full pl-9 pr-3 py-2 text-[13px] text-slate-400 border border-slate-300 rounded-lg focus:outline-none focus:ring-0 focus:border-slate-400"
                          />
                          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="px-3 py-2 bg-white border-b border-slate-200">
                        <button 
                          onClick={selectAllAccounts}
                          className="text-[14px] text-[#17a2b8] hover:text-[#138496] font-normal"
                        >
                          Выбрать все
                        </button>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto bg-slate-50">
                        <div className="p-2">
                          {/* Parent: ИП Алексеенко */}
                          <div className="mb-1">
                            <div className="px-3 py-2 text-[14px] font-semibold text-slate-900">
                              ИП Алексеенко Михаил Федорович
                            </div>
                            <label className="flex items-center gap-3 py-2 px-3 cursor-pointer hover:bg-white rounded transition-colors group">
                              <div className="relative flex-shrink-0">
                                <input
                                  type="checkbox"
                                  checked={selectedAccounts['seif']}
                                  onChange={() => toggleAccount('seif')}
                                  className="peer sr-only"
                                />
                                <div className={cn(
                                  "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                                  selectedAccounts['seif'] 
                                    ? "bg-[#17a2b8] border-[#17a2b8]" 
                                    : "border-slate-300 bg-white group-hover:border-slate-400"
                                )}>
                                  {selectedAccounts['seif'] && (
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              <span className="text-[13px] text-slate-700">Сейф</span>
                            </label>
                          </div>

                          {/* Standalone items */}
                          <label className="flex items-center gap-3 py-2 px-3 cursor-pointer hover:bg-white rounded transition-colors group">
                            <div className="relative flex-shrink-0">
                              <input
                                type="checkbox"
                                checked={selectedAccounts['alfa']}
                                onChange={() => toggleAccount('alfa')}
                                className="peer sr-only"
                              />
                              <div className={cn(
                                "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                                selectedAccounts['alfa'] 
                                  ? "bg-[#17a2b8] border-[#17a2b8]" 
                                  : "border-slate-300 bg-white group-hover:border-slate-400"
                              )}>
                                {selectedAccounts['alfa'] && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <span className="text-[13px] text-slate-700">Альфа банк</span>
                          </label>

                          <label className="flex items-center gap-3 py-2 px-3 cursor-pointer hover:bg-white rounded transition-colors group">
                            <div className="relative flex-shrink-0">
                              <input
                                type="checkbox"
                                checked={selectedAccounts['karta']}
                                onChange={() => toggleAccount('karta')}
                                className="peer sr-only"
                              />
                              <div className={cn(
                                "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                                selectedAccounts['karta'] 
                                  ? "bg-[#17a2b8] border-[#17a2b8]" 
                                  : "border-slate-300 bg-white group-hover:border-slate-400"
                              )}>
                                {selectedAccounts['karta'] && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <span className="text-[13px] text-slate-700">Карта физ. лица</span>
                          </label>

                          {/* Parent: ООО "Прометей" */}
                          <div className="mb-1">
                            <div className="px-3 py-2 text-[14px] font-semibold text-slate-900">
                              ООО "Прометей"
                            </div>
                            <label className="flex items-center gap-3 py-2 px-6 cursor-pointer hover:bg-white rounded transition-colors group">
                              <div className="relative flex-shrink-0">
                                <input
                                  type="checkbox"
                                  checked={selectedAccounts['prometey']}
                                  onChange={() => toggleAccount('prometey')}
                                  className="peer sr-only"
                                />
                                <div className={cn(
                                  "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                                  selectedAccounts['prometey'] 
                                    ? "bg-[#17a2b8] border-[#17a2b8]" 
                                    : "border-slate-300 bg-white group-hover:border-slate-400"
                                )}>
                                  {selectedAccounts['prometey'] && (
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              <span className="text-[13px] text-slate-700">Т-Банк</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button className="w-full text-left text-[13px] text-slate-600 flex items-center justify-between py-2 px-3 rounded bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                  <span>Контрагенты</span>
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button className="w-full text-left text-[13px] text-slate-600 flex items-center justify-between py-2 px-3 rounded bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                  <span>Статьи учета</span>
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button className="w-full text-left text-[13px] text-slate-600 flex items-center justify-between py-2 px-3 rounded bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                  <span>Проекты</span>
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button className="w-full text-left text-[13px] text-slate-600 flex items-center justify-between py-2 px-3 rounded bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                  <span>Сделки</span>
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Сумма */}
            <div className="mb-6">
              <h3 className="text-[13px] font-medium text-slate-900 mb-3">Сумма от</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder=""
                  className="flex-1 px-3 py-2 text-[13px] text-slate-700 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8] focus:border-[#17a2b8]"
                />
                <span className="text-slate-400 text-[13px]">до</span>
                <input
                  type="text"
                  placeholder=""
                  className="flex-1 px-3 py-2 text-[13px] text-slate-700 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8] focus:border-[#17a2b8]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isFilterOpen && (
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="text-slate-400 hover:text-slate-600 text-[16px]"
                >
                  ☰
                </button>
              )}
              <h1 className="text-[20px] font-semibold text-slate-900">Операции</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск по операциям"
                  className="w-[280px] pl-9 pr-4 py-1.5 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8] focus:border-[#17a2b8]"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 text-[13px] border border-slate-300 rounded hover:bg-slate-50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                xls
              </button>
              <button className="text-slate-400 hover:text-slate-600 text-[20px] px-2">⋯</button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto bg-slate-50">
          {/* Selection Bar */}
          {selectedOperations.length > 0 && (
            <div className="bg-[#e3f2fd] border-b border-[#90caf9] px-6 py-2.5 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedOperations([])}
                  className="text-slate-600 hover:text-slate-800"
                >
                  ✕
                </button>
                <span className="text-[13px] text-slate-700">
                  Выбрано: <strong>{selectedOperations.length}</strong> на сумму <strong className={selectedTotal >= 0 ? 'text-green-600' : 'text-red-600'}>{selectedTotal >= 0 ? '+' : ''}{selectedTotal.toLocaleString('ru-RU')} ₽</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#17a2b8] hover:text-[#138496]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Экспорт выбранных
                </button>
              </div>
            </div>
          )}

          <table className="w-full bg-white">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr className="border-b border-slate-200">
                <th className="w-10 px-3 py-2.5">
                  <div className="w-[18px] h-[18px] rounded-sm border-2 border-slate-300 bg-white"></div>
                </th>
                <th className="px-3 py-2.5 text-left">
                  <button className="flex items-center gap-1 text-[12px] font-normal text-slate-500">
                    Дата
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </button>
                </th>
                <th className="px-3 py-2.5 text-left text-[12px] font-normal text-slate-500">Счет</th>
                <th className="px-3 py-2.5 text-left text-[12px] font-normal text-slate-500">Тип</th>
                <th className="px-3 py-2.5 text-left text-[12px] font-normal text-slate-500">Контрагент</th>
                <th className="px-3 py-2.5 text-left text-[12px] font-normal text-slate-500">Статья</th>
                <th className="px-3 py-2.5 text-left text-[12px] font-normal text-slate-500">Проект</th>
                <th className="px-3 py-2.5 text-left text-[12px] font-normal text-slate-500">Сделка</th>
                <th className="px-3 py-2.5 text-right text-[12px] font-normal text-slate-500">Сумма</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {/* Сегодня */}
              {operations.filter(op => op.section === 'today').length > 0 && (
                <>
                  {operations.filter(op => op.section === 'today').map((op) => (
                    <tr key={op.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={(e) => {
                      if (!e.target.closest('input') && !e.target.closest('button')) {
                        openOperationModal(op)
                      }
                    }}>
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            checked={selectedOperations.includes(op.id)}
                            onChange={() => toggleOperation(op.id)}
                            className="peer sr-only"
                          />
                          <div className={cn(
                            "w-[18px] h-[18px] rounded-sm border-2 flex items-center justify-center transition-all cursor-pointer",
                            selectedOperations.includes(op.id) 
                              ? "bg-[#17a2b8] border-[#17a2b8]" 
                              : "border-slate-300 bg-white hover:border-slate-400"
                          )}
                          onClick={() => toggleOperation(op.id)}
                          >
                            {selectedOperations.includes(op.id) && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col">
                          <span className="text-[13px] text-[#17a2b8] font-normal">{op.date}</span>
                          <span className="text-[11px] text-slate-400">{op.dateSecondary}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[13px] text-[#17a2b8]">{op.account}</td>
                      <td className="px-3 py-3">
                        <svg className={cn("w-5 h-5", op.type === 'in' ? 'text-green-500' : 'text-red-500')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          {op.type === 'in' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          )}
                        </svg>
                      </td>
                      <td className="px-3 py-3 text-[13px] text-slate-900">{op.counterparty}</td>
                      <td className="px-3 py-3 text-[13px] text-[#17a2b8]">{op.status}</td>
                      <td className="px-3 py-3 text-[13px] text-slate-900">{op.project}</td>
                      <td className="px-3 py-3 text-[13px] text-slate-900"></td>
                      <td className={cn(
                        "px-3 py-3 text-right text-[13px] font-normal",
                        op.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      )}>
                        {op.amount} ₽
                      </td>
                    </tr>
                  ))}
                </>
              )}

              {/* Сегодня - Section Header */}
              <tr className="bg-slate-50">
                <td colSpan="9" className="px-3 py-2">
                  <h3 className="text-[13px] font-semibold text-slate-900">Сегодня</h3>
                </td>
              </tr>

              {/* Selected Operations */}
              {operations.filter(op => op.section === 'selected' && !op.isChild).map((op) => (
                <Fragment key={op.id}>
                  <tr className={cn("border-b border-slate-100 cursor-pointer", selectedOperations.includes(op.id) && "bg-[#e3f2fd]")} onClick={(e) => {
                    if (!e.target.closest('input') && !e.target.closest('button')) {
                      openOperationModal(op)
                    }
                  }}>
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        {op.hasChildren && (
                          <button 
                            onClick={() => toggleExpand(op.id)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            {expandedRows.includes(op.id) ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </button>
                        )}
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            checked={selectedOperations.includes(op.id)}
                            onChange={() => toggleOperation(op.id)}
                            className="peer sr-only"
                          />
                          <div className={cn(
                            "w-[18px] h-[18px] rounded-sm border-2 flex items-center justify-center transition-all cursor-pointer",
                            selectedOperations.includes(op.id) 
                              ? "bg-[#17a2b8] border-[#17a2b8]" 
                              : "border-slate-300 bg-white hover:border-slate-400"
                          )}
                          onClick={() => toggleOperation(op.id)}
                          >
                            {selectedOperations.includes(op.id) && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col">
                        <span className="text-[13px] text-[#17a2b8] font-normal">{op.date}</span>
                        <span className="text-[11px] text-slate-400">{op.dateSecondary}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[13px] text-[#17a2b8]">{op.account}</td>
                    <td className="px-3 py-3">
                      {op.type === 'transfer' ? (
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <svg className={cn("w-5 h-5", op.type === 'in' ? 'text-green-500' : 'text-red-500')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          {op.type === 'in' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          )}
                        </svg>
                      )}
                    </td>
                    <td className="px-3 py-3 text-[13px] text-[#17a2b8]">{op.counterparty}</td>
                    <td className="px-3 py-3 text-[13px] text-slate-900">{op.status}</td>
                    <td className="px-3 py-3 text-[13px] text-slate-900">{op.project}</td>
                    <td className="px-3 py-3 text-[13px] text-slate-900"></td>
                    <td className={cn(
                      "px-3 py-3 text-right text-[13px] font-normal",
                      op.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    )}>
                      {op.amount} ₽
                    </td>
                  </tr>
                  
                  {/* Child rows */}
                  {expandedRows.includes(op.id) && operations.filter(child => child.parentId === op.id).map((child) => (
                    <tr key={child.id} className="bg-[#f5f5f5] border-b border-slate-100">
                      <td className="px-3 py-2"></td>
                      <td className="px-3 py-2">
                        {child.date && (
                          <div className="flex flex-col">
                            <span className="text-[13px] text-[#17a2b8] font-normal">{child.date}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-[13px] text-[#17a2b8]">{child.account}</td>
                      <td className="px-3 py-2">
                        {child.type && (
                          <svg className={cn("w-5 h-5", child.type === 'in' ? 'text-green-500' : 'text-red-500')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            {child.type === 'in' ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            )}
                          </svg>
                        )}
                      </td>
                      <td className="px-3 py-2 text-[13px] text-[#17a2b8]">{child.counterparty}</td>
                      <td className="px-3 py-2 text-[13px] text-slate-900">{child.status}</td>
                      <td className="px-3 py-2 text-[13px] text-slate-900">{child.project}</td>
                      <td className="px-3 py-2 text-[13px] text-slate-900"></td>
                      <td className="px-3 py-2 text-right text-[13px] font-normal text-slate-600">
                        {child.amount}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}

              {/* Вчера и ранее - Section Header */}
              <tr className="bg-slate-50">
                <td colSpan="9" className="px-3 py-2">
                  <h3 className="text-[13px] font-semibold text-slate-900">Вчера и ранее</h3>
                </td>
              </tr>

              {/* Yesterday Operations */}
              {operations.filter(op => op.section === 'yesterday').map((op) => (
                <tr key={op.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={(e) => {
                  if (!e.target.closest('input') && !e.target.closest('button')) {
                    openOperationModal(op)
                  }
                }}>
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={selectedOperations.includes(op.id)}
                        onChange={() => toggleOperation(op.id)}
                        className="peer sr-only"
                      />
                      <div className={cn(
                        "w-[18px] h-[18px] rounded-sm border-2 flex items-center justify-center transition-all cursor-pointer",
                        selectedOperations.includes(op.id) 
                          ? "bg-[#17a2b8] border-[#17a2b8]" 
                          : "border-slate-300 bg-white hover:border-slate-400"
                      )}
                      onClick={() => toggleOperation(op.id)}
                      >
                        {selectedOperations.includes(op.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col">
                      <span className="text-[13px] text-[#17a2b8] font-normal">{op.date}</span>
                      <span className="text-[11px] text-slate-400">{op.dateSecondary}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[13px] text-[#17a2b8]">{op.account}</td>
                  <td className="px-3 py-3">
                    <svg className={cn("w-5 h-5", op.type === 'in' ? 'text-green-500' : 'text-red-500')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      {op.type === 'in' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      )}
                    </svg>
                  </td>
                  <td className="px-3 py-3 text-[13px] text-slate-900">{op.counterparty}</td>
                  <td className="px-3 py-3 text-[13px] text-[#17a2b8]">{op.status}</td>
                  <td className="px-3 py-3 text-[13px] text-slate-900">{op.project}</td>
                  <td className="px-3 py-3 text-[13px] text-slate-900"></td>
                  <td className={cn(
                    "px-3 py-3 text-right text-[13px] font-normal",
                    op.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  )}>
                    {op.amount} ₽
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Stats */}
        <div className="bg-white border-t border-slate-200 px-6 py-2.5">
          <div className="flex items-center justify-between text-[12px] text-slate-600">
            <div className="flex items-center gap-6">
              <span><strong className="font-semibold">347</strong> операций</span>
              <span><strong className="font-semibold">44</strong> поступлений: <strong className="text-green-600 font-semibold">30 206 620 ₽</strong></span>
              <span><strong className="font-semibold">275</strong> выплат: <strong className="text-red-600 font-semibold">28 296 268 ₽</strong></span>
              <span><strong className="font-semibold">5</strong> перемещений: <strong className="font-semibold">0 ₽</strong></span>
              <span><strong className="font-semibold">16</strong> начислений: <strong className="font-semibold">0 ₽</strong></span>
            </div>
            <div className="text-[13px] font-semibold">
              Итого: <span className="text-green-600">+1 910 352 ₽</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Modal */}
      {openModal && (
        <>
          {/* Полупрозрачный фон справа от модалки */}
          <div 
            onClick={closeOperationModal}
            className={cn(
              "fixed left-[90px] top-[64px] right-0 bottom-0 z-40 cursor-pointer -mt-[9px] transition-opacity duration-300",
              isModalClosing ? "opacity-0" : "opacity-100"
            )}
            style={{ backgroundColor: 'lab(34.66 -0.95 -5.29 / 0.78)' }}
          ></div>

          {/* Modal - 80% ширины от области контента */}
          <div 
            className={cn(
              "fixed left-[90px] top-[64px] bottom-0 bg-white shadow-2xl z-50 flex pointer-events-auto -mt-[9px] transition-all duration-300 ease-out origin-left",
              isModalOpening ? "w-0 opacity-0" : isModalClosing ? "w-0 opacity-0" : "w-[80%] opacity-100"
            )}
            style={{ 
              clipPath: isModalOpening || isModalClosing ? 'inset(0 100% 0 0)' : 'inset(0 0 0 0)'
            }}
          >
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="border-b border-slate-200 px-6 py-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-[20px] font-semibold text-slate-900">Редактирование операции</h2>
                  <button 
                    onClick={closeOperationModal}
                    className="text-slate-400 hover:text-slate-600 text-[20px]"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-slate-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Создана 14 янв '26 в 00:12</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto bg-white">
                {modalType === 'income' ? (
                  // Поступление Modal
                  <div className="p-6">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                      <button className="px-4 py-2 text-[13px] text-white bg-[#28a745] rounded">Поступление</button>
                      <button className="px-4 py-2 text-[13px] text-slate-600 bg-slate-100 rounded">Выплата</button>
                      <button className="px-4 py-2 text-[13px] text-slate-600 bg-slate-100 rounded">Перемещение</button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      {/* Дата оплаты */}
                      <div className="flex items-start gap-4">
                        <label className="w-[120px] text-[13px] text-slate-900 pt-2">Дата оплаты</label>
                        <div className="flex-1 flex items-center gap-3">
                          <input 
                            type="text" 
                            value="05 апреля 2026"
                            readOnly
                            className="w-48 px-3 py-2 text-[13px] border-2 border-[#17a2b8] rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                          />
                          <button className="px-4 py-2 text-[13px] text-slate-600 border border-slate-300 rounded hover:bg-slate-50 whitespace-nowrap">
                            Подтвердить оплату
                          </button>
                        </div>
                      </div>

                      {/* Счет и юрлицо */}
                      <div className="flex items-start gap-4">
                        <label className="w-[120px] text-[13px] text-slate-900 pt-2">Счет и юрлицо</label>
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            value="Наличка [] 1 197 063 RUB"
                            readOnly
                            className="w-full px-3 py-2 pr-8 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                          />
                          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                      </div>

                      {/* Сумма */}
                      <div className="flex items-start gap-4">
                        <label className="w-[120px] text-[13px] text-slate-900 pt-2">Сумма</label>
                        <div className="flex-1 flex items-center gap-3">
                          <input 
                            type="text" 
                            value="3 200 000"
                            readOnly
                            className="w-32 px-3 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                          />
                          <span className="text-[13px] text-slate-600">RUB (Российский рубль)</span>
                        </div>
                      </div>

                      {/* Разбить сумму */}
                      <div className="flex items-center gap-4">
                        <div className="w-[120px]"></div>
                        <button className="text-[13px] text-[#17a2b8] hover:text-[#138496]">Разбить сумму</button>
                      </div>

                      {/* Добавить начисление */}
                      <div className="flex items-center gap-4">
                        <div className="w-[120px]"></div>
                        <button className="text-[13px] text-[#17a2b8] hover:text-[#138496]">Добавить начисление</button>
                      </div>

                      {/* Контрагент */}
                      <div className="flex items-start gap-4">
                        <label className="w-[120px] text-[13px] text-slate-900 pt-2">Контрагент</label>
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            value="ООО Империя"
                            readOnly
                            className="w-full px-3 py-2 pr-8 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                          />
                          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                      </div>

                      {/* Статья */}
                      <div className="flex items-start gap-4">
                        <label className="w-[120px] text-[13px] text-slate-900 pt-2">Статья</label>
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            value="Выданные займы (до 1 года)"
                            readOnly
                            className="w-full px-3 py-2 pr-8 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                          />
                          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                      </div>

                      {/* Проект */}
                      <div className="flex items-start gap-4">
                        <label className="w-[120px] text-[13px] text-slate-900 pt-2">Проект</label>
                        <select className="flex-1 px-3 py-2 text-[13px] text-slate-500 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]">
                          <option>Не выбран</option>
                        </select>
                      </div>

                      {/* Сделка продажи */}
                      <div className="flex items-start gap-4">
                        <label className="w-[120px] text-[13px] text-slate-900 pt-2 flex items-center gap-1">
                          Сделка продажи
                          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </label>
                        <select className="flex-1 px-3 py-2 text-[13px] text-slate-500 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]">
                          <option>Не выбран</option>
                        </select>
                      </div>

                      {/* Назначение платежа */}
                      <div className="flex items-start gap-4">
                        <label className="w-[120px] text-[13px] text-slate-900 pt-2">Назначение платежа</label>
                        <textarea 
                          placeholder="Назначение платежа"
                          rows="3"
                          className="flex-1 px-3 py-2 text-[13px] text-slate-500 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8] resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ) : modalType === 'payment' ? (
                  // Выплата Modal
                  <div className="p-6">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                      <button className="px-4 py-2 text-[13px] text-slate-600 bg-slate-100 rounded">Поступление</button>
                      <button className="px-4 py-2 text-[13px] text-white bg-[#dc3545] rounded">Выплата</button>
                      <button className="px-4 py-2 text-[13px] text-slate-600 bg-slate-100 rounded">Перемещение</button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                      {/* Дата оплаты */}
                      <div className="flex items-center gap-4">
                        <label className="w-[140px] text-[13px] text-slate-900">Дата оплаты</label>
                        <div className="flex-1 flex items-center gap-3">
                          <input 
                            type="text" 
                            value="19 апреля 2026"
                            readOnly
                            className="flex-1 px-3 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                          />
                          <button className="px-4 py-2 text-[13px] text-slate-600 border border-slate-300 rounded hover:bg-slate-50">
                            Подтвердить оплату
                          </button>
                        </div>
                      </div>

                      {/* Счет и юрлицо */}
                      <div className="flex items-center gap-4">
                        <label className="w-[140px] text-[13px] text-slate-900">Счет и юрлицо</label>
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            value="Сейф [] -178 226 RUB"
                            readOnly
                            className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                          />
                          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">✕</button>
                        </div>
                      </div>

                      {/* Сумма */}
                      <div className="flex items-center gap-4">
                        <label className="w-[140px] text-[13px] text-slate-900">Сумма</label>
                        <div className="flex-1 flex items-center gap-3">
                          <input 
                            type="text" 
                            value="10 425"
                            readOnly
                            className="flex-1 px-3 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                          />
                          <span className="text-[13px] text-slate-600">RUB (Российский рубль)</span>
                        </div>
                      </div>

                      {/* Изменить разбиение */}
                      <div className="flex items-center gap-4">
                        <div className="w-[140px]"></div>
                        <button className="text-[13px] text-[#17a2b8] hover:text-[#138496]">Изменить разбиение</button>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center gap-4">
                        <div className="w-[140px]"></div>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 text-[12px] bg-slate-200 text-slate-700 rounded flex items-center gap-2">
                            Начисление
                            <button className="text-slate-500 hover:text-slate-700">✕</button>
                          </span>
                          <span className="px-3 py-1 text-[12px] bg-slate-200 text-slate-700 rounded flex items-center gap-2">
                            Статьи
                            <button className="text-slate-500 hover:text-slate-700">✕</button>
                          </span>
                        </div>
                      </div>

                      {/* Table */}
                      <div className="border border-slate-200 rounded">
                        <table className="w-full">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-[11px] font-medium text-slate-600">
                                <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                  <line x1="16" y1="2" x2="16" y2="6"></line>
                                  <line x1="8" y1="2" x2="8" y2="6"></line>
                                  <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                Дата начисления
                              </th>
                              <th className="px-3 py-2 text-left text-[11px] font-medium text-slate-600">Подтвердить</th>
                              <th className="px-3 py-2 text-left text-[11px] font-medium text-slate-600">Статья</th>
                              <th className="px-3 py-2 text-left text-[11px] font-medium text-slate-600">
                                <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Сумма, RUB
                              </th>
                              <th className="px-3 py-2 text-left text-[11px] font-medium text-slate-600">
                                <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Доля
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t border-slate-200">
                              <td className="px-3 py-2 text-[13px]">
                                <svg className="w-4 h-4 inline text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                  <line x1="16" y1="2" x2="16" y2="6"></line>
                                  <line x1="8" y1="2" x2="8" y2="6"></line>
                                  <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                19 апреля 2026
                              </td>
                              <td className="px-3 py-2">
                                <input type="checkbox" readOnly className="w-4 h-4" />
                              </td>
                              <td className="px-3 py-2 text-[13px] text-[#17a2b8]">Кредит от 19.05.2...</td>
                              <td className="px-3 py-2 text-[13px]">7 500</td>
                              <td className="px-3 py-2 text-[13px]">71.94 %</td>
                            </tr>
                            <tr className="border-t border-slate-200">
                              <td className="px-3 py-2 text-[13px]">
                                <svg className="w-4 h-4 inline text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                  <line x1="16" y1="2" x2="16" y2="6"></line>
                                  <line x1="8" y1="2" x2="8" y2="6"></line>
                                  <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                08 июля 2026
                              </td>
                              <td className="px-3 py-2">
                                <input type="checkbox" readOnly className="w-4 h-4" />
                              </td>
                              <td className="px-3 py-2 text-[13px] text-[#17a2b8]">Проценты по кре...</td>
                              <td className="px-3 py-2 text-[13px]">2 925</td>
                              <td className="px-3 py-2 text-[13px]">28.06 %</td>
                            </tr>
                          </tbody>
                          <tfoot className="bg-slate-50 border-t-2 border-slate-300">
                            <tr>
                              <td colSpan="3" className="px-3 py-2 text-[13px] font-semibold">Итого: 10 425</td>
                              <td className="px-3 py-2"></td>
                              <td className="px-3 py-2 text-[13px] font-semibold">100 %</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-[140px]"></div>
                        <button className="text-[13px] text-[#17a2b8] hover:text-[#138496]">Добавить строку</button>
                      </div>

                      {/* Контрагент */}
                      <div className="flex items-center gap-4">
                        <label className="w-[140px] text-[13px] text-slate-900">Контрагент</label>
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            value="Сбербанк"
                            readOnly
                            className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                          />
                          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">✕</button>
                        </div>
                      </div>

                      {/* Проект */}
                      <div className="flex items-center gap-4">
                        <label className="w-[140px] text-[13px] text-slate-900">Проект</label>
                        <select className="flex-1 px-3 py-2 text-[13px] text-slate-500 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]">
                          <option>Не выбран</option>
                        </select>
                      </div>

                      {/* Сделка закупки */}
                      <div className="flex items-center gap-4">
                        <label className="w-[140px] text-[13px] text-slate-900">Сделка закупки</label>
                        <select className="flex-1 px-3 py-2 text-[13px] text-slate-500 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]">
                          <option>Не выбран</option>
                        </select>
                      </div>

                      {/* Сделка продажи */}
                      <div className="flex items-center gap-4">
                        <label className="w-[140px] text-[13px] text-slate-900 flex items-center gap-1">
                          Сделка продажи
                          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </label>
                        <select className="flex-1 px-3 py-2 text-[13px] text-slate-500 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]">
                          <option>Не выбран</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Начисление Modal
                  <div className="p-6">
                    {/* Tab */}
                    <div className="mb-6">
                      <button className="px-4 py-2 text-[13px] text-slate-600 bg-slate-100 rounded">Начисление</button>
                    </div>

                    {/* ОТКУДА Section */}
                    <div className="mb-6">
                      <div className="flex items-center mb-4">
                        <div className="flex-1 border-t border-slate-300"></div>
                        <span className="px-3 text-[11px] text-slate-400 uppercase">ОТКУДА</span>
                        <div className="flex-1 border-t border-slate-300"></div>
                      </div>

                      <div className="space-y-5">
                        {/* Дата начисления */}
                        <div className="flex items-center gap-4">
                          <label className="w-[140px] text-[13px] text-slate-900">Дата начисления</label>
                          <div className="flex-1 flex items-center gap-3">
                            <input 
                              type="text" 
                              value="20 апреля 2026"
                              readOnly
                              className="flex-1 px-3 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                            />
                            <button className="px-4 py-2 text-[13px] text-slate-600 border border-slate-300 rounded hover:bg-slate-50">
                              Подтвердить начисление
                            </button>
                          </div>
                        </div>

                        {/* Юрлицо */}
                        <div className="flex items-center gap-4">
                          <label className="w-[140px] text-[13px] text-slate-900">Юрлицо</label>
                          <div className="flex-1 relative">
                            <input 
                              type="text" 
                              value={'ООО "Прометей"'}
                              readOnly
                              className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">✕</button>
                          </div>
                        </div>

                        {/* Статья списания */}
                        <div className="flex items-center gap-4">
                          <label className="w-[140px] text-[13px] text-slate-900">Статья списания</label>
                          <div className="flex-1 relative">
                            <input 
                              type="text" 
                              value="Транспорт"
                              readOnly
                              className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">✕</button>
                          </div>
                        </div>

                        {/* Сумма */}
                        <div className="flex items-center gap-4">
                          <label className="w-[140px] text-[13px] text-slate-900">Сумма</label>
                          <div className="flex-1 flex items-center gap-3">
                            <input 
                              type="text" 
                              value="80 000"
                              readOnly
                              className="flex-1 px-3 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                            />
                            <span className="text-[13px] text-slate-600">RUB (Российский рубль)</span>
                          </div>
                        </div>

                        {/* Checkbox */}
                        <div className="flex items-center gap-4">
                          <div className="w-[140px]"></div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked readOnly className="w-4 h-4 rounded border-slate-300 text-[#17a2b8]" />
                            <span className="text-[13px] text-slate-700">Учитывать в ОПиУ кассовым методом</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* КУДА Section */}
                    <div className="mb-6">
                      <div className="flex items-center mb-4">
                        <div className="flex-1 border-t border-slate-300"></div>
                        <span className="px-3 text-[11px] text-slate-400 uppercase">КУДА</span>
                        <div className="flex-1 border-t border-slate-300"></div>
                      </div>

                      <div className="space-y-5">
                        {/* Статья зачисления */}
                        <div className="flex items-center gap-4">
                          <label className="w-[140px] text-[13px] text-slate-900">Статья зачисления</label>
                          <div className="flex-1 relative">
                            <input 
                              type="text" 
                              value="Амортизация"
                              readOnly
                              className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">✕</button>
                          </div>
                        </div>

                        {/* Контрагент */}
                        <div className="flex items-center gap-4">
                          <label className="w-[140px] text-[13px] text-slate-900">Контрагент</label>
                          <select className="flex-1 px-3 py-2 text-[13px] text-slate-500 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]">
                            <option>Не выбран</option>
                          </select>
                        </div>

                        {/* Проект */}
                        <div className="flex items-center gap-4">
                          <label className="w-[140px] text-[13px] text-slate-900">Проект</label>
                          <select className="flex-1 px-3 py-2 text-[13px] text-slate-500 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]">
                            <option>Не выбран</option>
                          </select>
                        </div>

                        {/* Сделка продажи */}
                        <div className="flex items-center gap-4">
                          <label className="w-[140px] text-[13px] text-slate-900 flex items-center gap-1">
                            Сделка продажи
                            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </label>
                          <select className="flex-1 px-3 py-2 text-[13px] text-slate-500 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]">
                            <option>Не выбран</option>
                          </select>
                        </div>

                        {/* Назначение */}
                        <div className="flex items-center gap-4">
                          <label className="w-[140px] text-[13px] text-slate-900">Назначение</label>
                          <input 
                            type="text" 
                            placeholder="Назначение платежа"
                            className="flex-1 px-3 py-2 text-[13px] text-slate-500 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-end bg-white">
                <button 
                  onClick={closeOperationModal}
                  className="px-5 py-2 text-[13px] text-[#17a2b8] hover:text-[#138496] font-medium"
                >
                  Отменить
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
