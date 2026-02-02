"use client"

import { cn } from '@/app/lib/utils'
import styles from './DeleteCategoryConfirmModal.module.scss'

export function DeleteCategoryConfirmModal({ isOpen, category, onConfirm, onCancel, isDeleting = false }) {
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
            ✕
          </button>
        </div>
        <div className={styles.deleteModalBody}>
          <p className={styles.deleteModalText}>
            Вы уверены, что хотите удалить учетную статью?
          </p>
          {category && (
            <div className={styles.deleteModalInfo}>
              <div className={styles.deleteModalInfoItem}>
                <span className={styles.deleteModalInfoLabel}>Название:</span>
                <span className={styles.deleteModalInfoValue}>{category.name || '—'}</span>
              </div>
              {category.tip && category.tip.length > 0 && (
                <div className={styles.deleteModalInfoItem}>
                  <span className={styles.deleteModalInfoLabel}>Тип:</span>
                  <span className={styles.deleteModalInfoValue}>{category.tip.join(', ')}</span>
                </div>
              )}
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
