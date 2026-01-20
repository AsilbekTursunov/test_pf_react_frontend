"use client"

import styles from './counterparties.module.scss'

export default function KontragenyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.icon}>👥</h1>
        <h2 className={styles.title}>Контрагенты</h2>
        <p className={styles.subtitle}>Скоро</p>
      </div>
    </div>
  )
}
