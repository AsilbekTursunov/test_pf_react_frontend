"use client"

import { cn } from '@/app/lib/utils'
import styles from './MethodToggle.module.scss'

export default function MethodToggle({ activeMethod, setActiveMethod, title }) {
  return (
    <div className={styles.container}>
      <span className={styles.title}>{title}</span>
      <div className={styles.toggleGroup}>
        <button
          onClick={() => setActiveMethod('accrual')}
          className={cn(
            styles.toggleButton,
            activeMethod === 'accrual' ? styles.active : styles.inactive
          )}
        >
          Метод начисления
        </button>
        <button
          onClick={() => setActiveMethod('cash')}
          className={cn(
            styles.toggleButton,
            activeMethod === 'cash' ? styles.active : styles.inactive
          )}
        >
          Кассовый метод
        </button>
      </div>
    </div>
  )
}
