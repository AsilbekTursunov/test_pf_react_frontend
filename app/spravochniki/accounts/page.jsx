"use client"

import { useState } from 'react'
import { FilterSidebar, FilterSection, FilterCheckbox } from '@/components/spravochniki/FilterSidebar'
import { SearchBar } from '@/components/spravochniki/SearchBar'
import { DataTable } from '@/components/spravochniki/DataTable'

export default function AccountsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  
  const [filters, setFilters] = useState({
    nalichnye: true,
    beznalichnye: true,
    kreditnye: false
  })

  const toggleFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const accounts = [
    { id: 1, name: 'Сейф', type: 'Наличные', currency: 'RUB', balance: '198 620', entity: 'ИП Иванов' },
    { id: 2, name: 'Наличка', type: 'Наличные', currency: 'RUB', balance: '16 000', entity: 'ИП Иванов' },
    { id: 3, name: 'Альфа банк', type: 'Безналичные', currency: 'RUB', balance: '63 389', entity: 'ООО Прометей' },
    { id: 4, name: 'Сбер', type: 'Безналичные', currency: 'RUB', balance: '80 000', entity: 'ИП Иванов' },
    { id: 5, name: 'Т-Банк', type: 'Безналичные', currency: 'RUB', balance: '152 000', entity: 'ООО Прометей' },
    { id: 6, name: 'Карта', type: 'Безналичные', currency: 'RUB', balance: '25 430', entity: 'ИП Иванов' }
  ]

  const columns = [
    { key: 'name', label: 'Название', sortable: true },
    { key: 'type', label: 'Тип', sortable: true },
    { key: 'currency', label: 'Валюта', sortable: false },
    { key: 'entity', label: 'Юрлицо', sortable: true },
    { 
      key: 'balance', 
      label: 'Баланс', 
      sortable: true,
      render: (value) => <span className="text-slate-900 font-medium">{value}</span>
    }
  ]

  const filteredData = accounts.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-slate-50">
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <FilterSection title="Тип счета">
          <div className="space-y-2.5">
            <FilterCheckbox 
              checked={filters.nalichnye} 
              onChange={() => toggleFilter('nalichnye')} 
              label="Наличные" 
            />
            <FilterCheckbox 
              checked={filters.beznalichnye} 
              onChange={() => toggleFilter('beznalichnye')} 
              label="Безналичные" 
            />
            <FilterCheckbox 
              checked={filters.kreditnye} 
              onChange={() => toggleFilter('kreditnye')} 
              label="Кредитные" 
            />
          </div>
        </FilterSection>
      </FilterSidebar>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[20px] font-semibold text-slate-900">Мои счета</h1>
            <button className="px-4 py-2 bg-[#17a2b8] text-white text-[14px] rounded hover:bg-[#138496] transition-colors">
              + Добавить
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {!isFilterOpen && (
              <button
                onClick={() => setIsFilterOpen(true)}
                className="px-3 py-2 text-[13px] text-slate-600 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                Фильтры
              </button>
            )}
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Поиск по названию..." 
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <DataTable 
            columns={columns}
            data={filteredData}
            selectedRows={selectedRows}
            onSelectRow={setSelectedRows}
          />
        </div>
      </div>
    </div>
  )
}
