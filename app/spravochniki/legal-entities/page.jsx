"use client"

import { useState } from 'react'
import { SearchBar } from '@/components/spravochniki/SearchBar'
import { DataTable } from '@/components/spravochniki/DataTable'

export default function LegalEntitiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])

  const entities = [
    { id: 1, name: 'ИП Иванов Иван Иванович', inn: '772345678901', kpp: '-', address: 'г. Москва, ул. Ленина, д. 15' },
    { id: 2, name: 'ООО "Прометей"', inn: '7723456792', kpp: '772301001', address: 'г. Москва, ул. Тверская, д. 10' }
  ]

  const columns = [
    { key: 'name', label: 'Название', sortable: true },
    { key: 'inn', label: 'ИНН', sortable: false },
    { key: 'kpp', label: 'КПП', sortable: false },
    { key: 'address', label: 'Адрес', sortable: false }
  ]

  const filteredData = entities.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.inn.includes(searchQuery)
  )

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[20px] font-semibold text-slate-900">Мои юрлица</h1>
            <button className="px-4 py-2 bg-[#17a2b8] text-white text-[14px] rounded hover:bg-[#138496] transition-colors">
              + Добавить
            </button>
          </div>
          
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Поиск по названию или ИНН..." 
          />
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
