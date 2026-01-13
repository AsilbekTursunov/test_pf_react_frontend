"use client"

import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts'

const data = [
    { name: 'Кропоткинская', value1: 85, value2: 92, value3: 78 },
    { name: 'Киевская', value1: 45, value2: 38, value3: 52 },
    { name: 'Белорусская', value1: -15, value2: 25, value3: 10 },
    { name: 'Арбатская', value1: 70, value2: 65, value3: 75 },
    { name: 'Таганская', value1: -20, value2: 15, value3: 5 },
    { name: 'Тверская', value1: 80, value2: 85, value3: 90 },
    { name: 'Новослободская', value1: 35, value2: 40, value3: 30 },
];

export function BranchProfitChart() {
    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend verticalAlign="top" align="left" height={36} iconType="rect" />
                    <Bar dataKey="value1" name="Прибыль" fill="#84cc16" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="value2" name="Рентабельность" fill="#bae6fd" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="value3" name="Эффективность" fill="#dcfce7" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
