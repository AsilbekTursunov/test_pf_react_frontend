"use client"

import React from 'react'
import { Calendar, Filter, ChevronDown, ListFilter, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/app/lib/utils'

export function FilterBar() {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors">
                    <Calendar size={16} />
                    <span>Январь 2024 - Декабрь 2024</span>
                    <ChevronDown size={14} className="text-slate-400 ml-1" />
                </div>

                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button className="px-4 py-1.5 text-xs font-semibold rounded-md shadow-sm bg-white text-slate-900 transition-all">
                        По дням
                    </button>
                    <button className="px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                        По месяцам
                    </button>
                    <button className="px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors">
                        По годам
                    </button>
                </div>

                <div className="w-px h-6 bg-slate-200 mx-2" />

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 cursor-pointer hover:bg-slate-50">
                        <span>Проект</span>
                        <ChevronDown size={14} className="text-slate-400" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 cursor-pointer hover:bg-slate-50">
                        <span>Категория</span>
                        <ChevronDown size={14} className="text-slate-400" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-700 border border-sky-100 rounded-lg text-sm font-medium hover:bg-sky-100 transition-colors">
                    <ListFilter size={16} />
                    <span>Фильтры</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors shadow-md">
                    <SlidersHorizontal size={16} />
                    <span>Настроить</span>
                </button>
            </div>
        </div>
    )
}
