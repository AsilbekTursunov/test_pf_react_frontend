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
        </div>
      </div>
    </div>
  )
}
