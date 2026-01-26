"use client"

import { useState } from 'react'
import { cn } from '@/app/lib/utils'
import { OperationModal } from '../OperationModal/OperationModal'
import styles from './OperationsTable.module.scss'

export function OperationsTable({ operations = [], onRowClick }) {
  const [selectedRows, setSelectedRows] = useState([])
  const [expandedRows, setExpandedRows] = useState([])
  const [openModal, setOpenModal] = useState(null)
  const [modalType, setModalType] = useState('payment')
  const [isModalClosing, setIsModalClosing] = useState(false)
  const [isModalOpening, setIsModalOpening] = useState(false)

  const toggleRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const openOperationModal = (operation) => {
    setOpenModal(operation)
    setIsModalClosing(false)
    setIsModalOpening(true)
    document.body.style.overflow = 'hidden'
    
    // Определяем тип модалки
    // type 'in' = поступление (зеленая стрелка ←) = income modal (зеленая)
    // type 'out' = выплата (красная стрелка →) = payment modal (красная)
    // type 'transfer' = перемещение = transfer modal (серая)
    if (operation.type === 'transfer') {
      setModalType('transfer')
    } else if (operation.type === 'in') {
      setModalType('income')
    } else if (operation.type === 'out') {
      setModalType('payment')
    }
    
    // Запускаем анимацию появления
    setTimeout(() => {
      setIsModalOpening(false)
    }, 50)
  }

  const closeOperationModal = () => {
    setIsModalClosing(true)
    document.body.style.overflow = 'auto'
    setTimeout(() => {
      setOpenModal(null)
      setIsModalClosing(false)
      setIsModalOpening(false)
    }, 300)
  }

  return (
    <>
      <div className={styles.container}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr className={styles.tableHeaderRow}>
              <th className={cn(styles.tableHeaderCell, styles.tableHeaderCellCheckbox)}></th>
              <th className={styles.tableHeaderCell}>Дата</th>
              <th className={styles.tableHeaderCell}>Счет</th>
              <th className={styles.tableHeaderCell}>Тип</th>
              <th className={styles.tableHeaderCell}>Контрагент</th>
              <th className={styles.tableHeaderCell}>Статья</th>
              <th className={styles.tableHeaderCell}>Проект</th>
              <th className={styles.tableHeaderCell}>Сделка</th>
              <th className={cn(styles.tableHeaderCell, styles.tableHeaderCellRight)}>Сумма</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {operations.map((operation) => (
              <tr
                key={operation.id}
                className={cn(
                  styles.tableRow,
                  selectedRows.includes(operation.id) && styles.selected
                )}
                onClick={() => openOperationModal(operation)}
              >
                <td className={cn(styles.tableCell, styles.tableCellCheckbox)} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.checkboxWrapper}>
                    <div className={styles.checkboxContainer}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(operation.id)}
                        onChange={() => toggleRow(operation.id)}
                        className={styles.checkboxInput}
                      />
                      <div className={cn(
                        styles.checkbox,
                        selectedRows.includes(operation.id) ? styles.checked : styles.unchecked
                      )}>
                        {selectedRows.includes(operation.id) && (
                          <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className={cn(styles.tableCell, styles.dateCell)}>{operation.date}</td>
                <td className={cn(styles.tableCell, styles.accountCell)}>{operation.account}</td>
                <td className={cn(styles.tableCell, styles.typeCell)}>
                  <span className={cn(styles.typeIcon, operation.type === 'in' ? styles.in : styles.out)}>
                    {operation.type === 'in' ? '←' : '→'}
                  </span>
                </td>
                <td className={cn(styles.tableCell, styles.counterpartyCell)}>{operation.kontragent}</td>
                <td className={cn(styles.tableCell, styles.categoryCell)}>{operation.category}</td>
                <td className={cn(styles.tableCell, styles.projectCell)}>{operation.project}</td>
                <td className={cn(styles.tableCell, styles.dealCell)}>{operation.deal}</td>
                <td className={cn(
                  styles.tableCell,
                  styles.amountCell,
                  operation.amount.startsWith('+') ? styles.positive : operation.amount.startsWith('-') ? styles.negative : ''
                )}>
                  {operation.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <OperationModal 
        operation={openModal}
        modalType={modalType}
        isClosing={isModalClosing}
        isOpening={isModalOpening}
        onClose={closeOperationModal}
      />
    </>
  )
}
