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
import styles from './Sidebar.module.scss'

const navItems = [
    { icon: LineChart, label: 'Показатели', href: '/pages/dashboard', hasPage: true },
    { icon: RefreshCw, label: 'Операции', href: '/pages/operations', hasPage: true },
    { icon: Database, label: 'Продажи', href: '/pages/sales', hasPage: false },
    { icon: CalendarCheck, label: 'Закупки', href: '/pages/purchases', hasPage: false },
    { icon: Briefcase, label: 'Взаиморасчеты', href: '/pages/mutual-settlements', hasPage: false },
    { icon: ClipboardList, label: 'Товары и услуги', href: '/pages/products', hasPage: false },
    { icon: Library, label: 'Контрагенты', href: '/pages/counterparties', hasPage: false },
    { 
        icon: Settings, 
        label: 'Справочники', 
        href: '/pages/directories',
        hasPage: true,
        submenu: [
            { label: 'Контрагенты', href: '/pages/directories/counterparties', hasPage: true },
            { label: 'Учетные статьи', href: '/pages/directories/transaction-categories', hasPage: true },
            { label: 'Мои счета', href: '/pages/directories/accounts', hasPage: true },
            { label: 'Мои юрлица', href: '/pages/directories/legal-entities', hasPage: true },
            { label: 'Товары', href: '/pages/directories/products', hasPage: true },
            { label: 'Услуги', href: '/pages/directories/products/services', hasPage: true }
        ]
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const [expandedMenu, setExpandedMenu] = useState(null)
    const [hoveredItem, setHoveredItem] = useState(null)
    
    return (
        <aside className={styles.sidebar}>
            {/* Header / Logo */}
            <div className={styles.header}>
                <span className={styles.logo}>ПФ</span>
            </div>

            <nav className={styles.nav}>
                {navItems.map((item, index) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                    const hasSubmenu = item.submenu && item.submenu.length > 0
                    const isSubmenuActive = hasSubmenu && item.submenu.some(sub => pathname === sub.href)
                    
                    return (
                        <div 
                            key={index}
                            className={styles.navItem}
                            onMouseEnter={() => hasSubmenu && setHoveredItem(index)}
                            onMouseLeave={() => hasSubmenu && setHoveredItem(null)}
                        >
                            <Link
                                href={item.href || '/'}
                                className={cn(
                                    styles.navLink,
                                    (isActive || isSubmenuActive) && styles.navLinkActive,
                                    !item.hasPage ? styles.navLinkComingSoon : styles.navLinkNormal
                                )}
                            >
                                <div className={styles.iconWrapper}>
                                    <item.icon size={22} strokeWidth={1.5} />
                                </div>
                                <span className={styles.label}>
                                    {item.label}
                                </span>
                            </Link>

                            {/* Submenu */}
                            {hasSubmenu && hoveredItem === index && (
                                <div 
                                    className={styles.submenu}
                                    style={{ 
                                        top: `${64 + index * 64}px`
                                    }}
                                >
                                    {item.submenu.map((subItem, subIndex) => {
                                        const isSubActive = pathname === subItem.href
                                        return (
                                            <Link
                                                key={subIndex}
                                                href={subItem.href}
                                                className={cn(
                                                    styles.submenuLink,
                                                    isSubActive ? styles.submenuLinkActive : styles.submenuLinkInactive
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
