"use client"

import React from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import styles from './AreaStockChart.module.scss'

const data = [
    { time: '09:00', value: 1200 },
    { time: '10:00', value: 1500 },
    { time: '11:00', value: 1300 },
    { time: '12:00', value: 1700 },
    { time: '13:00', value: 800 },
    { time: '14:00', value: -400 },
    { time: '15:00', value: -600 },
    { time: '16:00', value: 1000 },
    { time: '17:00', value: 1400 },
    { time: '18:00', value: 1300 },
    { time: '19:00', value: 1300 },
    { time: '20:00', value: 1300 },
];

export function AreaStockChart() {
    const gradientOffset = () => {
        const dataMax = Math.max(...data.map((i) => i.value));
        const dataMin = Math.min(...data.map((i) => i.value));

        if (dataMax <= 0) return 0;
        if (dataMin >= 0) return 1;

        return dataMax / (dataMax - dataMin);
    };

    const off = gradientOffset();

    return (
        <div className={styles.container}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    />
                    <defs>
                        <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset={off} stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset={off} stopColor="#ef4444" stopOpacity={0.4} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="stepAfter"
                        dataKey="value"
                        stroke="#10b981"
                        fill="url(#splitColor)"
                        baseLine={0}
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
