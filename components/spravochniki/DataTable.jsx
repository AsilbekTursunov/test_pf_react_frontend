"use client"

import { useState } from 'react'
import { cn } from '@/app/lib/utils'

export function DataTable({ columns, data, onRowClick, selectedRows = [], onSelectRow }) {
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0
    const aVal = a[sortColumn]
    const bVal = b[sortColumn]
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const allSelected = data.length > 0 && selectedRows.length === data.length
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {onSelectRow && (
                <th className="w-12 px-4 py-3">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => {
                          if (allSelected) {
                            onSelectRow([])
                          } else {
                            onSelectRow(data.map(row => row.id))
                          }
                        }}
                        className="peer sr-only"
                      />
                      <div className={cn(
                        "w-[18px] h-[18px] rounded-sm border-2 flex items-center justify-center transition-all cursor-pointer",
                        allSelected || someSelected
                          ? "bg-[#17a2b8] border-[#17a2b8]"
                          : "border-slate-300 hover:border-slate-400"
                      )}>
                        {allSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {someSelected && !allSelected && (
                          <div className="w-2 h-0.5 bg-white"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left text-[13px] font-normal text-slate-500",
                    column.sortable && "cursor-pointer hover:text-slate-700"
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortColumn === column.key && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {sortDirection === 'asc' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        )}
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedData.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "hover:bg-slate-50 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(row)}
              >
                {onSelectRow && (
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row.id)}
                          onChange={() => {
                            if (selectedRows.includes(row.id)) {
                              onSelectRow(selectedRows.filter(id => id !== row.id))
                            } else {
                              onSelectRow([...selectedRows, row.id])
                            }
                          }}
                          className="peer sr-only"
                        />
                        <div className={cn(
                          "w-[18px] h-[18px] rounded-sm border-2 flex items-center justify-center transition-all cursor-pointer",
                          selectedRows.includes(row.id)
                            ? "bg-[#17a2b8] border-[#17a2b8]"
                            : "border-slate-300 hover:border-slate-400"
                        )}>
                          {selectedRows.includes(row.id) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-[13px] text-slate-700">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
