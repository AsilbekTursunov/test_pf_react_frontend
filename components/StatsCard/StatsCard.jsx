"use client"

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import styles from './StatsCard.module.scss'

export function StatsCard({ title, value, change, secondaryValue, className, trend }) {
    const isPositive = trend === 'up' || (change && change > 0)

    return (
        <div className={cn(styles.container, className)}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.valueRow}>
                <span className={styles.value}>{value}</span>
                {change !== undefined && (
                    <span className={cn(styles.change, isPositive ? styles.positive : styles.negative)}>
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(change)}%
                    </span>
                )}
            </div>
            {secondaryValue && (
                <span className={styles.secondaryValue}>{secondaryValue}</span>
            )}
        </div>
    )
}
