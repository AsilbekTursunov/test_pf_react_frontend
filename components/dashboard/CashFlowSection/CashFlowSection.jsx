"use client"

import { Chart } from 'react-chartjs-2'
import { cn } from '@/app/lib/utils'
import RangeSlider from '../RangeSlider/RangeSlider'
import styles from './CashFlowSection.module.scss'

export default function CashFlowSection({
  activeCashFlow,
  setActiveCashFlow,
  cashFlowDateRange,
  setCashFlowDateRange,
  monthNames,
  getCashFlowChartData,
  cashFlowChartOptions
}) {
  const cashFlowMetrics = [
    { label: 'Поступления', value: '830 000', plan: '7 238 620' },
    { label: 'Выплаты', value: '324 801', plan: '7 798 140' },
    { label: 'Разница', value: '505 199', plan: '-559 520' }
  ]

  const cashFlowDateRangeText = `${monthNames[cashFlowDateRange[0]]} - ${monthNames[cashFlowDateRange[1]]}`

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Денежный поток, ₽</span>
        <div className={styles.toggleGroup}>
          {['general', 'operational', 'investment', 'financial'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveCashFlow(type)}
              className={cn(
                styles.toggleButton,
                activeCashFlow === type ? styles.active : styles.inactive
              )}
            >
              {type === 'general' ? 'Общий' : type === 'operational' ? 'Операционный' : type === 'investment' ? 'Инвестиционный' : 'Финансовый'}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {/* Left Panel - Cash Flow Metrics */}
        <div className={styles.metricsPanel}>
          {cashFlowMetrics.map((metric, index) => (
            <div key={index} className={styles.metric}>
              <div className={styles.metricLabel}>{metric.label}</div>
              <div className={styles.metricValue}>
                <div className={styles.metricValueMain}>{metric.value}</div>
                <div className={styles.metricValuePlan}>
                  {metric.plan} <span className={styles.metricValuePlanText}>- по плану</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Content - Cash Flow Chart */}
        <div className={styles.chartPanel}>
          <div className={styles.rangeSliderWrapper}>
            <div className={styles.rangeSliderHeader}>
              <span className={styles.rangeSliderLabel}>6 млн</span>
              <span className={styles.rangeSliderDate}>{cashFlowDateRangeText}</span>
            </div>
            
            <RangeSlider
              range={cashFlowDateRange}
              setRange={setCashFlowDateRange}
              labels={monthNames}
              maxValue={11}
              title=""
            />
          </div>

          <div className={styles.chartWrapper}>
            <Chart type="bar" data={getCashFlowChartData()} options={cashFlowChartOptions} />
          </div>

          {/* Cash Flow Legend */}
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={cn(styles.legendShape, styles.square)} style={{ backgroundColor: '#4FC3F7' }}></div>
              <span className={styles.legendLabel}>Поступления</span>
            </div>
            <div className={styles.legendItem}>
              <div className={cn(styles.legendShape, styles.square)} style={{ backgroundColor: '#FFB74D' }}></div>
              <span className={styles.legendLabel}>Выплаты</span>
            </div>
            <div className={styles.legendItem}>
              <div className={cn(styles.legendShape, styles.circle)} style={{ backgroundColor: '#4CAF50' }}></div>
              <span className={styles.legendLabel}>Разница</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
