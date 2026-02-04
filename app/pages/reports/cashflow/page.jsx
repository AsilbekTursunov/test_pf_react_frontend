"use client"

import { useState } from 'react'
import { DateRangePicker } from '@/components/directories/DateRangePicker/DateRangePicker'
import styles from './cashflow.module.scss'

export default function CashFlowReportPage() {
  const [dateRange, setDateRange] = useState(null)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.headerTitle}>Отчет о движении денежных средств</h1>
        </div>
        <div className={styles.headerRight}>
          <DateRangePicker
            selectedRange={dateRange}
            onChange={setDateRange}
            placeholder="Выберите период"
          />
        </div>
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
