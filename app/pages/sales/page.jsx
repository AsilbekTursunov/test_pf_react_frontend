"use client"

import { useState, useEffect } from 'react'
import { PageLoader } from '@/components/PageLoader/PageLoader'
import { cn } from '@/app/lib/utils'
import styles from './sales.module.scss'

export default function ProdazhiPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={styles.container}>
      <PageLoader isLoading={isLoading} />
      
      <div className={cn(styles.content, isLoading ? styles.loading : styles.loaded)}>
        <div className={styles.inner}>
          <h1 className={styles.icon}>📊</h1>
          <h2 className={styles.title}>Продажи</h2>
          <p className={styles.subtitle}>Скоро</p>
        </div>
      </div>
    </div>
  )
}
