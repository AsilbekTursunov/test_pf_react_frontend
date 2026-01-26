"use client"

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import styles from './BreakdownDonut.module.scss'

export function BreakdownDonut({ data, title, centerValue }) {
    return (
        <div className={styles.container}>
            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className={styles.centerContent}>
                    <span className={styles.centerTitle}>{title}</span>
                    <span className={styles.centerValue}>{centerValue}</span>
                </div>
            </div>

            <div className={styles.legend}>
                {data.map((item, index) => (
                    <div key={index} className={styles.legendItem}>
                        <div className={styles.legendItemLeft}>
                            <div className={styles.legendDot} style={{ backgroundColor: item.color }} />
                            <span className={styles.legendLabel}>{item.name}</span>
                        </div>
                        <span className={styles.legendValue}>{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
