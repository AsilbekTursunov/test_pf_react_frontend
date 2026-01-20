"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FilterSidebar, FilterSection, FilterCheckbox } from '@/components/spravochniki/FilterSidebar'
import { SearchBar } from '@/components/spravochniki/SearchBar'
import { ViewToggle } from '@/components/spravochniki/ViewToggle'
import { DataTable } from '@/components/spravochniki/DataTable'
import { DropdownFilter } from '@/components/spravochniki/DropdownFilter'
import { DateRangePicker } from '@/components/spravochniki/DateRangePicker'
import { useCounterAgents } from '@/hooks/useDashboard'
import styles from './counterparties.module.scss'

export default function KontragentsPage() {
  const router = useRouter()
  
  // Fetch counter agents from API
  const { data: counterAgentsData, isLoading } = useCounterAgents()
  const counterAgents = counterAgentsData?.data?.data?.data || []
  
  const [isFilterOpen, setIsFilterOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState('list')
  const [selectedRows, setSelectedRows] = useState([])
  const [accountingMethod, setAccountingMethod] = useState('cash')
  
  // Dropdown filters
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedKontragents, setSelectedKontragents] = useState([])
  const [selectedEntities, setSelectedEntities] = useState([])
  const [selectedProjects, setSelectedProjects] = useState([])
  const [selectedDeals, setSelectedDeals] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  
  // Archive filters
  const [archiveFilters, setArchiveFilters] = useState({
    showActive: true,
    showArchived: true
  })

  const toggleArchiveFilter = (key) => {
    setArchiveFilters(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Mock data for dropdowns
  const typeOptions = [
    { value: 'pokupatel', label: 'Покупатель' },
    { value: 'postavshchik', label: 'Поставщик' },
    { value: 'sotrudnik', label: 'Сотрудник' },
    { value: 'prochiye', label: 'Прочие' }
  ]

  // Convert API data to dropdown format with grouping
  const kontragentOptions = counterAgents.map(ca => ({
    value: ca.guid,
    label: ca.label,
    group: ca.group || 'Без группы'
  }))

  const entityOptions = [
    { value: 'ip_ivanov', label: 'ИП Иванов Иван Иванович' },
    { value: 'prometey', label: 'ООО "Прометей"' }
  ]

  const projectOptions = [
    { value: 'lenina15', label: 'Ленина, 15' },
    { value: 'tverskaya10', label: 'Тверская, 10' },
    { value: 'arbat5', label: 'Арбат, 5' }
  ]

  const dealOptions = [
    { value: 'deal1', label: 'Сделка №1 - Ремонт офиса' },
    { value: 'deal2', label: 'Сделка №2 - Поставка материалов' },
    { value: 'deal3', label: 'Сделка №3 - Консультация' }
  ]

  const categoryOptions = [
    { value: 'income', label: 'Услуги ремонта [Доходы]' },
    { value: 'rent', label: 'Аренда [Расходы]' },
    { value: 'fuel', label: 'ГСМ [Расходы]' },
    { value: 'office', label: 'Канцелярия [Расходы]' },
    { value: 'salary', label: 'ЗП отдел продаж [Расходы]' }
  ]

  // Mock table data (not using API data for table)
  const kontragents = [
    { id: 1, name: 'ООО "Прометей"', type: 'Поставщик', inn: '7701234567', phone: '+7 (495) 123-45-67', balance: '+150 000' },
    { id: 2, name: 'ИП Иванов Иван Иванович', type: 'Клиент', inn: '770987654321', phone: '+7 (495) 987-65-43', balance: '-50 000' },
    { id: 3, name: 'ООО "Альфа"', type: 'Поставщик', inn: '7702345678', phone: '+7 (495) 234-56-78', balance: '0' },
    { id: 4, name: 'Петров А.А.', type: 'Сотрудник', inn: '771234567890', phone: '+7 (495) 345-67-89', balance: '+25 000' },
    { id: 5, name: 'ООО "Бета"', type: 'Клиент', inn: '7703456789', phone: '+7 (495) 456-78-90', balance: '+100 000' }
  ]

  const columns = [
    { key: 'name', label: 'Название', sortable: true },
    { key: 'type', label: 'Тип', sortable: true },
    { key: 'inn', label: 'ИНН', sortable: false },
    { key: 'phone', label: 'Телефон', sortable: false },
    { 
      key: 'balance', 
      label: 'Баланс', 
      sortable: true,
      render: (value) => (
        <span
          className={
            value.startsWith('+')
              ? styles.balancePositive
              : value.startsWith('-')
              ? styles.balanceNegative
              : ''
          }
        >
          {value}
        </span>
      )
    }
  ]

  const filteredData = kontragents.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.inn.includes(searchQuery)
    return matchesSearch
  })

  return (
    <div className={styles.container}>
      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <FilterSection title="Параметры">
          <div className="space-y-3">
            <DropdownFilter
              label="Тип"
              options={typeOptions}
              selectedValues={selectedTypes}
              onChange={setSelectedTypes}
              placeholder="Тип"
            />
            <DropdownFilter
              label="Контрагенты"
              options={kontragentOptions}
              selectedValues={selectedKontragents}
              onChange={setSelectedKontragents}
              placeholder="Контрагенты"
              grouped={true}
            />
            <DropdownFilter
              label="Юрлица"
              options={entityOptions}
              selectedValues={selectedEntities}
              onChange={setSelectedEntities}
              placeholder="Юрлица"
            />
            <DropdownFilter
              label="Проекты"
              options={projectOptions}
              selectedValues={selectedProjects}
              onChange={setSelectedProjects}
              placeholder="Проекты"
            />
            <DropdownFilter
              label="Сделки"
              options={dealOptions}
              selectedValues={selectedDeals}
              onChange={setSelectedDeals}
              placeholder="Сделки"
            />
            <DropdownFilter
              label="Статьи учета"
              options={categoryOptions}
              selectedValues={selectedCategories}
              onChange={setSelectedCategories}
              placeholder="Статьи учета"
            />
          </div>
        </FilterSection>

        <FilterSection title="Период аналитики">
          <DateRangePicker
            selectedRange={selectedPeriod}
            onChange={setSelectedPeriod}
            placeholder="Выберите период"
          />
        </FilterSection>

        <FilterSection title="Архив">
          <div className="space-y-2.5">
            <FilterCheckbox 
              checked={archiveFilters.showActive} 
              onChange={() => toggleArchiveFilter('showActive')} 
              label="Показать активные" 
            />
            <FilterCheckbox 
              checked={archiveFilters.showArchived} 
              onChange={() => toggleArchiveFilter('showArchived')} 
              label="Показать архивные" 
            />
          </div>
        </FilterSection>
      </FilterSidebar>

      <div className={styles.content}>
        {/* Fixed Header */}
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <h1 className={styles.headerTitle}>Контрагенты</h1>
            
            <div className={styles.headerControls}>
              <select
                value={accountingMethod}
                onChange={(e) => setAccountingMethod(e.target.value)}
                className={styles.methodSelect}
              >
                <option value="cash">Учет по денежному потоку</option>
                <option value="accrual">Учет по начислению</option>
              </select>

              <ViewToggle view={view} onViewChange={setView} />

              <SearchBar 
                value={searchQuery} 
                onChange={setSearchQuery} 
                placeholder="Поиск по названию или контрагенту" 
              />

              <button className={styles.iconButton}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className={styles.tableArea}>
          <div className={styles.tablePadding}>
            <DataTable 
              columns={columns}
              data={filteredData}
              selectedRows={selectedRows}
              onSelectRow={setSelectedRows}
              onRowClick={(row) => router.push(`/pages/directories/counterparties/${row.id}`)}
            />
          </div>
        </div>

        {/* Fixed Stats Bar (Footer) */}
        <div className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerStats}>
              <span className={styles.footerText}>
                <span className={styles.footerTextStrong}>{selectedRows.length > 0 ? selectedRows.length : kontragents.length}</span> контрагент{selectedRows.length === 1 ? '' : 'ов'}
              </span>
              <span className={styles.footerText}>
                Дебиторка: <span className={styles.footerTextStrong}>454 470 ₽</span>
              </span>
              <span className={styles.footerText}>
                Кредиторка: <span className={styles.footerTextStrong}>589 288 ₽</span>
              </span>
              <span className={styles.footerText}>
                Поступления: <span className={styles.footerTextStrong}>23 798 000 ₽</span>
              </span>
              <span className={styles.footerText}>
                Выплаты: <span className={styles.footerTextStrong}>21 044 348 ₽</span>
              </span>
              <span className={styles.footerText}>
                Разница: <span className={styles.footerTextPositive}>+2 753 652 ₽</span>
              </span>
            </div>
            <button className={styles.iconButton}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
