"use client"

import { useState } from 'react'
import { cn } from '@/app/lib/utils'

export default function LegalEntitiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])

  const entities = [
    { id: 1, shortName: 'ИП Алексеенко Михаил Федорович', fullName: 'Ремонты квартир', inn: '772345678901', kpp: '-' },
    { id: 2, shortName: 'ООО "Прометей"', fullName: 'Прометей', inn: '7723456792', kpp: '772301001' }
  ]

  const isRowSelected = (id) => selectedRows.includes(id)
  
  const toggleRowSelection = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(prev => prev.filter(rid => rid !== id))
    } else {
      setSelectedRows(prev => [...prev, id])
    }
  }

  const allSelected = selectedRows.length === entities.length && entities.length > 0

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([])
    } else {
      setSelectedRows(entities.map(e => e.id))
    }
  }

  const filteredData = entities.filter(item => 
    item.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.inn.includes(searchQuery)
  )

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-[20px] font-semibold text-slate-900">Мои юрлица</h1>
            
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

        {/* Table */}
        <div className="flex-1 overflow-auto bg-slate-50">
          <div className="bg-white mx-6 mt-6 mb-0 rounded-t border border-slate-200">
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
                  <th className="text-left px-4 py-3 text-[13px] font-normal text-slate-500">
                    <button className="flex items-center gap-1 hover:text-slate-700">
                      Краткое название
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-[13px] font-normal text-slate-500">Полное название</th>
                  <th className="text-left px-4 py-3 text-[13px] font-normal text-slate-500">ИНН</th>
                  <th className="text-left px-4 py-3 text-[13px] font-normal text-slate-500">КПП</th>
                </tr>
              </thead>
              )}
              
              {selectedRows.length > 0 && (
                <thead className="bg-[#17a2b8] border-b border-[#17a2b8]">
                  <tr>
                    <th colSpan={5} className="px-4 py-3">
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
                {filteredData.map((entity) => (
                  <tr key={entity.id} className="border-b border-slate-100 hover:bg-slate-50/50">
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
                    <td className="px-4 py-4 text-[14px] text-slate-900">{entity.shortName}</td>
                    <td className="px-4 py-4 text-[14px] text-slate-600">{entity.fullName}</td>
                    <td className="px-4 py-4 text-[14px] text-slate-600">{entity.inn}</td>
                    <td className="px-4 py-4 text-[14px] text-slate-600">{entity.kpp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center flex-shrink-0">
          <div className="text-[14px] text-slate-900">
            <span className="font-medium">{entities.length} юрлица</span>
          </div>
        </div>
      </div>
    </div>
  )
}
