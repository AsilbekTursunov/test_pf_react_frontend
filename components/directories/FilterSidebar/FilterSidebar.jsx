"use client"

import { cn } from '@/app/lib/utils'
import styles from './FilterSidebar.module.scss'

export function FilterSidebar({ isOpen, onClose, children }) {
  return (
    <div className={cn(styles.sidebar, isOpen ? styles.open : styles.closed)}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Фильтры</h2>
          <button 
            onClick={onClose}
            className={styles.closeButton}
          >
            <svg className={styles.closeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className={styles.childrenContainer}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function FilterSection({ title, children }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  )
}

export function FilterCheckbox({ checked, onChange, label }) {
  return (
    <label className={styles.checkboxLabel}>
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={styles.checkboxInput}
        />
        <div className={cn(styles.checkbox, checked ? styles.checked : styles.unchecked)}>
          {checked && (
            <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className={styles.checkboxText}>{label}</span>
    </label>
  )
}
