"use client"

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/app/lib/utils'

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
  loading = false
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

  // Get selected item label
  const selectedItem = data.find(item => item[valueKey] === value)
  const selectedLabel = selectedItem ? selectedItem[labelKey] : placeholder

  const handleSelect = (item) => {
    onChange(item[valueKey], item)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={cn(
          "w-full px-3 py-2 text-[13px] text-left border rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8] transition-colors",
          disabled || loading ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white text-slate-900 hover:bg-slate-50",
          !value && "text-slate-500",
          "border-slate-300"
        )}
      >
        <div className="flex items-center justify-between">
          <span className="truncate">{loading ? "Загрузка..." : selectedLabel}</span>
          <svg 
            className={cn("w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ml-2", isOpen && "rotate-180")} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-[300px] overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-slate-200">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск..."
              className="w-full px-3 py-1.5 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
              autoFocus
            />
          </div>

          {/* Options list */}
          <div className="overflow-y-auto max-h-[240px]">
            {Object.keys(groupedData).length === 0 ? (
              <div className="px-3 py-2 text-[13px] text-slate-500 text-center">
                Ничего не найдено
              </div>
            ) : (
              Object.entries(groupedData).map(([groupName, items]) => (
                <div key={groupName}>
                  {groupBy && (
                    <div className="px-3 py-1.5 text-[11px] font-medium text-slate-500 bg-slate-50 sticky top-0">
                      {groupName}
                    </div>
                  )}
                  {items.map((item) => (
                    <button
                      key={item[valueKey]}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className={cn(
                        "w-full px-3 py-2 text-[13px] text-left hover:bg-slate-50 transition-colors",
                        value === item[valueKey] ? "bg-[#17a2b8]/10 text-[#17a2b8]" : "text-slate-900"
                      )}
                    >
                      {item[labelKey]}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
