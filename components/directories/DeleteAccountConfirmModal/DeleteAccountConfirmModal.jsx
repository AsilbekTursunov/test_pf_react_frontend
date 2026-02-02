"use client"

import { cn } from '@/app/lib/utils'
import styles from './DeleteAccountConfirmModal.module.scss'

export function DeleteAccountConfirmModal({ isOpen, account, onConfirm, onCancel, isDeleting = false }) {
  if (!isOpen) return null

  return (
    <>
      <div 
        className={styles.deleteModalOverlay}
        onClick={onCancel}
      />
      <div className={styles.deleteModal}>
        <div className={styles.deleteModalHeader}>
          <h3 className={styles.deleteModalTitle}>Подтверждение удаления</h3>
          <button 
            className={styles.deleteModalClose}
            onClick={onCancel}
          >
            <svg className={styles.deleteModalCloseIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className={styles.deleteModalBody}>
          <p className={styles.deleteModalText}>
            Вы уверены, что хотите удалить счет?
          </p>
          {account && (
            <div className={styles.deleteModalInfo}>
              <div className={styles.deleteModalInfoItem}>
                <span className={styles.deleteModalInfoLabel}>Название:</span>
                <span className={styles.deleteModalInfoValue}>{account.nazvanie || '—'}</span>
              </div>
            </div>
          )}
        </div>
        <div className={styles.deleteModalFooter}>
          <button 
            className={styles.deleteModalButtonCancel}
            onClick={onCancel}
          >
            Отмена
          </button>
          <button 
            className={styles.deleteModalButtonConfirm}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </button>
        </div>
      </div>
    </>
  )
}
