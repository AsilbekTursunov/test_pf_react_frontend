"use client"

import { cn } from '@/app/lib/utils'
import styles from './RangeSlider.module.scss'

export default function RangeSlider({ 
  range, 
  setRange, 
  labels, 
  maxValue,
  title 
}) {
  return (
    <div className={styles.container}>
      <div className={styles.track}>
        <div 
          className={styles.trackFill}
          style={{
            left: `${(range[0] / maxValue) * 100}%`,
            width: `${((range[1] - range[0]) / maxValue) * 100}%`
          }}
        />
        
        <input
          type="range"
          min="0"
          max={maxValue}
          value={range[0]}
          onChange={(e) => {
            const newStart = parseInt(e.target.value)
            if (newStart <= range[1]) {
              setRange([newStart, range[1]])
            }
          }}
          className={styles.input}
        />
        
        <input
          type="range"
          min="0"
          max={maxValue}
          value={range[1]}
          onChange={(e) => {
            const newEnd = parseInt(e.target.value)
            if (newEnd >= range[0]) {
              setRange([range[0], newEnd])
            }
          }}
          className={cn(styles.input, styles.inputEnd)}
        />
        
        <div 
          className={styles.thumb}
          style={{ 
            left: `${(range[0] / maxValue) * 100}%`,
            top: '50%'
          }}
        />
        <div 
          className={styles.thumb}
          style={{ 
            left: `${(range[1] / maxValue) * 100}%`,
            top: '50%'
          }}
        />
      </div>
    </div>
  )
}
