import { Chart } from 'react-chartjs-2'
import { cn } from '@/app/lib/utils'
import styles from './ChartSection.module.scss'

export default function ChartSection({ 
  title, 
  chartData, 
  chartOptions, 
  legend, 
  rangeSlider,
  height = "450px" 
}) {
  return (
    <div className={styles.container}>
      {rangeSlider && (
        <div className={styles.rangeSliderContainer}>
          {rangeSlider}
        </div>
      )}

      <div className={styles.chartContainer} style={{ height }}>
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>

      {legend && (
        <div className={styles.legend}>
          {legend.map((item, index) => (
            <div key={index} className={styles.legendItem}>
              <div 
                className={cn(styles.legendShape, item.shape === 'circle' ? styles.circle : styles.square)}
                style={{ backgroundColor: item.color }}
              />
              <span className={styles.legendLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
