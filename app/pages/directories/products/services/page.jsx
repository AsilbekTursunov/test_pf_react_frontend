"use client"

import { useState } from 'react'
import { FilterSidebar, FilterSection, FilterCheckbox } from '@/components/directories/FilterSidebar/FilterSidebar'
import { SearchBar } from '@/components/directories/SearchBar/SearchBar'
import { DataTable } from '@/components/directories/DataTable/DataTable'
import styles from './services.module.scss'

export default function ServicesPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  
  const [filters, setFilters] = useState({
    active: true,
    archived: false
  })

  const toggleFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const services = [
    { id: 1, name: 'Услуги ремонта', article: 'SRV-001', group: 'Ремонтные работы', price: '2500.00', unit: 'час' },
    { id: 2, name: 'Консультация специалиста', article: 'SRV-002', group: 'Консультации', price: '3000.00', unit: 'час' },
    { id: 3, name: 'Монтаж конструкций', article: 'SRV-003', group: 'Монтажные работы', price: '1800.00', unit: 'час' },
    { id: 4, name: 'Проектирование', article: 'SRV-004', group: 'Проектные работы', price: '4500.00', unit: 'час' },
    { id: 5, name: 'Доставка материалов', article: 'SRV-005', group: 'Логистика', price: '1200.00', unit: 'рейс' }
  ]

  const columns = [
    { key: 'name', label: 'Название', sortable: true },
    { key: 'article', label: 'Артикул', sortable: true },
    { key: 'group', label: 'Группа', sortable: true },
    { key: 'price', label: 'Цена', sortable: true, render: (value) => `${value} ₽` },
    { key: 'unit', label: 'Ед. изм.', sortable: false }
  ]

  const filteredData = services.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.article.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <FilterSection title="Статус">
          <div className="space-y-2.5">
            <FilterCheckbox 
              checked={filters.active} 
              onChange={() => toggleFilter('active')} 
              label="Активные" 
            />
            <FilterCheckbox 
              checked={filters.archived} 
              onChange={() => toggleFilter('archived')} 
              label="Архивные" 
            />
          </div>
        </FilterSection>
      </FilterSidebar>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>Услуги</h1>
            <button className={styles.addButton}>
              + Добавить
            </button>
          </div>
          
          <div className={styles.headerBottom}>
            {!isFilterOpen && (
              <button
                onClick={() => setIsFilterOpen(true)}
                className={styles.filterButton}
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

        <div className={styles.tableArea}>
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
