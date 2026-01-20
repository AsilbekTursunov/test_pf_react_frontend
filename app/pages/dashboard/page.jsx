"use client"

import { useRef, useEffect, useState } from 'react'
import { Chart } from 'react-chartjs-2'
import { useDashboardData } from '@/hooks/useDashboardData'
import '@/lib/chartConfig' // Инициализация Chart.js
import '@/styles/range-sliders.css' // Стили слайдеров
import FilterBar from '@/components/dashboard/FilterBar'
import MethodToggle from '@/components/dashboard/MethodToggle'
import MetricsPanel from '@/components/dashboard/MetricsPanel'
import ChartSection from '@/components/dashboard/ChartSection'
import RangeSlider from '@/components/dashboard/RangeSlider'
import CashFlowSection from '@/components/dashboard/CashFlowSection'
import { PageLoader } from '@/components/PageLoader'
import { cn } from '@/app/lib/utils'
import styles from './dashboard.module.scss'

// Импортируем все функции данных и опций
import {
  getMainChartData,
  mainMetrics,
  mainChartLegend,
  getCashFlowChartData,
  cashFlowChartOptions,
  getBalanceChartData,
  balanceChartOptions,
  getPaymentBarChartData,
  paymentBarChartOptions,
  getExpensesBarChartData,
  expensesBarChartOptions,
  getClientsChartData,
  clientsChartOptions,
  getProjectsChartData,
  projectsChartOptions,
  paymentStructureData,
  pieChartOptions,
  expensesStructureData,
  expensesPieChartOptions,
  chartOptions as mainChartOptions
} from '@/lib/allChartData'

export default function DashboardPage() {
  const [isPageLoading, setIsPageLoading] = useState(true)
  
  const dashboardState = useDashboardData()
  const {
    activeMethod,
    setActiveMethod,
    activeCashFlow,
    setActiveCashFlow,
    isLoading,
    loadingProgress,
    selectedPeriod,
    setSelectedPeriod,
    selectedEntity,
    setSelectedEntity,
    selectedProject,
    setSelectedProject,
    dateRange,
    setDateRange,
    cashFlowDateRange,
    setCashFlowDateRange,
    balanceRange,
    setBalanceRange,
    paymentRange,
    setPaymentRange,
    expensesRange,
    setExpensesRange,
    isDateRangeOpen,
    setIsDateRangeOpen,
    monthNames,
    dateRangeText
  } = dashboardState

  const [activePaymentView, setActivePaymentView] = useState('income')
  const [activeProjectView, setActiveProjectView] = useState('profit')
  const [activeClientMethod, setActiveClientMethod] = useState('accrual')
  const dateRangeRef = useRef(null)

  // Close date range dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)) {
        setIsDateRangeOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setIsDateRangeOpen])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={styles.container}>
      <PageLoader isLoading={isPageLoading} />
      
      <div className={cn(styles.contentWrapper, isPageLoading ? styles.loading : styles.loaded)}>
      {/* Loading Progress Bar */}
      {isLoading && (
        <div className={styles.progressBar}>
          <div 
            className={styles.progressBarFill}
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      )}

      {/* Fixed Header Section */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>Строительство и ремонт под ключ</h1>
          <p className={styles.subtitle}>13 января 2026 года, вторник</p>
        </div>

        <FilterBar
          dateRangeText={dateRangeText}
          isDateRangeOpen={isDateRangeOpen}
          setIsDateRangeOpen={setIsDateRangeOpen}
          dateRangeRef={dateRangeRef}
          monthNames={monthNames}
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedEntity={selectedEntity}
          setSelectedEntity={setSelectedEntity}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />
      </div>

      {/* Scrollable Content */}
      <div className={styles.content}>
        <MethodToggle 
          activeMethod={activeMethod}
          setActiveMethod={setActiveMethod}
          title="Прибыль, ₽"
        />

        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          <MetricsPanel metrics={mainMetrics} />
          <ChartSection
            chartData={getMainChartData(dateRange)}
            chartOptions={mainChartOptions(dateRange)}
            rangeSlider={
              <RangeSlider
                range={dateRange}
                setRange={setDateRange}
                labels={monthNames}
                maxValue={11}
                title="Период отображения"
              />
            }
          />
        </div>

        {/* Cash Flow Section */}
        <CashFlowSection
          activeCashFlow={activeCashFlow}
          setActiveCashFlow={setActiveCashFlow}
          cashFlowDateRange={cashFlowDateRange}
          setCashFlowDateRange={setCashFlowDateRange}
          monthNames={monthNames}
          getCashFlowChartData={() => getCashFlowChartData(cashFlowDateRange)}
          cashFlowChartOptions={cashFlowChartOptions}
        />

        {/* Account Balances Section */}
        <div className={styles.balanceSection}>
          <div className={styles.balanceHeader}>
            <div className={styles.balanceTitle}>Остатки на счетах, ₽</div>
            <div className={styles.balanceValue}>3 373 340</div>
          </div>

          <div className={styles.sliderWrapper}>
            <RangeSlider
              range={balanceRange}
              setRange={setBalanceRange}
              labels={['1 янв', '22 янв', '13 фев', '7 мар', '26 мар', '29 мар', '20 апр', '6 мая', '3 июн', '26 июл', '17 авг', '8 авг', '30 авг', '21 сен', '13 окт', '4 ноя', '26 ноя', '18 дек']}
              maxValue={17}
              title="4 млн"
            />
          </div>

          <div className={styles.chartContainer}>
            <Chart type="line" data={getBalanceChartData(balanceRange)} options={balanceChartOptions} />
          </div>
        </div>

        {/* Payment Structure Section */}
        <div className={styles.paymentSection}>
          <div className={styles.paymentHeader}>
            <span className={styles.paymentTitle}>Структура платежей</span>
            <div className={styles.toggleGroup}>
              <button
                onClick={() => setActivePaymentView('income')}
                className={cn(
                  styles.toggleButton,
                  activePaymentView === 'income' ? styles.active : styles.inactive
                )}
              >
                Доходы
              </button>
              <button
                onClick={() => setActivePaymentView('expenses')}
                className={cn(
                  styles.toggleButton,
                  activePaymentView === 'expenses' ? styles.active : styles.inactive
                )}
              >
                Расходы
              </button>
            </div>
          </div>

          <div className={styles.paymentContent}>
            {/* Pie Chart with Legend */}
            <div className={styles.pieChartContainer}>
              {/* Pie Chart with Center Text */}
              <div className={styles.pieChart}>
                <Chart type="doughnut" data={paymentStructureData} options={pieChartOptions} />
                <div className={styles.pieChartCenter}>
                  <div className={styles.pieChartLabel}>Доходы:</div>
                  <div className={styles.pieChartValue}>830 000</div>
                </div>
              </div>

              {/* Legend */}
              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <div className={cn(styles.legendColor)} style={{ backgroundColor: '#4FC3F7' }}></div>
                  <div className={styles.legendText}>
                    <div className={styles.legendLabel}>Поступление от заказчиков</div>
                    <div className={styles.legendValue}>750 000 <span className={styles.legendPercent}>(90.36%)</span></div>
                  </div>
                </div>
                <div className={styles.legendItem}>
                  <div className={cn(styles.legendColor)} style={{ backgroundColor: '#1E3A8A' }}></div>
                  <div className={styles.legendText}>
                    <div className={styles.legendLabel}>Услуги ремонта</div>
                    <div className={styles.legendValue}>80 000 <span className={styles.legendPercent}>(9.64%)</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className={styles.barChartContainer}>
              <div className={styles.barChartTitle}>Доходы, ₽</div>
              <div className={styles.sliderWrapper}>
                <RangeSlider
                  range={paymentRange}
                  setRange={setPaymentRange}
                  labels={monthNames}
                  maxValue={11}
                  title="Период"
                />
              </div>
              <div className={styles.chartContainer}>
                <Chart type="bar" data={getPaymentBarChartData(paymentRange)} options={paymentBarChartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Expenses Structure Section */}
        <div className={styles.expensesSection}>
          <div className={styles.expensesTitle}>Структура расходов</div>
          
          <div className={styles.paymentContent}>
            {/* Pie Chart with Legend */}
            <div className={styles.pieChartContainer}>
              {/* Pie Chart with Center Text */}
              <div className={styles.pieChart}>
                <Chart type="doughnut" data={expensesStructureData} options={expensesPieChartOptions} />
                <div className={styles.pieChartCenter}>
                  <div className={styles.pieChartLabel}>Расходы:</div>
                  <div className={styles.pieChartValue}>329 260</div>
                </div>
              </div>

              {/* Legend */}
              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#FFC107' }}></div>
                  <div className={styles.legendText}>
                    <div className={styles.legendLabel}>Одежда <span className={styles.legendValue}>200 019</span> (60.75%)</div>
                  </div>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#FF9800' }}></div>
                  <div className={styles.legendText}>
                    <div className={styles.legendLabel}>Реклама <span className={styles.legendValue}>50 000</span> (15.19%)</div>
                  </div>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#FF5722' }}></div>
                  <div className={styles.legendText}>
                    <div className={styles.legendLabel}>Субподряд <span className={styles.legendValue}>32 412</span> (9.84%)</div>
                  </div>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#FF7043' }}></div>
                  <div className={styles.legendText}>
                    <div className={styles.legendLabel}>Монтаж <span className={styles.legendValue}>16 500</span> (5.01%)</div>
                  </div>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#FFAB91' }}></div>
                  <div className={styles.legendText}>
                    <div className={styles.legendLabel}>Проценты по кредитам <span className={styles.legendValue}>15 540</span> (4.72%)</div>
                  </div>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#BCAAA4' }}></div>
                  <div className={styles.legendText}>
                    <div className={styles.legendLabel}>Канцелярия <span className={styles.legendValue}>14 789</span> (4.49%)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className={styles.barChartContainer}>
              <div className={styles.sliderWrapper}>
                <RangeSlider
                  range={expensesRange}
                  setRange={setExpensesRange}
                  labels={monthNames}
                  maxValue={11}
                  title="Период"
                />
              </div>
              <div className={styles.chartContainerLarge}>
                <Chart type="bar" data={getExpensesBarChartData(expensesRange)} options={expensesBarChartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Profitable Clients Section */}
        <div className={styles.clientsSection}>
          <div className={styles.clientsHeader}>
            <span className={styles.clientsTitle}>Самые доходные клиенты, ₽</span>
            <div className={styles.toggleGroup}>
              <button
                onClick={() => setActiveClientMethod('accrual')}
                className={cn(
                  styles.toggleButton,
                  activeClientMethod === 'accrual' ? styles.active : styles.inactive
                )}
              >
                Метод начисления
              </button>
              <button
                onClick={() => setActiveClientMethod('cash')}
                className={cn(
                  styles.toggleButton,
                  activeClientMethod === 'cash' ? styles.active : styles.inactive
                )}
              >
                Кассовый метод
              </button>
            </div>
          </div>
          <div className={styles.chartContainerLarge}>
            <Chart type="bar" data={getClientsChartData()} options={clientsChartOptions} />
          </div>
        </div>

        {/* Project Profitability Section */}
        <div className={styles.projectsSection}>
          <div className={styles.projectsHeader}>
            <span className={styles.projectsTitle}>Прибыльность проектов</span>
            <div className={styles.toggleGroup}>
              <button
                onClick={() => setActiveClientMethod('accrual')}
                className={cn(
                  styles.toggleButton,
                  activeClientMethod === 'accrual' ? styles.active : styles.inactive
                )}
              >
                Метод начисления
              </button>
              <button
                onClick={() => setActiveClientMethod('cash')}
                className={cn(
                  styles.toggleButton,
                  activeClientMethod === 'cash' ? styles.active : styles.inactive
                )}
              >
                Кассовый метод
              </button>
            </div>
            <div className={styles.projectsToggleGroup}>
              <button
                onClick={() => setActiveProjectView('profit')}
                className={cn(
                  styles.toggleButton,
                  activeProjectView === 'profit' ? styles.active : styles.inactive
                )}
              >
                Сортировка по прибыли
              </button>
              <button
                onClick={() => setActiveProjectView('profitability')}
                className={cn(
                  styles.toggleButton,
                  activeProjectView === 'profitability' ? styles.active : styles.inactive
                )}
              >
                По рентабельности
              </button>
            </div>
          </div>
          <div className={styles.chartContainerXL}>
            <Chart type="bar" data={getProjectsChartData()} options={projectsChartOptions} />
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
