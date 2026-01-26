"use client"

import React from 'react'
import { Calendar, Filter, ChevronDown, ListFilter, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import styles from './FilterBar.module.scss'

export function FilterBar() {
    return (
        <div className={styles.container}>
            <div className={styles.leftSection}>
                <div className={styles.dateButton}>
                    <Calendar size={16} className={styles.dateIcon} />
                    <span>Январь 2024 - Декабрь 2024</span>
                    <ChevronDown size={14} className={styles.dateChevron} />
                </div>

                <div className={styles.periodToggle}>
                    <button className={cn(styles.periodButton, styles.active)}>
                        По дням
                    </button>
                    <button className={cn(styles.periodButton, styles.inactive)}>
                        По месяцам
                    </button>
                    <button className={cn(styles.periodButton, styles.inactive)}>
                        По годам
                    </button>
                </div>

                <div className={styles.separator} />

                <div className={styles.filtersSection}>
                    <div className={styles.filterButton}>
                        <span>Проект</span>
                        <ChevronDown size={14} className={styles.filterChevron} />
                    </div>
                    <div className={styles.filterButton}>
                        <span>Категория</span>
                        <ChevronDown size={14} className={styles.filterChevron} />
                    </div>
                </div>
            </div>

            <div className={styles.rightSection}>
                <button className={cn(styles.actionButton, styles.filtersButton)}>
                    <ListFilter size={16} />
                    <span>Фильтры</span>
                </button>
                <button className={cn(styles.actionButton, styles.settingsButton)}>
                    <SlidersHorizontal size={16} />
                    <span>Настроить</span>
                </button>
            </div>
        </div>
    )
}
