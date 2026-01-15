"use client"

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/app/lib/utils'
import ProductModal from '@/components/spravochniki/ProductModal'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false)
  const [groupBy, setGroupBy] = useState('По группам')
  const [expandedGroups, setExpandedGroups] = useState(['Товары без группы'])
  const [closingGroups, setClosingGroups] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('product')
  const createDropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (createDropdownRef.current && !createDropdownRef.current.contains(event.target)) {
        setIsCreateDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleGroup = (groupName) => {
    if (expandedGroups.includes(groupName)) {
      setClosingGroups(prev => [...prev, groupName])
      setTimeout(() => {
        setExpandedGroups(prev => prev.filter(g => g !== groupName))
        setClosingGroups(prev => prev.filter(g => g !== groupName))
      }, 300)
    } else {
      setExpandedGroups(prev => [...prev, groupName])
    }
  }

  const isGroupExpanded = (groupName) => expandedGroups.includes(groupName)

  const products = [
    { id: 1, name: 'Кафельная плитка', article: 'KF-001', pricePerUnit: '990 ₽', unit: 'м 2', nds: '—', priceWithNds: '990 ₽', comment: '' },
    { id: 2, name: 'Ламинат', article: 'LM-001', pricePerUnit: '585 ₽', unit: 'шт', nds: '—', priceWithNds: '585 ₽', comment: '' },
    { id: 3, name: 'Обои', article: 'OB-001', pricePerUnit: '10 000 ₽', unit: 'м 2', nds: '—', priceWithNds: '10 000 ₽', comment: '' },
    { id: 4, name: 'Проводка', article: 'PR-001', pricePerUnit: '10 000 ₽', unit: 'м 2', nds: '—', priceWithNds: '10 000 ₽', comment: '' },
    { id: 5, name: 'Строительные материалы', article: 'SM-001', pricePerUnit: '0 ₽', unit: 'шт', nds: '—', priceWithNds: '0 ₽', comment: '' },
    { id: 6, name: 'Укладка ламината', article: 'UL-001', pricePerUnit: '1 000 ₽', unit: 'м 2', nds: '—', priceWithNds: '1 000 ₽', comment: '' },
    { id: 7, name: 'Штукатурка стен', article: 'SH-001', pricePerUnit: '5 000 ₽', unit: 'м 2', nds: '—', priceWithNds: '5 000 ₽', comment: '' }
  ]

  const groupedProducts = {
    'Товары без группы': products
  }

  const isRowSelected = (id) => selectedRows.includes(id)
  
  const toggleRowSelection = (id) => {
    // Check if this is a group selection
    if (typeof id === 'string' && id.startsWith('group-')) {
      const groupName = id.replace('group-', '')
      const groupItems = groupedProducts[groupName]
      const groupItemIds = groupItems.map(item => item.id)
      
      // Check if all items in group are selected
      const allGroupItemsSelected = groupItemIds.every(itemId => selectedRows.includes(itemId))
      
      if (allGroupItemsSelected) {
        // Unselect all items in group
        setSelectedRows(prev => prev.filter(rid => !groupItemIds.includes(rid)))
      } else {
        // Select all items in group
        setSelectedRows(prev => [...new Set([...prev, ...groupItemIds])])
      }
    } else {
      // Individual item selection
      if (selectedRows.includes(id)) {
        setSelectedRows(prev => prev.filter(rid => rid !== id))
      } else {
        setSelectedRows(prev => [...prev, id])
      }
    }
  }

  const isGroupSelected = (groupName) => {
    const groupItems = groupedProducts[groupName]
    if (!groupItems || groupItems.length === 0) return false
    return groupItems.every(item => selectedRows.includes(item.id))
  }

  const allSelected = selectedRows.length === products.length && products.length > 0

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([])
    } else {
      setSelectedRows(products.map(p => p.id))
    }
  }

  const filteredData = products.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.article.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-semibold text-slate-900">Товары</h1>
              
              {/* Create Button with Dropdown */}
              <div className="relative" ref={createDropdownRef}>
                <button
                  onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                  className="flex items-center gap-2 px-6 py-2 bg-[#17a2b8] text-white text-[14px] rounded hover:bg-[#138496] transition-colors"
                >
                  Создать
                  <svg 
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      isCreateDropdownOpen && "rotate-180"
                    )}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isCreateDropdownOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-[280px] bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden"
                    style={{ animation: 'fadeSlideIn 0.15s ease-out' }}
                  >
                    <button
                      onClick={() => {
                        setIsCreateDropdownOpen(false)
                        setModalType('product')
                        setIsModalOpen(true)
                      }}
                      className="w-full text-left px-4 py-3 text-[14px] text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Создать товар
                    </button>
                    <button
                      onClick={() => {
                        setIsCreateDropdownOpen(false)
                        setModalType('group')
                        setIsModalOpen(true)
                      }}
                      className="w-full text-left px-4 py-3 text-[14px] text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                    >
                      Создать группу
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Group By Dropdown */}
              <select 
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="px-3 py-2 text-[13px] text-slate-700 bg-white border border-slate-300 rounded hover:border-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
              >
                <option>По группам</option>
                <option>Без группировки</option>
              </select>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по товарам"
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

        {/* Table */}
        <div className="flex-1 bg-slate-50">
          <div className="bg-white m-6 rounded border border-slate-200">
            <table className="w-full">
              {!selectedRows.length && (
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <div 
                        onClick={toggleSelectAll}
                        className="w-[18px] h-[18px] border-2 border-slate-400 rounded-sm flex items-center justify-center cursor-pointer transition-colors bg-white hover:border-slate-500"
                        style={{
                          backgroundColor: allSelected ? '#17a2b8' : 'white',
                          borderColor: allSelected ? '#17a2b8' : '#94a3b8'
                        }}
                      >
                        {allSelected && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="w-10 px-2 py-3"></th>
                    <th className="text-left px-4 py-3 text-[13px] font-normal text-slate-500">
                      <button className="flex items-center gap-1 hover:text-slate-700">
                        Наименование
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 text-[13px] font-normal text-slate-500">Артикул</th>
                    <th className="text-left px-4 py-3 text-[13px] font-normal text-slate-500">Цена за ед.</th>
                    <th className="text-left px-4 py-3 text-[13px] font-normal text-slate-500">Единица</th>
                    <th className="text-left px-4 py-3 text-[13px] font-normal text-slate-500">НДС</th>
                    <th className="text-left px-4 py-3 text-[13px] font-normal text-slate-500">Цена с НДС</th>
                    <th className="text-left px-4 py-3 text-[13px] font-normal text-slate-500">Комментарий</th>
                  </tr>
                </thead>
              )}
              
              {selectedRows.length > 0 && (
                <thead className="bg-[#17a2b8] border-b border-[#17a2b8]">
                  <tr>
                    <th colSpan={9} className="px-4 py-3">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          <div 
                            onClick={toggleSelectAll}
                            className="w-[18px] h-[18px] border-2 border-white rounded-sm flex items-center justify-center cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-[14px]">Выбран: {selectedRows.length}</span>
                        </div>
                        <button 
                          onClick={() => setSelectedRows([])}
                          className="text-[14px] hover:text-slate-200 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
              )}

              <tbody>
                {Object.entries(groupedProducts).map(([groupName, items]) => (
                  <React.Fragment key={groupName}>
                    {/* Group Header */}
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <td className="px-4 py-4" style={{ width: '55px' }}>
                        <div 
                          onClick={() => toggleRowSelection(`group-${groupName}`)}
                          className="w-[18px] h-[18px] border-2 rounded-sm flex items-center justify-center cursor-pointer transition-colors hover:border-slate-500"
                          style={{
                            backgroundColor: isGroupSelected(groupName) ? '#17a2b8' : 'white',
                            borderColor: isGroupSelected(groupName) ? '#17a2b8' : '#94a3b8'
                          }}
                        >
                          {isGroupSelected(groupName) && (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-4 relative" style={{ width: '40px' }}>
                        <button
                          onClick={() => toggleGroup(groupName)}
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
                                isGroupExpanded(groupName) ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
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
                      <td colSpan={7} className="py-4 text-[14px] font-medium text-slate-700">
                        {groupName} ({items.length})
                      </td>
                    </tr>
                    
                    {/* Group Items with Animation */}
                    {(isGroupExpanded(groupName) || closingGroups.includes(groupName)) && (
                      <tr>
                        <td colSpan={9} className="p-0">
                          <div 
                            className="grid overflow-hidden"
                            style={{
                              animation: closingGroups.includes(groupName)
                                ? 'collapseUp 0.3s ease-in-out'
                                : 'expandDown 0.3s ease-out'
                            }}
                          >
                            <div className="min-h-0">
                              <table className="w-full">
                                <tbody>
                                  {items.map((product, index) => (
                                    <tr 
                                      key={product.id} 
                                      className="border-b border-slate-100 hover:bg-slate-50/50"
                                      style={{
                                        animation: closingGroups.includes(groupName)
                                          ? `fadeSlideOut 0.15s ease-in ${index * 0.02}s backwards`
                                          : `fadeSlideUp 0.2s ease-out ${index * 0.04}s backwards`
                                      }}
                                    >
                                      <td className="w-12 px-4 py-4">
                                        <div 
                                          onClick={() => toggleRowSelection(product.id)}
                                          className="w-[18px] h-[18px] border-2 rounded-sm flex items-center justify-center cursor-pointer transition-colors hover:border-slate-500"
                                          style={{
                                            backgroundColor: isRowSelected(product.id) ? '#17a2b8' : 'white',
                                            borderColor: isRowSelected(product.id) ? '#17a2b8' : '#94a3b8'
                                          }}
                                        >
                                          {isRowSelected(product.id) && (
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                          )}
                                        </div>
                                      </td>
                                      <td className="w-10 px-2 py-4 relative">
                                        {/* Vertical dashed line */}
                                        <div 
                                          className="absolute left-1/2 -translate-x-1/2 w-[1px]"
                                          style={{ 
                                            top: '0',
                                            height: index === items.length - 1 ? '50%' : '100%',
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
                                      <td className="px-4 py-4 text-[14px] text-slate-900">{product.name}</td>
                                      <td className="px-4 py-4 text-[14px] text-slate-600">{product.article}</td>
                                      <td className="px-4 py-4 text-[14px] text-slate-600">{product.pricePerUnit}</td>
                                      <td className="px-4 py-4 text-[14px] text-slate-600">{product.unit}</td>
                                      <td className="px-4 py-4 text-[14px] text-slate-600">{product.nds}</td>
                                      <td className="px-4 py-4 text-[14px] text-slate-600">{product.priceWithNds}</td>
                                      <td className="px-4 py-4 text-[14px] text-slate-600">{product.comment}</td>
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

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center flex-shrink-0">
          <div className="text-[14px] text-slate-900">
            <span className="font-medium">{products.length} товаров</span>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        type={modalType}
      />
    </div>
  )
}
