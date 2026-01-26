"use client"

import styles from './MetricsPanel.module.scss'

export default function MetricsPanel({ metrics }) {
  return (
    <div className={styles.container}>
      {metrics.map((metric, index) => (
        <div key={index} className={styles.metric}>
          <div className={styles.metricLabel}>{metric.label}</div>
          <div className={styles.metricValue}>
            <div className={styles.metricValueMain}>
              {metric.value}
            </div>
            <div className={styles.metricValuePlan}>
              {metric.plan} <span className={styles.metricValuePlanText}>- по плану</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
