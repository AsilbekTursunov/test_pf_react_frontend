"use client"

import React, { useState, useRef, useEffect } from 'react'
import { FilterSidebar, FilterSection, FilterCheckbox } from '@/components/spravochniki/FilterSidebar'
import { SearchBar } from '@/components/spravochniki/SearchBar'
import { DataTable } from '@/components/spravochniki/DataTable'
import { DropdownFilter } from '@/components/spravochniki/DropdownFilter'
import { cn } from '@/app/lib/utils'

export default function AccountsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
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

  const accounts = [
    { 
      id: 1, 
      name: 'ИП Алексеенко Михаил Федорович ...', 
      type: 'entity',
      group: null,
      initialBalance: '0 ₽',
      currentBalance: '862 668 ₽',
      accountType: '',
      children: [
        { id: 11, name: 'Альфа банк', group: '–', initialBalance: '0 ₽', currentBalance: '930 894 ₽', accountType: 'Безналичный' },
        { id: 12, name: 'Карта физ. лица', group: '–', initialBalance: '0 ₽', currentBalance: '110 000 ₽', accountType: 'Наличный' },
        { id: 13, name: 'Сейф', group: '–', initialBalance: '0 ₽', currentBalance: '-178 226 ₽', accountType: 'Безналичный' }
      ]
    },
    { 
      id: 2, 
      name: 'ООО "Прометей" (3)', 
      type: 'entity',
      group: null,
      initialBalance: '0 ₽',
      currentBalance: '1 912 384 ₽',
      accountType: '',
      children: [
        { id: 21, name: 'Наличка', group: '–', initialBalance: '0 ₽', currentBalance: '1 197 063 ₽', accountType: 'Безналичный' },
        { id: 22, name: 'Сбер', group: '–', initialBalance: '0 ₽', currentBalance: '450 067 ₽', accountType: 'Безналичный' },
        { id: 23, name: 'Т-Банк', group: '–', initialBalance: '0 ₽', currentBalance: '265 254 ₽', accountType: 'Безналичный' }
      ]
    }
  ]

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
    const balance = parseFloat(entity.currentBalance.replace(/[^\d.-]/g, ''))
    return sum + balance
  }, 0)

  return (
    <div className="flex min-h-screen bg-slate-50">
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

      <div className="flex-1 flex flex-col min-h-screen">
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-[20px] font-semibold text-slate-900">Мои счета</h1>
            
            <div className="flex items-center gap-3">
              {/* Accounting Method Dropdown */}
              <div className="relative" ref={methodDropdownRef}>
                <button
                  onClick={() => setIsMethodDropdownOpen(!isMethodDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-[13px] text-slate-700 bg-white border border-slate-300 rounded hover:border-slate-400 transition-colors"
                >
                  <span>{accountingMethods.find(m => m.value === accountingMethod)?.label}</span>
                  <svg 
                    className={cn(
                      "w-4 h-4 text-slate-400 transition-transform duration-200",
                      isMethodDropdownOpen && "rotate-180"
                    )}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isMethodDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-1 w-[200px] bg-white border border-slate-200 rounded shadow-lg z-50 overflow-hidden"
                    style={{ 
                      animation: 'fadeSlideIn 0.15s ease-out'
                    }}
                  >
                    <div className="py-1">
                      {accountingMethods.map((method) => (
                        <button
                          key={method.value}
                          onClick={() => {
                            setAccountingMethod(method.value)
                            setIsMethodDropdownOpen(false)
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 text-[13px] transition-colors",
                            accountingMethod === method.value
                              ? "bg-[#17a2b8] text-white"
                              : "text-slate-700 hover:bg-slate-50"
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
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по названию"
                  className="w-[240px] pl-9 pr-4 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-50">
          <div className="bg-white m-6 rounded border border-slate-200">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <div 
                      onClick={toggleSelectAll}
                      className="w-[18px] h-[18px] border-2 border-slate-400 rounded-sm flex items-center justify-center cursor-pointer transition-colors bg-white hover:border-slate-500"
                      style={{
                        backgroundColor: allSelected() ? '#17a2b8' : 'white',
                        borderColor: allSelected() ? '#17a2b8' : '#94a3b8'
                      }}
                    >
                      {allSelected() && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className="w-10 px-2 py-3">
                    <button
                      onClick={toggleAllEntities}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <div className="w-4 h-4 flex items-center justify-center relative">
                        {/* Horizontal line (always visible) */}
                        <svg className="w-4 h-4 absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                        {/* Vertical line (rotates and fades) */}
                        <svg 
                          className={cn(
                            "w-4 h-4 absolute transition-all duration-300 ease-in-out",
                            allEntitiesExpanded ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
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
                  <th className="text-left px-4 py-3 text-[13px] font-normal text-slate-500">
                    <button className="flex items-center gap-1 hover:text-slate-700">
                      Название юрлица
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-[13px] font-normal text-slate-500">Группа</th>
                  <th className="text-right px-4 py-3 text-[13px] font-normal text-slate-500">Начальный остаток</th>
                  <th className="text-right px-4 py-3 text-[13px] font-normal text-slate-500">Текущий остаток</th>
                  <th className="text-left px-4 py-3 text-[13px] font-normal text-slate-500">Тип</th>
                  <th className="text-left px-4 py-3 text-[13px] font-normal text-slate-500">Реквизиты</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((entity) => (
                  <React.Fragment key={entity.id}>
                    {/* Entity Row */}
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <td className="px-4 py-4">
                        <div 
                          onClick={() => toggleRowSelection(entity.id)}
                          className="w-[18px] h-[18px] border-2 rounded-sm flex items-center justify-center cursor-pointer transition-colors hover:border-slate-500"
                          style={{
                            backgroundColor: isRowSelected(entity.id) ? '#17a2b8' : 'white',
                            borderColor: isRowSelected(entity.id) ? '#17a2b8' : '#94a3b8'
                          }}
                        >
                          {isRowSelected(entity.id) && (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-4 relative">
                        <button
                          onClick={() => toggleEntity(entity.id)}
                          className="text-slate-400 hover:text-slate-600 transition-colors relative z-10"
                        >
                          <div className="w-4 h-4 flex items-center justify-center relative">
                            {/* Horizontal line (always visible) */}
                            <svg className="w-4 h-4 absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                            {/* Vertical line (rotates and fades) */}
                            <svg 
                              className={cn(
                                "w-4 h-4 absolute transition-all duration-300 ease-in-out",
                                isEntityExpanded(entity.id) ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
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
                      </td>
                      <td className="px-4 py-4 text-[14px] font-normal text-slate-900">{entity.name}</td>
                      <td className="px-4 py-4 text-[14px] text-slate-500 text-center">{entity.group || '–'}</td>
                      <td className="px-4 py-4 text-[14px] text-slate-600 text-right">{entity.initialBalance}</td>
                      <td className="px-4 py-4 text-[14px] font-medium text-slate-900 text-right">{entity.currentBalance}</td>
                      <td className="px-4 py-4 text-[14px] text-slate-600">{entity.accountType}</td>
                      <td className="px-4 py-4 text-[14px] text-slate-600"></td>
                    </tr>

                    {/* Children Rows Wrapper */}
                    {(isEntityExpanded(entity.id) || closingEntities.includes(entity.id)) && entity.children && (
                      <tr>
                        <td colSpan={8} className="p-0">
                          <div 
                            className="grid overflow-hidden"
                            style={{
                              animation: closingEntities.includes(entity.id)
                                ? 'collapseUp 0.3s ease-in-out'
                                : 'expandDown 0.3s ease-out'
                            }}
                          >
                            <div className="min-h-0">
                              <table className="w-full">
                                <tbody>
                                  {entity.children.map((child, childIndex) => (
                                    <tr 
                                      key={child.id} 
                                      className="border-b border-slate-100 hover:bg-slate-50/50 bg-white"
                                      style={{
                                        animation: !closingEntities.includes(entity.id)
                                          ? `fadeSlideUp 0.2s ease-out ${childIndex * 0.04}s backwards`
                                          : undefined
                                      }}
                                    >
                                      <td className="w-12 px-4 py-4 relative">
                                        <div 
                                          onClick={() => toggleRowSelection(child.id)}
                                          className="w-[18px] h-[18px] border-2 rounded-sm flex items-center justify-center cursor-pointer transition-colors hover:border-slate-500 relative z-10"
                                          style={{
                                            backgroundColor: isRowSelected(child.id) ? '#17a2b8' : 'white',
                                            borderColor: isRowSelected(child.id) ? '#17a2b8' : '#94a3b8'
                                          }}
                                        >
                                          {isRowSelected(child.id) && (
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                          )}
                                        </div>
                                      </td>
                                      <td className="w-10 px-2 py-4 relative">
                                        {/* Vertical dashed line continues from parent */}
                                        <div 
                                          className="absolute left-1/2 -translate-x-1/2 w-[1px]"
                                          style={{ 
                                            top: '0',
                                            height: childIndex === entity.children.length - 1 ? '50%' : '100%',
                                            backgroundImage: 'repeating-linear-gradient(to bottom, #cbd5e1 0, #cbd5e1 4px, transparent 4px, transparent 8px)'
                                          }}
                                        ></div>
                                        {/* Horizontal dashed line */}
                                        <div 
                                          className="absolute top-1/2 h-[1px]"
                                          style={{ 
                                            left: '50%',
                                            width: 'calc(50% + 8px)',
                                            backgroundImage: 'repeating-linear-gradient(to right, #cbd5e1 0, #cbd5e1 4px, transparent 4px, transparent 8px)'
                                          }}
                                        ></div>
                                      </td>
                                      <td className="px-4 py-4 text-[14px] text-slate-900">{child.name}</td>
                                      <td className="px-4 py-4 text-[14px] text-slate-500 text-center">{child.group}</td>
                                      <td className="px-4 py-4 text-[14px] text-slate-600 text-right">{child.initialBalance}</td>
                                      <td className={cn(
                                        "px-4 py-4 text-[14px] text-right",
                                        child.currentBalance.includes('-') ? "text-red-500 font-normal" : "text-slate-600 font-normal"
                                      )}>{child.currentBalance}</td>
                                      <td className="px-4 py-4 text-[14px] text-slate-600">{child.accountType}</td>
                                      <td className="px-4 py-4 text-[14px] text-slate-600"></td>
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
        <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center gap-8 flex-shrink-0">
          <div className="text-[14px] text-slate-900">
            <span className="font-medium">6 счетов</span>
          </div>
          <div className="text-[14px] text-slate-600">
            Текущий остаток: <span className="font-semibold text-slate-900">2 775 052 ₽</span>
          </div>
        </div>
      </div>
    </div>
  )
}
