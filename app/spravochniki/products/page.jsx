"use client"

import { useState } from 'react'
import { FilterSidebar, FilterSection, FilterCheckbox } from '@/components/spravochniki/FilterSidebar'
import { SearchBar } from '@/components/spravochniki/SearchBar'
import { DataTable } from '@/components/spravochniki/DataTable'

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  
  const [filters, setFilters] = useState({
    vNalichii: true,
    netVNalichii: false,
    archived: false
  })

  const toggleFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const products = [
    { id: 1, name: 'Кирпич красный', article: 'KR-001', group: 'Стройматериалы', price: '15.50', unit: 'шт', stock: '1500' },
    { id: 2, name: 'Цемент М500', article: 'CM-500', group: 'Стройматериалы', price: '350.00', unit: 'мешок', stock: '80' },
    { id: 3, name: 'Песок речной', article: 'PS-001', group: 'Стройматериалы', price: '800.00', unit: 'м³', stock: '25' },
    { id: 4, name: 'Гипсокартон 12мм', article: 'GK-012', group: 'Отделочные материалы', price: '280.00', unit: 'лист', stock: '120' },
    { id: 5, name: 'Краска белая', article: 'KR-W01', group: 'Отделочные материалы', price: '450.00', unit: 'л', stock: '45' },
    { id: 6, name: 'Профиль металлический', article: 'PR-M01', group: 'Металлоконструкции', price: '120.00', unit: 'м', stock: '200' }
  ]

  const columns = [
    { key: 'name', label: 'Название', sortable: true },
    { key: 'article', label: 'Артикул', sortable: true },
    { key: 'group', label: 'Группа', sortable: true },
    { key: 'price', label: 'Цена', sortable: true, render: (value) => `${value} ₽` },
    { key: 'unit', label: 'Ед. изм.', sortable: false },
    { key: 'stock', label: 'Остаток', sortable: true }
  ]

  const filteredData = products.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.article.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-slate-50">
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <FilterSection title="Наличие">
          <div className="space-y-2.5">
            <FilterCheckbox 
              checked={filters.vNalichii} 
              onChange={() => toggleFilter('vNalichii')} 
              label="В наличии" 
            />
            <FilterCheckbox 
              checked={filters.netVNalichii} 
              onChange={() => toggleFilter('netVNalichii')} 
              label="Нет в наличии" 
            />
            <FilterCheckbox 
              checked={filters.archived} 
              onChange={() => toggleFilter('archived')} 
              label="Архивные" 
            />
          </div>
        </FilterSection>
      </FilterSidebar>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[20px] font-semibold text-slate-900">Товары</h1>
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
              placeholder="Поиск по названию или артикулу..." 
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
