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
import { cn } from '@/app/lib/utils'

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

  return (
    <div className="w-full bg-white">
      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="fixed top-[55px] left-[90px] right-0 h-1 bg-slate-200 z-50">
          <div 
            className="h-full bg-[#17a2b8] transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      )}

      {/* Fixed Header Section */}
      <div className="sticky top-[55px] bg-white z-40 border-b border-slate-200 px-2 py-6">
        <div className="mb-2">
          <h1 className="text-[24px] font-bold text-slate-900 mb-1">Строительство и ремонт под ключ</h1>
          <p className="text-[13px] text-slate-500">13 января 2026 года, вторник</p>
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
      <div className="px-6 py-6">
        <MethodToggle 
          activeMethod={activeMethod}
          setActiveMethod={setActiveMethod}
          title="Прибыль, ₽"
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-8 mb-12">
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
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="text-[16px] font-medium text-slate-900">Остатки на счетах, ₽</div>
            <div className="text-[48px] font-bold text-slate-900">3 373 340</div>
          </div>

          <div className="mb-4 px-4">
            <RangeSlider
              range={balanceRange}
              setRange={setBalanceRange}
              labels={['1 янв', '22 янв', '13 фев', '7 мар', '26 мар', '29 мар', '20 апр', '6 мая', '3 июн', '26 июл', '17 авг', '8 авг', '30 авг', '21 сен', '13 окт', '4 ноя', '26 ноя', '18 дек']}
              maxValue={17}
              title="4 млн"
            />
          </div>

          <div className="h-[350px] relative">
            <Chart type="line" data={getBalanceChartData(balanceRange)} options={balanceChartOptions} />
          </div>
        </div>

        {/* Payment Structure Section */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
            <span className="text-[16px] font-medium text-slate-900">Структура платежей</span>
            <div className="flex bg-slate-100 rounded p-1">
              <button
                onClick={() => setActivePaymentView('income')}
                className={cn(
                  "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                  activePaymentView === 'income'
                    ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]"
                    : "text-slate-600 hover:text-slate-800"
                )}
              >
                Доходы
              </button>
              <button
                onClick={() => setActivePaymentView('expenses')}
                className={cn(
                  "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                  activePaymentView === 'expenses'
                    ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]"
                    : "text-slate-600 hover:text-slate-800"
                )}
              >
                Расходы
              </button>
            </div>
          </div>

          <div className="flex gap-8 items-start justify-between">
            {/* Pie Chart with Legend */}
            <div className="flex gap-6 items-start">
              {/* Pie Chart with Center Text */}
              <div className="relative w-[400px] h-[400px] flex-shrink-0">
                <Chart type="doughnut" data={paymentStructureData} options={pieChartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-[18px] text-slate-500">Доходы:</div>
                  <div className="text-[48px] font-semibold text-slate-900">830 000</div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-sm bg-[#4FC3F7] mt-1 flex-shrink-0"></div>
                  <div className="text-[13px]">
                    <div className="text-slate-700">Поступление от заказчиков</div>
                    <div className="font-semibold text-slate-900">750 000 <span className="font-normal text-slate-600">(90.36%)</span></div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-sm bg-[#1E3A8A] mt-1 flex-shrink-0"></div>
                  <div className="text-[13px]">
                    <div className="text-slate-700">Услуги ремонта</div>
                    <div className="font-semibold text-slate-900">80 000 <span className="font-normal text-slate-600">(9.64%)</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="w-[560px] flex-shrink-0">
              <div className="text-[14px] text-slate-600 mb-4">Доходы, ₽</div>
              <div className="mb-4 px-4">
                <RangeSlider
                  range={paymentRange}
                  setRange={setPaymentRange}
                  labels={monthNames}
                  maxValue={11}
                  title="Период"
                />
              </div>
              <div className="h-[350px]">
                <Chart type="bar" data={getPaymentBarChartData(paymentRange)} options={paymentBarChartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Expenses Structure Section */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="text-[16px] font-medium text-slate-900 mb-6 pb-6 border-b border-slate-200">Структура расходов</div>
          
          <div className="flex gap-8 items-start justify-between">
            {/* Pie Chart with Legend */}
            <div className="flex gap-6 items-start">
              {/* Pie Chart with Center Text */}
              <div className="relative w-[400px] h-[400px] flex-shrink-0">
                <Chart type="doughnut" data={expensesStructureData} options={expensesPieChartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-[18px] text-slate-500">Расходы:</div>
                  <div className="text-[48px] font-semibold text-slate-900">329 260</div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-sm bg-[#FFC107] mt-1 flex-shrink-0"></div>
                  <div className="text-[13px]">
                    <div className="text-slate-700">Одежда <span className="font-semibold">200 019</span> (60.75%)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-sm bg-[#FF9800] mt-1 flex-shrink-0"></div>
                  <div className="text-[13px]">
                    <div className="text-slate-700">Реклама <span className="font-semibold">50 000</span> (15.19%)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-sm bg-[#FF5722] mt-1 flex-shrink-0"></div>
                  <div className="text-[13px]">
                    <div className="text-slate-700">Субподряд <span className="font-semibold">32 412</span> (9.84%)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-sm bg-[#FF7043] mt-1 flex-shrink-0"></div>
                  <div className="text-[13px]">
                    <div className="text-slate-700">Монтаж <span className="font-semibold">16 500</span> (5.01%)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-sm bg-[#FFAB91] mt-1 flex-shrink-0"></div>
                  <div className="text-[13px]">
                    <div className="text-slate-700">Проценты по кредитам <span className="font-semibold">15 540</span> (4.72%)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-sm bg-[#BCAAA4] mt-1 flex-shrink-0"></div>
                  <div className="text-[13px]">
                    <div className="text-slate-700">Канцелярия <span className="font-semibold">14 789</span> (4.49%)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="w-[560px] flex-shrink-0">
              <div className="mb-4 px-4">
                <RangeSlider
                  range={expensesRange}
                  setRange={setExpensesRange}
                  labels={monthNames}
                  maxValue={11}
                  title="Период"
                />
              </div>
              <div className="h-[400px]">
                <Chart type="bar" data={getExpensesBarChartData(expensesRange)} options={expensesBarChartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Profitable Clients Section */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
            <span className="text-[16px] font-medium text-slate-900">Самые доходные клиенты, ₽</span>
            <div className="flex bg-slate-100 rounded p-1">
              <button
                onClick={() => setActiveClientMethod('accrual')}
                className={cn(
                  "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                  activeClientMethod === 'accrual'
                    ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]"
                    : "text-slate-600 hover:text-slate-800"
                )}
              >
                Метод начисления
              </button>
              <button
                onClick={() => setActiveClientMethod('cash')}
                className={cn(
                  "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                  activeClientMethod === 'cash'
                    ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]"
                    : "text-slate-600 hover:text-slate-800"
                )}
              >
                Кассовый метод
              </button>
            </div>
          </div>
          <div className="h-[400px]">
            <Chart type="bar" data={getClientsChartData()} options={clientsChartOptions} />
          </div>
        </div>

        {/* Project Profitability Section */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
            <span className="text-[16px] font-medium text-slate-900">Прибыльность проектов</span>
            <div className="flex bg-slate-100 rounded p-1">
              <button
                onClick={() => setActiveClientMethod('accrual')}
                className={cn(
                  "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                  activeClientMethod === 'accrual'
                    ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]"
                    : "text-slate-600 hover:text-slate-800"
                )}
              >
                Метод начисления
              </button>
              <button
                onClick={() => setActiveClientMethod('cash')}
                className={cn(
                  "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                  activeClientMethod === 'cash'
                    ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]"
                    : "text-slate-600 hover:text-slate-800"
                )}
              >
                Кассовый метод
              </button>
            </div>
            <div className="flex bg-slate-100 rounded p-1">
              <button
                onClick={() => setActiveProjectView('profit')}
                className={cn(
                  "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                  activeProjectView === 'profit'
                    ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]"
                    : "text-slate-600 hover:text-slate-800"
                )}
              >
                Сортировка по прибыли
              </button>
              <button
                onClick={() => setActiveProjectView('profitability')}
                className={cn(
                  "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                  activeProjectView === 'profitability'
                    ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]"
                    : "text-slate-600 hover:text-slate-800"
                )}
              >
                По рентабельности
              </button>
            </div>
          </div>
          <div className="h-[450px]">
            <Chart type="bar" data={getProjectsChartData()} options={projectsChartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}
