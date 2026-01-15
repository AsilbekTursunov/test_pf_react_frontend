"use client"

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/app/lib/utils'

export function DateRangePicker({ selectedRange, onChange, placeholder = "Выберите период" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0))
  const [activeInput, setActiveInput] = useState(null)
  const [tempStartDate, setTempStartDate] = useState(null)
  const [tempEndDate, setTempEndDate] = useState(null)
  const [isClosing, setIsClosing] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, openUpward: false })
  const pickerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        closeModal()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && pickerRef.current) {
      const rect = pickerRef.current.getBoundingClientRect()
      const dropdownHeight = 400 // примерная высота дропдауна
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow

      setDropdownPosition({
        top: openUpward ? rect.top - dropdownHeight - 8 : rect.bottom + 8,
        openUpward
      })
    }
  }, [isOpen, activeInput])

  const closeModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
      setActiveInput(null)
    }, 200)
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

  const formatDateRange = (range) => {
    if (!range) return null
    return `${range.start.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })}–${range.end.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })}`
  }

  return (
    <div className="relative" ref={pickerRef}>
      {selectedRange ? (
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span className="text-[13px] text-slate-700 flex-1">{formatDateRange(selectedRange)}</span>
          <button 
            onClick={() => onChange(null)}
            className="text-slate-400 hover:text-slate-600 text-[16px]"
          >
            ✕
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 w-full text-left text-[13px] text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded hover:border-slate-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {placeholder}
        </button>
      )}

      {isOpen && (
        <div 
          className="fixed left-[280px] bg-white rounded-lg shadow-xl border border-slate-200 z-[1000]" 
          style={{ 
            top: dropdownPosition.top + 'px',
            width: activeInput ? '600px' : '440px',
            animation: isClosing 
              ? 'fadeSlideOut 0.2s ease-in' 
              : dropdownPosition.openUpward 
                ? 'fadeSlideUp 0.25s ease-out' 
                : 'fadeSlideIn 0.25s ease-out'
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
                      onChange(dateRange)
                      closeModal()
                    }}
                    className="px-3 py-1.5 text-[13px] text-[#17a2b8] bg-slate-50 hover:bg-[#e8f4f6] transition-colors text-left font-normal rounded"
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {/* Calendar */}
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
                  closeModal()
                }}
                className="px-4 py-1.5 text-[14px] text-slate-600 hover:text-slate-800 font-normal"
              >
                Сбросить
              </button>
              <button
                onClick={() => {
                  if (tempStartDate && tempEndDate) {
                    onChange({ start: tempStartDate, end: tempEndDate })
                  }
                  closeModal()
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
  )
}
