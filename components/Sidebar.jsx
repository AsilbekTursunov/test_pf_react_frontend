"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
    { icon: LineChart, label: 'Показатели', href: '/pokazateli' },
    { icon: RefreshCw, label: 'Операции', href: '/operations' },
    { icon: Database, label: 'Продажи', href: '/prodazhi' },
    { icon: CalendarCheck, label: 'Закупки', href: '/zakupki' },
    { icon: Briefcase, label: 'Взаиморасчеты', href: '/vzaimoraschety' },
    { icon: ClipboardList, label: 'Товары и услуги', href: '/tovary' },
    { icon: Library, label: 'Контрагенты', href: '/kontragenty' },
    { icon: Settings, label: 'Справочники', href: '/spravochniki' },
]

export function Sidebar() {
    const pathname = usePathname()
    
    return (
        <aside className="fixed left-0 top-0 bottom-0 w-[90px] flex flex-col bg-[#2c3e50] text-[#aebbc9] z-50 overflow-y-auto overflow-x-hidden no-scrollbar shadow-xl border-r border-[#1c2834]">
            {/* Header / Logo */}
            <div className="h-16 w-full bg-[#17a2b8] flex items-center justify-center mb-0 shrink-0">
                <span className="text-white text-2xl font-bold tracking-tight">ПФ</span>
            </div>

            <nav className="flex flex-col w-full">
                {navItems.map((item, index) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                    
                    return (
                        <Link
                            key={index}
                            href={item.href || '/'}
                            className={cn(
                                "w-full flex flex-col items-center justify-center py-4 px-1 transition-all duration-200 hover:text-white hover:bg-white/5 group relative",
                                isActive && "bg-[#1c2834] text-white shadow-inner"
                            )}
                        >
                            <div className={cn(
                                "mb-1 transition-colors",
                                isActive ? "text-[#17a2b8]" : "group-hover:text-white"
                            )}>
                                <item.icon size={28} strokeWidth={1} />
                            </div>
                            <span className={cn(
                                "text-[12px] font-normal text-center leading-tight tracking-tight",
                                isActive ? "text-white" : "text-[#aebbc9] group-hover:text-white"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
