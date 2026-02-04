"use client"

import { useEffect } from 'react'
import styles from './cashflow.module.scss'

export default function CashFlowReportPage() {
  // Block body scroll for this page only
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.height = '100vh'
    body.style.position = 'fixed'
    body.style.width = '100%'
    
    return () => {
      html.style.overflow = ''
      body.style.overflow = ''
      body.style.height = ''
      body.style.position = ''
      body.style.width = ''
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Отчет о движении денежных средств</h1>
      </div>
      <div className={styles.iframeContainer}>
        <iframe
          src="https://metabase.u-code.io/public/dashboard/10c4201f-5133-42d0-9308-1ddb7af87d0d#bordered=false&titled=false"
          className={styles.iframe}
          title="Отчет о движении денежных средств"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  )
}
