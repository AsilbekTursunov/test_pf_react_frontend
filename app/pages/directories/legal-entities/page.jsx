"use client"

import { useState, useMemo } from 'react'
import { cn } from '@/app/lib/utils'
import { useLegalEntitiesV2, useDeleteLegalEntities } from '@/hooks/useDashboard'
import CreateLegalEntityModal from '@/components/directories/CreateLegalEntityModal/CreateLegalEntityModal'
import LegalEntityMenu from '@/components/directories/LegalEntityMenu/LegalEntityMenu'
import DeleteLegalEntityConfirmModal from '@/components/directories/DeleteLegalEntityConfirmModal/DeleteLegalEntityConfirmModal'
import styles from './legal-entities.module.scss'

export default function LegalEntitiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingLegalEntity, setEditingLegalEntity] = useState(null)
  const [deletingLegalEntity, setDeletingLegalEntity] = useState(null)
  
  const deleteMutation = useDeleteLegalEntities()

  // Fetch legal entities from API
  const { data: legalEntitiesData, isLoading: isLoadingLegalEntities } = useLegalEntitiesV2({ data: {} })
  const legalEntitiesItems = legalEntitiesData?.data?.data?.response || []

  // Transform API data to component format
  const entities = useMemo(() => {
    return legalEntitiesItems.map((item) => ({
      id: item.guid,
      guid: item.guid,
      shortName: item.nazvanie || 'Без названия',
      fullName: item.polnoe_nazvanie || '-',
      inn: item.inn?.toString() || '-',
      kpp: item.kpp?.toString() || '-',
      rawData: item // Store raw data for editing
    }))
  }, [legalEntitiesItems])

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

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return entities
    
    const query = searchQuery.toLowerCase()
    return entities.filter(item => 
      item.shortName.toLowerCase().includes(query) ||
      item.fullName.toLowerCase().includes(query) ||
      item.inn.includes(query)
    )
  }, [entities, searchQuery])

  const handleEdit = (legalEntity) => {
    setEditingLegalEntity(legalEntity.rawData)
  }

  const handleDelete = (legalEntity) => {
    setDeletingLegalEntity(legalEntity.rawData)
  }

  const handleDeleteConfirm = async () => {
    if (deletingLegalEntity?.guid) {
      try {
        await deleteMutation.mutateAsync([deletingLegalEntity.guid])
        setDeletingLegalEntity(null)
      } catch (error) {
        console.error('Error deleting legal entity:', error)
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>Мои юрлица</h1>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className={styles.createButton}
              >
                Создать
              </button>
            </div>
            
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
                  <th className={styles.th}></th>
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
                {isLoadingLegalEntities ? (
                  <tr>
                    <td colSpan={6} className={styles.td} style={{ textAlign: 'center', padding: '2rem' }}>
                      Загрузка...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.td} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                      {searchQuery ? 'Ничего не найдено' : 'Нет данных'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((entity) => (
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
                      <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                        <LegalEntityMenu
                          legalEntity={entity}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerText}>
            <span className={styles.footerCount}>
              {isLoadingLegalEntities ? 'Загрузка...' : `${legalEntitiesItems.length} ${legalEntitiesItems.length === 1 ? 'юрлицо' : legalEntitiesItems.length < 5 ? 'юрлица' : 'юрлиц'}`}
            </span>
          </div>
        </div>
      </div>

      {/* Create Legal Entity Modal */}
      {isCreateModalOpen && (
        <CreateLegalEntityModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {/* Edit Legal Entity Modal */}
      {editingLegalEntity && (
        <CreateLegalEntityModal
          isOpen={!!editingLegalEntity}
          onClose={() => setEditingLegalEntity(null)}
          legalEntity={editingLegalEntity}
        />
      )}

      {/* Delete Legal Entity Confirm Modal */}
      {deletingLegalEntity && (
        <DeleteLegalEntityConfirmModal
          isOpen={!!deletingLegalEntity}
          legalEntity={deletingLegalEntity}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingLegalEntity(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  )
}
