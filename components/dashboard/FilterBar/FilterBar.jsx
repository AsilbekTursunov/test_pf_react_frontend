"use client"

import { Calendar, ChevronDown, Search } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import styles from './FilterBar.module.scss'

export default function FilterBar({ 
  dateRangeText,
  isDateRangeOpen,
  setIsDateRangeOpen,
  dateRangeRef,
  monthNames,
  dateRange,
  setDateRange,
  selectedPeriod,
  setSelectedPeriod,
  selectedEntity,
  setSelectedEntity,
  selectedProject,
  setSelectedProject
}) {
  return (
    <div className={styles.container}>
      {/* Date Range with Dropdown */}
      <div className={styles.dateRangeContainer} ref={dateRangeRef}>
        <button 
          onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
          className={styles.dateRangeButton}
        >
          <Calendar size={14} className={styles.dateRangeIcon} />
          <span className={styles.dateRangeText}>{dateRangeText}</span>
          <ChevronDown size={12} className={cn(styles.dateRangeChevron, isDateRangeOpen && styles.open)} />
        </button>

        {/* Date Range Dropdown */}
        {isDateRangeOpen && (
          <div className={styles.dateRangeDropdown}>
            <div className={styles.dateRangeDropdownHeader}>
              <span className={styles.dateRangeDropdownTitle}>Выберите период</span>
            </div>
            
            {/* Month Grid */}
            <div className={styles.monthGrid}>
              <div className={styles.monthGridInner}>
                {monthNames.map((month, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (dateRange[0] === index && dateRange[1] === index) {
                        setDateRange([0, 11])
                      } else if (dateRange[0] <= index && dateRange[1] >= index) {
                        setDateRange([index, index])
                      } else {
                        setDateRange([
                          Math.min(dateRange[0], index),
                          Math.max(dateRange[1], index)
                        ])
                      }
                    }}
                    className={cn(
                      styles.monthButton,
                      dateRange[0] <= index && dateRange[1] >= index
                        ? styles.selected
                        : styles.unselected
                    )}
                  >
                    {month}
                  </button>
                ))}
              </div>
              
              {/* Quick Actions */}
              <div className={styles.dateRangeActions}>
                <button
                  onClick={() => setDateRange([0, 11])}
                  className={styles.dateRangeActionLink}
                >
                  Весь год
                </button>
                <button
                  onClick={() => setIsDateRangeOpen(false)}
                  className={styles.dateRangeActionButton}
                >
                  Применить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* По месяцам */}
      <div className={styles.selectContainer}>
        <select 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className={styles.select}
        >
          <option value="months">По месяцам</option>
          <option value="quarters">По кварталам</option>
          <option value="years">По годам</option>
        </select>
        <ChevronDown size={12} className={styles.selectIcon} />
      </div>

      {/* Юрлица и счета */}
      <div className={styles.selectContainer}>
        <select 
          value={selectedEntity}
          onChange={(e) => setSelectedEntity(e.target.value)}
          className={styles.select}
        >
          <option value="all">Юрлица и счета</option>
          <option value="prometey">ООО "Прометей"</option>
          <option value="alekseenko">ИП Алексеенко М.Ф.</option>
        </select>
        <ChevronDown size={12} className={styles.selectIcon} />
      </div>

      {/* Проекты */}
      <div className={styles.selectContainer}>
        <select 
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className={styles.select}
        >
          <option value="all">Проекты</option>
          <option value="construction">Строительство</option>
          <option value="repair">Ремонт</option>
        </select>
        <ChevronDown size={12} className={styles.selectIcon} />
      </div>

      {/* Сделки */}
      <div className={styles.selectContainer}>
        <button className={styles.button}>
          <span className={styles.buttonText}>Сделки</span>
          <ChevronDown size={12} className={styles.buttonIcon} />
        </button>
      </div>

      {/* Search */}
      <button className={styles.searchButton}>
        <Search size={14} className={styles.searchIcon} />
      </button>
    </div>
  )
}
