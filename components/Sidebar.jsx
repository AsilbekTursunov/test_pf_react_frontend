"use client"

import React from 'react'
import Link from 'next/link'
import {
    LineChart,
    RefreshCw,
    Database,
    CalendarCheck,
    Briefcase,
    ClipboardList,
    Library,
    Settings,
    Circle
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

const navItems = [
    { icon: LineChart, label: 'Показатели', href: '/pokazateli', active: true, highlight: true },
    {
        icon: ({ size, className }) => (
            <div className={cn("border-2 border-current rounded-md flex items-center justify-center font-bold text-[8px] leading-none px-1 py-0.5", className)} style={{ width: size, height: size * 0.7 }}>
                PRO
            </div>
        ), label: 'Показатели', href: '/pokazateli'
    },
    { icon: RefreshCw, label: 'Операции', href: '/operations' },
    { icon: Database, label: 'Сделки', href: '/deals' },
    { icon: CalendarCheck, label: 'План', href: '/plan' },
    { icon: Briefcase, label: 'Проекты', href: '/projects' },
    { icon: ClipboardList, label: 'Отчёты', href: '/reports' },
    { icon: Library, label: 'Справочники', href: '/references' },
    { icon: Settings, label: 'Настройки', href: '/settings' },
]

export function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 bottom-0 w-[90px] flex flex-col bg-[#2c3e50] text-[#aebbc9] z-50 overflow-y-auto overflow-x-hidden no-scrollbar shadow-xl border-r border-[#1c2834]">
            {/* Header / Logo */}
            <div className="h-16 w-full bg-[#17a2b8] flex items-center justify-center mb-0 shrink-0">
                <span className="text-white text-2xl font-bold tracking-tight">ПФ</span>
            </div>

            <nav className="flex flex-col w-full">
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href || '/'}
                        className={cn(
                            "w-full flex flex-col items-center justify-center py-4 px-1 transition-all duration-200 hover:text-white hover:bg-white/5 group relative",
                            item.highlight && "bg-[#1c2834] text-white shadow-inner"
                        )}
                    >
                        <div className={cn(
                            "mb-1 transition-colors",
                            item.highlight ? "text-[#17a2b8]" : "group-hover:text-white"
                        )}>
                            <item.icon size={28} strokeWidth={1} />
                        </div>
                        <span className={cn(
                            "text-[12px] font-normal text-center leading-tight tracking-tight",
                            item.highlight ? "text-white" : "text-[#aebbc9] group-hover:text-white"
                        )}>
                            {item.label}
                        </span>
                    </Link>
                ))}
            </nav>
        </aside>
    )
}
