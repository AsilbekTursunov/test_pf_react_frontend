"use client"

import React, { useState } from 'react'
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
    Circle,
    ChevronRight
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

const navItems = [
    { icon: LineChart, label: 'Показатели', href: '/', hasPage: true },
    { icon: RefreshCw, label: 'Операции', href: '/operations', hasPage: true },
    { icon: Database, label: 'Продажи', href: '/prodazhi', hasPage: false },
    { icon: CalendarCheck, label: 'Закупки', href: '/zakupki', hasPage: false },
    { icon: Briefcase, label: 'Взаиморасчеты', href: '/vzaimoraschety', hasPage: false },
    { icon: ClipboardList, label: 'Товары и услуги', href: '/tovary', hasPage: false },
    { icon: Library, label: 'Контрагенты', href: '/kontragenty', hasPage: false },
    { 
        icon: Settings, 
        label: 'Справочники', 
        href: '/spravochniki',
        hasPage: true,
        submenu: [
            { label: 'Контрагенты', href: '/spravochniki/kontragenty', hasPage: true },
            { label: 'Учетные статьи', href: '/spravochniki/transaction-categories', hasPage: true },
            { label: 'Мои счета', href: '/spravochniki/accounts', hasPage: true },
            { label: 'Мои юрлица', href: '/spravochniki/legal-entities', hasPage: true },
            { label: 'Товары', href: '/spravochniki/products', hasPage: true },
            { label: 'Услуги', href: '/spravochniki/products/services', hasPage: true }
        ]
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const [expandedMenu, setExpandedMenu] = useState(null)
    const [hoveredItem, setHoveredItem] = useState(null)
    
    return (
        <aside className="fixed left-0 top-0 bottom-0 w-[90px] flex flex-col bg-[#2c3e50] text-[#aebbc9] z-50 overflow-y-auto overflow-x-hidden no-scrollbar shadow-xl border-r border-[#1c2834]">
            {/* Header / Logo */}
            <div className="h-16 w-full bg-[#17a2b8] flex items-center justify-center mb-0 shrink-0">
                <span className="text-white text-2xl font-bold tracking-tight">ПФ</span>
            </div>

            <nav className="flex flex-col w-full">
                {navItems.map((item, index) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                    const hasSubmenu = item.submenu && item.submenu.length > 0
                    const isSubmenuActive = hasSubmenu && item.submenu.some(sub => pathname === sub.href)
                    
                    return (
                        <div 
                            key={index}
                            className="relative"
                            onMouseEnter={() => hasSubmenu && setHoveredItem(index)}
                            onMouseLeave={() => hasSubmenu && setHoveredItem(null)}
                        >
                            <Link
                                href={item.href || '/'}
                                className={cn(
                                    "w-full flex flex-col items-center justify-center py-3 px-1 transition-all duration-200 group relative",
                                    (isActive || isSubmenuActive) && "bg-[#1c2834] text-white shadow-inner",
                                    !item.hasPage ? "bg-orange-500 hover:bg-orange-600" : "hover:text-white hover:bg-white/5"
                                )}
                            >
                                <div className={cn(
                                    "mb-1 transition-colors",
                                    (isActive || isSubmenuActive) ? "text-[#17a2b8]" : !item.hasPage ? "text-white" : "group-hover:text-white"
                                )}>
                                    <item.icon size={22} strokeWidth={1.5} />
                                </div>
                                <span className={cn(
                                    "text-[11px] font-normal text-center leading-tight tracking-tight",
                                    (isActive || isSubmenuActive) ? "text-white" : !item.hasPage ? "text-white" : "text-[#aebbc9] group-hover:text-white"
                                )}>
                                    {item.label}
                                </span>
                            </Link>

                            {/* Submenu */}
                            {hasSubmenu && hoveredItem === index && (
                                <div 
                                    className="fixed left-[90px] bg-[#2c3e50] border border-[#1c2834] rounded-r-lg shadow-xl min-w-[200px] z-[100]"
                                    style={{ 
                                        top: `${64 + index * 64}px`,
                                        animation: 'fadeSlideRight 0.2s ease-out'
                                    }}
                                >
                                    {item.submenu.map((subItem, subIndex) => {
                                        const isSubActive = pathname === subItem.href
                                        return (
                                            <Link
                                                key={subIndex}
                                                href={subItem.href}
                                                className={cn(
                                                    "block px-4 py-2.5 text-[13px] transition-colors",
                                                    isSubActive 
                                                        ? "bg-[#1c2834] text-white" 
                                                        : "text-[#aebbc9] hover:bg-[#1c2834] hover:text-white"
                                                )}
                                            >
                                                {subItem.label}
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </nav>
        </aside>
    )
}
