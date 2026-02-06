"use client"

import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { DateRangePicker } from '@/components/directories/DateRangePicker/DateRangePicker'
import { GroupedSelect } from '@/components/common/GroupedSelect/GroupedSelect'
import styles from './cashflow.module.scss'
import { cashflowMockData } from './mockData'

export default function CashFlowReportPage() {
  const [expanded, setExpanded] = useState({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Filter states
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [selectedEntity, setSelectedEntity] = useState('all')
  const [dateRange, setDateRange] = useState(null)
  const [selectedGrouping, setSelectedGrouping] = useState('periods')

  // Mock data for selects
  const groupingOptions = [
    { guid: 'periods', label: 'По периодам' },
    { guid: 'months', label: 'По месяцам' },
    { guid: 'quarters', label: 'По кварталам' },
    { guid: 'years', label: 'По годам' }
  ]
  
  const periodOptions = [
    { guid: 'all', label: 'Весь период' },
    { guid: 'q1', label: '1 квартал 2026' },
    { guid: 'q2', label: '2 квартал 2026' },
    { guid: 'h1', label: 'Полугодие 2026' },
    { guid: 'year', label: 'Год 2026' }
  ]

  const entityOptions = [
    { guid: 'all', label: 'Все организации' },
    { guid: 'entity1', label: 'ООО "Компания 1"' },
    { guid: 'entity2', label: 'ООО "Компания 2"' },
    { guid: 'entity3', label: 'ИП Иванов И.И.' }
  ]

  // Extract unique months from data
  const months = useMemo(() => {
    const monthSet = new Set()
    cashflowMockData.data.rows.forEach(row => {
      const месяц = row[4]
      if (месяц) {
        monthSet.add(месяц)
      }
    })
    return Array.from(monthSet).sort()
  }, [])

  // Transform mock data into hierarchical structure with month columns
  const data = useMemo(() => {
    const rows = cashflowMockData.data.rows
    const hierarchyMap = new Map()
    
    rows.forEach(row => {
      const [поток, направление, категория, статья, месяц, , sum] = row
      
      if (!поток) return
      
      // Level 1: Поток
      const level1Key = поток
      if (!hierarchyMap.has(level1Key)) {
        const monthData = {}
        months.forEach(m => { monthData[m] = 0 })
        
        hierarchyMap.set(level1Key, {
          id: level1Key,
          name: поток,
          total: 0,
          months: monthData,
          level: 0,
          subRows: []
        })
      }
      
      // Level 2: Направление
      if (направление) {
        const level2Key = `${поток}|${направление}`
        const parent1 = hierarchyMap.get(level1Key)
        
        if (!hierarchyMap.has(level2Key)) {
          const monthData = {}
          months.forEach(m => { monthData[m] = 0 })
          
          const node = {
            id: level2Key,
            name: направление,
            total: 0,
            months: monthData,
            level: 1,
            subRows: []
          }
          hierarchyMap.set(level2Key, node)
          parent1.subRows.push(node)
        }
        
        // Level 3: Категория
        if (категория) {
          const level3Key = `${поток}|${направление}|${категория}`
          const parent2 = hierarchyMap.get(level2Key)
          
          if (!hierarchyMap.has(level3Key)) {
            const monthData = {}
            months.forEach(m => { monthData[m] = 0 })
            
            const node = {
              id: level3Key,
              name: категория,
              total: 0,
              months: monthData,
              level: 2,
              subRows: []
            }
            hierarchyMap.set(level3Key, node)
            parent2.subRows.push(node)
          }
          
          // Level 4: Статья (leaf with value)
          if (статья && sum !== null) {
            const parent3 = hierarchyMap.get(level3Key)
            const monthData = {}
            months.forEach(m => { monthData[m] = 0 })
            
            // Set value for specific month
            if (месяц) {
              monthData[месяц] = sum
            }
            
            const node = {
              id: `${level3Key}|${статья}`,
              name: статья,
              total: sum,
              months: monthData,
              level: 3,
              isLeaf: true
            }
            parent3.subRows.push(node)
            
            // Aggregate sums up the hierarchy
            parent3.total = (parent3.total || 0) + sum
            if (месяц) {
              parent3.months[месяц] = (parent3.months[месяц] || 0) + sum
            }
            
            const parent2 = hierarchyMap.get(`${поток}|${направление}`)
            if (parent2) {
              parent2.total = (parent2.total || 0) + sum
              if (месяц) {
                parent2.months[месяц] = (parent2.months[месяц] || 0) + sum
              }
            }
            
            const parent1 = hierarchyMap.get(level1Key)
            if (parent1) {
              parent1.total = (parent1.total || 0) + sum
              if (месяц) {
                parent1.months[месяц] = (parent1.months[месяц] || 0) + sum
              }
            }
          }
        }
      }
    })
    
    return Array.from(hierarchyMap.values()).filter(node => node.level === 0)
  }, [months])

  // Format month for display
  const formatMonth = (monthStr) => {
    if (!monthStr) return ''
    const date = new Date(monthStr)
    return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
  }

  // Format number
  const formatNumber = (value) => {
    if (value === 0 || value === null || value === undefined) return '-'
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  // Check if value is actually negative (not just empty)
  const isNegativeNumber = (value) => {
    return value !== null && value !== undefined && value !== 0 && value < 0
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Денежные средства и потоки',
        size: 400,
        minSize: 400,
        cell: ({ row, getValue }) => {
          const value = getValue()
          const hasSubRows = row.subRows?.length > 0
          
          return (
            <div
              style={{
                paddingLeft: `${row.depth * 1.5}rem`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {hasSubRows && (
                <button
                  onClick={row.getToggleExpandedHandler()}
                  className={styles.expandButton}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    style={{
                      transform: row.getIsExpanded() ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    <path
                      d="M4 2L8 6L4 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
              <span className={row.depth === 0 ? styles.boldText : ''}>{value}</span>
            </div>
          )
        },
      },
      // Dynamic month columns
      ...months.map(month => ({
        accessorFn: row => row.months?.[month],
        id: month,
        header: formatMonth(month),
        size: 150,
        minSize: 150,
        maxSize: 150,
        cell: ({ getValue, row }) => {
          const value = getValue()
          const isTopLevel = row.depth === 0
          return (
            <span className={isTopLevel ? styles.boldNumber : ''}>
              {formatNumber(value)}
            </span>
          )
        },
      })),
      {
        accessorKey: 'total',
        header: 'Итого',
        size: 130,
        minSize: 130,
        maxSize: 130,
        cell: ({ getValue, row }) => {
          const value = getValue()
          const isTopLevel = row.depth === 0
          return (
            <span className={isTopLevel ? styles.boldNumber : ''}>
              {formatNumber(value)}
            </span>
          )
        },
      },
    ],
    [months]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: row => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  const handleReset = () => {
    setSelectedPeriod('all')
    setSelectedEntity('all')
    setDateRange(null)
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* Filter Sidebar */}
        <div className={`${styles.filterSidebar} ${isFilterOpen ? styles.filterSidebarOpen : ''}`}>
          <div className={styles.filterSidebarContent}>
            <div className={styles.filterSidebarHeader}>
              <h2 className={styles.filterSidebarTitle}>Фильтры</h2>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className={styles.filterSidebarClose}
              >
                ✕
              </button>
            </div>

            {/* Период */}
            <div className={styles.filterSection}>
              <h3 className={styles.filterSectionTitle}>Период</h3>
              <GroupedSelect
                data={periodOptions}
                value={selectedPeriod}
                onChange={(value) => setSelectedPeriod(value)}
                placeholder="Выберите период"
              />
            </div>

            {/* Юридическое лицо */}
            <div className={styles.filterSection}>
              <h3 className={styles.filterSectionTitle}>Юридическое лицо</h3>
              <GroupedSelect
                data={entityOptions}
                value={selectedEntity}
                onChange={(value) => setSelectedEntity(value)}
                placeholder="Выберите организацию"
              />
            </div>

            {/* Диапазон дат */}
            <div className={styles.filterSection}>
              <h3 className={styles.filterSectionTitle}>Диапазон дат</h3>
              <DateRangePicker
                selectedRange={dateRange}
                onChange={setDateRange}
                placeholder="Выберите период"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`${styles.mainContent} ${isFilterOpen ? styles.mainContentWithFilter : ''}`}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.titleRow}>
                <button
                  className={`${styles.filterToggleButton} ${isFilterOpen ? styles.filterToggleButtonActive : ''}`}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <svg className={styles.filterToggleIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <h1 className={styles.title}>Отчет о движении денежных средств</h1>
                <span className={styles.currency}>RUB</span>
              </div>
              <div className={styles.headerRight}>
                <GroupedSelect
                  data={groupingOptions}
                  value={selectedGrouping}
                  onChange={(value) => setSelectedGrouping(value)}
                  placeholder="Группировка"
                  className={styles.groupingSelect}
                />
              </div>
            </div>
          </div>
          
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th 
                        key={header.id} 
                        className={styles.th}
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className={styles.tbody}>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className={styles.tr}>
                    {row.getVisibleCells().map(cell => (
                      <td 
                        key={cell.id} 
                        className={styles.td}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
