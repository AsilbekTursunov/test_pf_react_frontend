"use client"

import { cn } from '@/app/lib/utils'
import styles from './FilterSidebar.module.scss'

export function FilterSidebar({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className={styles.sidebar}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Фильтры</h2>
          <button 
            onClick={onClose}
            className={styles.closeButton}
          >
            ✕
          </button>
        </div>
        {children}
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
