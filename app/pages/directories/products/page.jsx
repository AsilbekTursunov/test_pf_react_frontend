"use client"

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/app/lib/utils'
import ProductModal from '@/components/directories/ProductModal/ProductModal'
import styles from './products.module.scss'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false)
  const [groupBy, setGroupBy] = useState('По группам')
  const [expandedGroups, setExpandedGroups] = useState(['Товары без группы'])
  const [closingGroups, setClosingGroups] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('product')
  const createDropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (createDropdownRef.current && !createDropdownRef.current.contains(event.target)) {
        setIsCreateDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleGroup = (groupName) => {
    if (expandedGroups.includes(groupName)) {
      setClosingGroups(prev => [...prev, groupName])
      setTimeout(() => {
        setExpandedGroups(prev => prev.filter(g => g !== groupName))
        setClosingGroups(prev => prev.filter(g => g !== groupName))
      }, 300)
    } else {
      setExpandedGroups(prev => [...prev, groupName])
    }
  }

  const isGroupExpanded = (groupName) => expandedGroups.includes(groupName)

  const products = [
    { id: 1, name: 'Кафельная плитка', article: 'KF-001', pricePerUnit: '990 ₽', unit: 'м 2', nds: '—', priceWithNds: '990 ₽', comment: '' },
    { id: 2, name: 'Ламинат', article: 'LM-001', pricePerUnit: '585 ₽', unit: 'шт', nds: '—', priceWithNds: '585 ₽', comment: '' },
    { id: 3, name: 'Обои', article: 'OB-001', pricePerUnit: '10 000 ₽', unit: 'м 2', nds: '—', priceWithNds: '10 000 ₽', comment: '' },
    { id: 4, name: 'Проводка', article: 'PR-001', pricePerUnit: '10 000 ₽', unit: 'м 2', nds: '—', priceWithNds: '10 000 ₽', comment: '' },
    { id: 5, name: 'Строительные материалы', article: 'SM-001', pricePerUnit: '0 ₽', unit: 'шт', nds: '—', priceWithNds: '0 ₽', comment: '' },
    { id: 6, name: 'Укладка ламината', article: 'UL-001', pricePerUnit: '1 000 ₽', unit: 'м 2', nds: '—', priceWithNds: '1 000 ₽', comment: '' },
    { id: 7, name: 'Штукатурка стен', article: 'SH-001', pricePerUnit: '5 000 ₽', unit: 'м 2', nds: '—', priceWithNds: '5 000 ₽', comment: '' }
  ]

  const groupedProducts = {
    'Товары без группы': products
  }

  const isRowSelected = (id) => selectedRows.includes(id)
  
  const toggleRowSelection = (id) => {
    // Check if this is a group selection
    if (typeof id === 'string' && id.startsWith('group-')) {
      const groupName = id.replace('group-', '')
      const groupItems = groupedProducts[groupName]
      const groupItemIds = groupItems.map(item => item.id)
      
      // Check if all items in group are selected
      const allGroupItemsSelected = groupItemIds.every(itemId => selectedRows.includes(itemId))
      
      if (allGroupItemsSelected) {
        // Unselect all items in group
        setSelectedRows(prev => prev.filter(rid => !groupItemIds.includes(rid)))
      } else {
        // Select all items in group
        setSelectedRows(prev => [...new Set([...prev, ...groupItemIds])])
      }
    } else {
      // Individual item selection
      if (selectedRows.includes(id)) {
        setSelectedRows(prev => prev.filter(rid => rid !== id))
      } else {
        setSelectedRows(prev => [...prev, id])
      }
    }
  }

  const isGroupSelected = (groupName) => {
    const groupItems = groupedProducts[groupName]
    if (!groupItems || groupItems.length === 0) return false
    return groupItems.every(item => selectedRows.includes(item.id))
  }

  const allSelected = selectedRows.length === products.length && products.length > 0

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([])
    } else {
      setSelectedRows(products.map(p => p.id))
    }
  }

  const filteredData = products.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.article.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>Товары</h1>
              
              {/* Create Button with Dropdown */}
              <div className={styles.createButtonContainer} ref={createDropdownRef}>
                <button
                  onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                  className={styles.createButton}
                >
                  Создать
                  <svg 
                    className={cn(styles.createButtonIcon, isCreateDropdownOpen && styles.rotated)}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isCreateDropdownOpen && (
                  <div className={styles.createDropdown}>
                    <button
                      onClick={() => {
                        setIsCreateDropdownOpen(false)
                        setModalType('product')
                        setIsModalOpen(true)
                      }}
                      className={styles.createDropdownItem}
                    >
                      Создать товар
                    </button>
                    <button
                      onClick={() => {
                        setIsCreateDropdownOpen(false)
                        setModalType('group')
                        setIsModalOpen(true)
                      }}
                      className={cn(styles.createDropdownItem, styles.createDropdownItemBorder)}
                    >
                      Создать группу
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.headerRight}>
              {/* Group By Dropdown */}
              <select 
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className={styles.groupBySelect}
              >
                <option>По группам</option>
                <option>Без группировки</option>
              </select>

              {/* Search */}
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по товарам"
                  className={styles.searchInput}
                />
                <svg className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableArea}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              {!selectedRows.length && (
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className={styles.tableHeaderCellCheckbox}>
                      <div 
                        onClick={toggleSelectAll}
                        className={styles.checkbox}
                        style={{
                          '--checkbox-bg': allSelected ? '#6366f1' : 'white',
                          '--checkbox-border': allSelected ? '#6366f1' : '#9ca3af'
                        }}
                      >
                        {allSelected && (
                          <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className={styles.tableHeaderCellExpand}></th>
                    <th className={styles.tableHeaderCell}>
                      <button className={styles.tableSortButton}>
                        Наименование
                        <svg className={styles.tableSortIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </th>
                    <th className={styles.tableHeaderCell}>Артикул</th>
                    <th className={styles.tableHeaderCell}>Цена за ед.</th>
                    <th className={styles.tableHeaderCell}>Единица</th>
                    <th className={styles.tableHeaderCell}>НДС</th>
                    <th className={styles.tableHeaderCell}>Цена с НДС</th>
                    <th className={styles.tableHeaderCell}>Комментарий</th>
                  </tr>
                </thead>
              )}
              
              {selectedRows.length > 0 && (
                <thead className={styles.selectedHeader}>
                  <tr>
                    <th colSpan={9} className={styles.selectedHeaderCell}>
                      <div className={styles.selectedHeaderContent}>
                        <div className={styles.selectedHeaderLeft}>
                          <div 
                            onClick={toggleSelectAll}
                            className={styles.selectedHeaderCheckbox}
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
                {Object.entries(groupedProducts).map(([groupName, items]) => (
                  <React.Fragment key={groupName}>
                    {/* Group Header */}
                    <tr className={styles.groupRow}>
                      <td className={cn(styles.groupCell, styles.groupCellCheckbox)}>
                        <div 
                          onClick={() => toggleRowSelection(`group-${groupName}`)}
                          className={styles.checkbox}
                          style={{
                            '--checkbox-bg': isGroupSelected(groupName) ? '#6366f1' : 'white',
                            '--checkbox-border': isGroupSelected(groupName) ? '#6366f1' : '#9ca3af'
                          }}
                        >
                          {isGroupSelected(groupName) && (
                            <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className={cn(styles.groupCell, styles.groupCellExpand)}>
                        <button
                          onClick={() => toggleGroup(groupName)}
                          className={styles.expandButton}
                        >
                          <div className={styles.expandButtonIcon}>
                            {/* Horizontal line (always visible) */}
                            <svg className={styles.expandButtonIconHorizontal} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                            {/* Vertical line (rotates and fades) */}
                            <svg 
                              className={cn(
                                styles.expandButtonIconVertical,
                                isGroupExpanded(groupName) ? styles.expanded : styles.collapsed
                              )}
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor" 
                              strokeWidth="2.5"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V4" />
                            </svg>
                          </div>
                        </button>
                      </td>
                      <td colSpan={7} className={styles.groupCellTitle}>
                        {groupName} ({items.length})
                      </td>
                    </tr>
                    
                    {/* Group Items with Animation */}
                    {(isGroupExpanded(groupName) || closingGroups.includes(groupName)) && (
                      <tr>
                        <td colSpan={9} className={styles.groupItemsRow}>
                          <div 
                            className={styles.groupItemsContainer}
                            style={{
                              '--group-animation': closingGroups.includes(groupName)
                                ? 'collapseUp 0.3s ease-in-out'
                                : 'expandDown 0.3s ease-out'
                            }}
                          >
                            <div className={styles.groupItemsInner}>
                              <table className={styles.groupItemsTable}>
                                <tbody>
                                  {items.map((product, index) => (
                                    <tr 
                                      key={product.id} 
                                      className={styles.productRow}
                                      style={{
                                        '--row-animation': !closingGroups.includes(groupName)
                                          ? `fadeSlideUp 0.2s ease-out ${index * 0.04}s backwards`
                                          : 'none'
                                      }}
                                    >
                                      <td className={cn(styles.productCell, styles.productCellCheckbox)}>
                                        <div 
                                          onClick={() => toggleRowSelection(product.id)}
                                          className={styles.checkbox}
                                          style={{
                                            '--checkbox-bg': isRowSelected(product.id) ? '#6366f1' : 'white',
                                            '--checkbox-border': isRowSelected(product.id) ? '#6366f1' : '#9ca3af'
                                          }}
                                        >
                                          {isRowSelected(product.id) && (
                                            <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                          )}
                                        </div>
                                      </td>
                                      <td className={cn(styles.productCell, styles.productCellExpand)}>
                                        {/* Vertical dashed line */}
                                        <div 
                                          className={styles.dashedLineVertical}
                                          style={{ 
                                            '--dash-top': '0',
                                            '--dash-height': index === items.length - 1 ? '50%' : '100%'
                                          }}
                                        ></div>
                                        {/* Horizontal dashed line */}
                                        <div 
                                          className={styles.dashedLineHorizontal}
                                          style={{ 
                                            '--dash-left': '50%',
                                            '--dash-width': 'calc(50% + 8px)'
                                          }}
                                        ></div>
                                      </td>
                                      <td className={cn(styles.productCell, styles.productCellName)}>{product.name}</td>
                                      <td className={cn(styles.productCell, styles.productCellText)}>{product.article}</td>
                                      <td className={cn(styles.productCell, styles.productCellText)}>{product.pricePerUnit}</td>
                                      <td className={cn(styles.productCell, styles.productCellText)}>{product.unit}</td>
                                      <td className={cn(styles.productCell, styles.productCellText)}>{product.nds}</td>
                                      <td className={cn(styles.productCell, styles.productCellText)}>{product.priceWithNds}</td>
                                      <td className={cn(styles.productCell, styles.productCellText)}>{product.comment}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerText}>
            <span className={styles.footerTextBold}>{products.length} товаров</span>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        type={modalType}
      />
    </div>
  )
}
