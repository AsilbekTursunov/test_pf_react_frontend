"use client"

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/app/lib/utils'

export function StatsCard({ title, value, change, secondaryValue, className, trend }) {
    const isPositive = trend === 'up' || (change && change > 0)

    return (
        <div className={cn("flex flex-col gap-1 p-2", className)}>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</h3>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-800">{value}</span>
                {change !== undefined && (
                    <span className={cn(
                        "text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5",
                        isPositive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                    )}>
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(change)}%
                    </span>
                )}
            </div>
            {secondaryValue && (
                <span className="text-xs text-sky-600 font-medium">{secondaryValue}</span>
            )}
        </div>
    )
}
