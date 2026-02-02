"use client"

import { cn } from '@/app/lib/utils'
import styles from './OperationsHeader.module.scss'

export function OperationsHeader({ isFilterOpen, onFilterToggle, onCreateClick }) {
  return (
    <div className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.headerLeft}>
          {!isFilterOpen && (
            <button
              onClick={onFilterToggle}
              className={styles.headerMenuButton}
            >
              ☰
            </button>
          )}
          <h1 className={styles.headerTitle}>Операции</h1>
          <button 
            onClick={onCreateClick}
            className={styles.headerCreateButton}
          >
            Создать
          </button>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.headerSearch}>
            <input
              type="text"
              placeholder="Поиск по операциям"
              className={styles.headerSearchInput}
            />
            <svg className={styles.headerSearchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          <button className={styles.headerExportButton}>
            <svg className={styles.headerExportIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            xls
          </button>
          <button className={styles.headerMoreButton}>⋯</button>
        </div>
      </div>
    </div>
  )
}
