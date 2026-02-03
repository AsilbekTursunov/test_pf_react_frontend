"use client"

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { cn } from '@/app/lib/utils'
import { generateMockOperations } from './mockData'
import styles from './cashflow.module.scss'

// Структура данных с вложенностью
const createReportData = (operations) => {
  // Группируем операции по месяцам
  const monthlyData = {}
  
  operations.forEach(op => {
    if (!op.data_operatsii) return
    
    const date = new Date(op.data_operatsii)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthLabel = date.toLocaleDateString('ru-RU', { month: 'short', year: '2-digit' })
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        key: monthKey,
        label: monthLabel,
        operations: []
      }
    }
    
    monthlyData[monthKey].operations.push({
      ...op,
      amount: op.summa || 0,
      isReceipt: op.tip && Array.isArray(op.tip) && op.tip.includes('Поступление')
    })
  })
  
  // Определяем тип потока
  const getFlowType = (op) => {
    if (op.isFinancial) {
      return 'Финансовый поток'
    }
    if (op.isInvestment) {
      return 'Инвестиционный поток'
    }
    if (op.tip && Array.isArray(op.tip)) {
      if (op.tip.includes('Поступление') || op.tip.includes('Выплата')) {
        return 'Операционный поток'
      }
      if (op.tip.includes('Перемещение')) {
        // Проверяем по описанию или другим признакам
        if (op.opisanie && op.opisanie.includes('Инвестиция')) {
          return 'Инвестиционный поток'
        }
        if (op.opisanie && op.opisanie.includes('Финансовая')) {
          return 'Финансовый поток'
        }
        return 'Инвестиционный поток'
      }
    }
    return 'Операционный поток'
  }
  
  // Создаем иерархическую структуру
  const rootRows = []
  
  // Операционный поток
  const operationalFlow = {
    id: 'operational',
    name: 'Операционный поток',
    level: 0,
    subRows: [
      {
        id: 'receipts',
        name: 'Поступления',
        level: 1,
        subRows: [
          {
            id: 'income',
            name: 'Доходы',
            level: 2,
            subRows: [],
            monthlyAmounts: {}
          }
        ],
        monthlyAmounts: {}
      },
      {
        id: 'payments',
        name: 'Выплаты',
        level: 1,
        subRows: [],
        monthlyAmounts: {}
      }
    ],
    monthlyAmounts: {}
  }
  
  // Инвестиционный поток
  const investmentFlow = {
    id: 'investment',
    name: 'Инвестиционный поток',
    level: 0,
    subRows: [],
    monthlyAmounts: {}
  }
  
  // Финансовый поток
  const financialFlow = {
    id: 'financial',
    name: 'Финансовый поток',
    level: 0,
    subRows: [],
    monthlyAmounts: {}
  }
  
  // Распределяем операции по потокам и месяцам
  Object.values(monthlyData).forEach(month => {
    month.operations.forEach(op => {
      const flowType = getFlowType(op)
      const monthKey = month.key
      
      if (flowType === 'Операционный поток') {
        if (op.isReceipt) {
          // Поступления -> Доходы
          if (!operationalFlow.subRows[0].subRows[0].monthlyAmounts[monthKey]) {
            operationalFlow.subRows[0].subRows[0].monthlyAmounts[monthKey] = 0
          }
          operationalFlow.subRows[0].subRows[0].monthlyAmounts[monthKey] += op.amount
          
          // Поступления (итого)
          if (!operationalFlow.subRows[0].monthlyAmounts[monthKey]) {
            operationalFlow.subRows[0].monthlyAmounts[monthKey] = 0
          }
          operationalFlow.subRows[0].monthlyAmounts[monthKey] += op.amount
        } else {
          // Выплаты
          if (!operationalFlow.subRows[1].monthlyAmounts[monthKey]) {
            operationalFlow.subRows[1].monthlyAmounts[monthKey] = 0
          }
          operationalFlow.subRows[1].monthlyAmounts[monthKey] += op.amount
        }
        
        // Операционный поток (итого)
        if (!operationalFlow.monthlyAmounts[monthKey]) {
          operationalFlow.monthlyAmounts[monthKey] = 0
        }
        operationalFlow.monthlyAmounts[monthKey] += op.isReceipt ? op.amount : -op.amount
      } else if (flowType === 'Инвестиционный поток') {
        if (!investmentFlow.monthlyAmounts[monthKey]) {
          investmentFlow.monthlyAmounts[monthKey] = 0
        }
        investmentFlow.monthlyAmounts[monthKey] += op.isReceipt ? op.amount : -op.amount
      } else {
        if (!financialFlow.monthlyAmounts[monthKey]) {
          financialFlow.monthlyAmounts[monthKey] = 0
        }
        financialFlow.monthlyAmounts[monthKey] += op.isReceipt ? op.amount : -op.amount
      }
    })
  })
  
  // Добавляем строку "Прибыль" в конец операционного потока
  const profitRow = {
    id: 'profit',
    name: 'Прибыль',
    level: 0,
    subRows: [],
    monthlyAmounts: {}
  }
  
  // Рассчитываем прибыль по месяцам (Операционный поток - Выплаты)
  Object.keys(monthlyData).forEach(monthKey => {
    const receipts = operationalFlow.subRows[0].monthlyAmounts[monthKey] || 0
    const payments = operationalFlow.subRows[1].monthlyAmounts[monthKey] || 0
    profitRow.monthlyAmounts[monthKey] = receipts - payments
  })
  
  rootRows.push(operationalFlow, investmentFlow, financialFlow, profitRow)
  
  return {
    rows: rootRows,
    months: Object.values(monthlyData).sort((a, b) => a.key.localeCompare(b.key))
  }
}

export default function CashFlowReportPage() {
  const [dateRange, setDateRange] = useState({
    start: new Date(2025, 9, 1), // октябрь 2025
    end: new Date(2026, 1, 28) // февраль 2026
  })
  const [expanded, setExpanded] = useState({
    operational: true, // По умолчанию развернут операционный поток
    receipts: true,
  })
  const [useMockData, setUseMockData] = useState(true) // Используем мок-данные

  // Генерируем мок-данные
  const mockOperations = useMemo(() => {
    if (useMockData) {
      return generateMockOperations()
    }
    return []
  }, [useMockData])

  // Build filters for API
  const filtersForAPI = useMemo(() => {
    const filters = {}
    
    if (dateRange.start) {
      filters.data_operatsii = { $gte: dateRange.start.toISOString() }
    }
    if (dateRange.end) {
      filters.data_operatsii = { ...filters.data_operatsii, $lte: dateRange.end.toISOString() }
    }
    
    return filters
  }, [dateRange])

  // Используем мок-данные или реальные данные
  const operations = useMockData ? mockOperations : []

  // Create report data structure
  const reportData = useMemo(() => {
    return createReportData(operations)
  }, [operations])

  // Column helper
  const columnHelper = createColumnHelper()

  // Define columns
  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'По статьям учета',
      cell: ({ row, getValue }) => {
        const level = row.original.level || 0
        const isExpandable = row.getCanExpand()
        const isExpanded = row.getIsExpanded()
        const isProfit = row.original.id === 'profit'
        
        return (
          <div 
            style={{ 
              paddingLeft: `${level * 24}px`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            className={cn(isProfit && styles.profitRow)}
          >
            {isExpandable && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  row.toggleExpanded()
                }}
                className={styles.expandButton}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className={cn(styles.expandIcon, isExpanded && styles.expanded)}
                >
                  <path
                    d="M4.5 3L7.5 6L4.5 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            {!isExpandable && level > 0 && <span style={{ width: '20px' }} />}
            <span className={cn(isProfit && styles.profitText)}>{getValue()}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor('trend', {
      header: 'Тренд',
      cell: ({ row }) => {
        const isProfit = row.original.id === 'profit'
        if (isProfit) {
          // Для прибыли показываем тренд на основе данных
          return (
            <div className={styles.trendCell}>
              <div className={cn(styles.trendLine, styles.trendLineProfit)}></div>
              <div className={cn(styles.trendDot, styles.trendDotProfit)}></div>
            </div>
          )
        }
        return (
          <div className={styles.trendCell}>
            <div className={styles.trendLine}></div>
            <div className={styles.trendDot}></div>
          </div>
        )
      },
    }),
    ...reportData.months.map(month =>
      columnHelper.accessor(`monthlyAmounts.${month.key}`, {
        header: month.label,
        cell: ({ row }) => {
          const amount = row.original.monthlyAmounts?.[month.key] || 0
          const isProfit = row.original.id === 'profit'
          
          if (amount === 0 && !isProfit) return '-'
          
          return (
            <span className={cn(
              styles.amountCell,
              amount > 0 && styles.positive,
              amount < 0 && styles.negative,
              isProfit && styles.profitAmount
            )}>
              {amount === 0 && isProfit ? '-' : new Intl.NumberFormat('ru-RU', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
              }).format(Math.abs(amount))}
            </span>
          )
        },
      })
    ),
  ], [reportData.months])

  // Create table instance
  const table = useReactTable({
    data: reportData.rows,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.headerTitle}>Отчёты</h1>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.filtersContent}>
          <div className={styles.filterSection}>
            <div className={styles.filterSectionLabel}>Период</div>
            <div className={styles.dateRange}>
              <input
                type="date"
                value={dateRange.start ? dateRange.start.toISOString().split('T')[0] : ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: new Date(e.target.value) }))}
                className={styles.dateInput}
              />
              <span className={styles.dateSeparator}>—</span>
              <input
                type="date"
                value={dateRange.end ? dateRange.end.toISOString().split('T')[0] : ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: new Date(e.target.value) }))}
                className={styles.dateInput}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.gridContainer}>
          <div className={styles.reportHeader}>
            <h2 className={styles.reportTitle}>
              Отчет о движении денежных средств
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
                className={styles.infoIcon}
              >
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5V8M8 11H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className={styles.tableHeaderCell}>
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
              <tbody className={styles.tableBody}>
                {table.getRowModel().rows.map(row => (
                  <tr 
                    key={row.id} 
                    className={cn(
                      styles.tableRow,
                      row.original.id === 'profit' && styles.profitRow
                    )}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className={styles.tableCell}>
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
