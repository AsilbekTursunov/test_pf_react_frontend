"use client"

import { useState } from 'react'
import { cn } from '@/app/lib/utils'
import styles from './legal-entities.module.scss'

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
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <h1 className={styles.title}>Мои юрлица</h1>
            
            {/* Search */}
            <div className={styles.searchContainer}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию"
                className={styles.searchInput}
              />
              <svg className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          <div className={styles.tableOuter}>
            <table className={styles.table}>
              {!selectedRows.length && (
                <thead className={styles.theadDefault}>
                <tr>
                  <th className={styles.thCheckbox}>
                    <div 
                      onClick={toggleSelectAll}
                      className={cn(
                        styles.checkbox,
                        allSelected && styles.checkboxSelected
                      )}
                    >
                      {allSelected && (
                        <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </th>
                  <th className={styles.th}>
                    <button className={styles.headerButton}>
                      Краткое название
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </th>
                  <th className={styles.th}>Полное название</th>
                  <th className={styles.th}>ИНН</th>
                  <th className={styles.th}>КПП</th>
                </tr>
              </thead>
              )}
              
              {selectedRows.length > 0 && (
                <thead className={styles.theadSelected}>
                  <tr>
                    <th colSpan={5} className={styles.th}>
                      <div className={styles.selectedHeaderContent}>
                        <div className={styles.selectedHeaderLeft}>
                          <div 
                            onClick={toggleSelectAll}
                            className={cn(styles.checkbox, styles.checkboxSelected)}
                          >
                            <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className={styles.selectedHeaderText}>Выбран: {selectedRows.length}</span>
                        </div>
                        <button 
                          onClick={() => setSelectedRows([])}
                          className={styles.selectedHeaderClose}
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
                  <tr key={entity.id} className={styles.row}>
                    <td className={styles.td}>
                      <div 
                        onClick={() => toggleRowSelection(entity.id)}
                        className={cn(
                          styles.checkbox,
                          isRowSelected(entity.id) && styles.checkboxSelected
                        )}
                      >
                        {isRowSelected(entity.id) && (
                          <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className={styles.td}>{entity.shortName}</td>
                    <td className={styles.tdMuted}>{entity.fullName}</td>
                    <td className={styles.tdMuted}>{entity.inn}</td>
                    <td className={styles.tdMuted}>{entity.kpp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerText}>
            <span className={styles.footerCount}>{entities.length} юрлица</span>
          </div>
        </div>
      </div>
    </div>
  )
}
