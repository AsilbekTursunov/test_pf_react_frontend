"use client"

import { useState, useEffect, useRef, useMemo } from 'react'
import { Calendar, ChevronDown, Search, MessageCircle } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarController,
  LineController,
  DoughnutController,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarController,
  LineController,
  DoughnutController
)

// Плагин для пунктирных границ столбцов
const dashedBorderPlugin = {
  id: 'dashedBorder',
  beforeDatasetsDraw(chart) {
    const { ctx, data } = chart
    
    chart.getDatasetMeta(0).data.forEach((bar, index) => {
      const dataset = data.datasets[0]
      if (dataset.borderDash && dataset.borderDash[index] && dataset.borderDash[index].length > 0) {
        ctx.save()
        ctx.setLineDash(dataset.borderDash[index])
        ctx.strokeStyle = dataset.borderColor[index] || dataset.borderColor
        ctx.lineWidth = dataset.borderWidth[index] || dataset.borderWidth || 1
        ctx.strokeRect(bar.x - bar.width/2, bar.y, bar.width, bar.base - bar.y)
        ctx.restore()
      }
    })
    
    chart.getDatasetMeta(1).data.forEach((bar, index) => {
      const dataset = data.datasets[1]
      if (dataset.borderDash && dataset.borderDash[index] && dataset.borderDash[index].length > 0) {
        ctx.save()
        ctx.setLineDash(dataset.borderDash[index])
        ctx.strokeStyle = dataset.borderColor[index] || dataset.borderColor
        ctx.lineWidth = dataset.borderWidth[index] || dataset.borderWidth || 1
        ctx.strokeRect(bar.x - bar.width/2, bar.y, bar.width, bar.base - bar.y)
        ctx.restore()
      }
    })
  }
}

// Плагин для квадратиков в графиках
const squareMarkersPlugin = {
  id: 'squareMarkers',
  afterDatasetsDraw(chart) {
    const { ctx, data } = chart
    
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex)
      if (meta.type === 'bar' && dataset.data) {
        meta.data.forEach((bar, index) => {
          if (dataset.data[index] > 0) {
            // Рисуем случайные квадратики внутри столбцов
            const numSquares = Math.floor(Math.random() * 3) + 1
            for (let i = 0; i < numSquares; i++) {
              const x = bar.x - bar.width/4 + Math.random() * (bar.width/2)
              const y = bar.y + Math.random() * (bar.base - bar.y)
              
              ctx.save()
              ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
              ctx.fillRect(x - 1, y - 1, 2, 2)
              ctx.restore()
            }
          }
        })
      }
    })
  }
}

ChartJS.register(dashedBorderPlugin, squareMarkersPlugin)

export default function DashboardPage() {
  const [activeMethod, setActiveMethod] = useState('accrual')
  const [activeCashFlow, setActiveCashFlow] = useState('general')
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [selectedPeriod, setSelectedPeriod] = useState('months')
  const [selectedEntity, setSelectedEntity] = useState('all')
  const [selectedProject, setSelectedProject] = useState('all')
  const [dateRange, setDateRange] = useState([0, 11]) // 0 = январь, 11 = декабрь
  const [cashFlowDateRange, setCashFlowDateRange] = useState([0, 11]) // Отдельный диапазон для денежного потока
  const [balanceRange, setBalanceRange] = useState([0, 17]) // Диапазон для графика остатков (18 точек)
  const [paymentRange, setPaymentRange] = useState([0, 6]) // Диапазон для графика структуры платежей (7 точек)
  const [expensesRange, setExpensesRange] = useState([0, 6]) // Диапазон для графика расходов
  const [activePaymentView, setActivePaymentView] = useState('income') // Переключатель для структуры платежей
  const [activeClientMethod, setActiveClientMethod] = useState('accrual') // Переключатель для клиентов
  const [activeProjectMethod, setActiveProjectMethod] = useState('accrual') // Переключатель метода для проектов
  const [activeProjectView, setActiveProjectView] = useState('profit') // Переключатель сортировки для проектов
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dateRangeRef = useRef(null)

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          setIsLoading(false)
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  // Close date range dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)) {
        setIsDateRangeOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Simulate data refresh when filters change (but not for date range)
  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true)
      setLoadingProgress(0)
      
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            setIsLoading(false)
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 20
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [selectedPeriod, selectedEntity, selectedProject, activeMethod]) // Removed dateRange from dependencies

  const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  
  const getDateRangeText = () => {
    const startMonth = monthNames[dateRange[0]]
    const endMonth = monthNames[dateRange[1]]
    return `${startMonth} '26–${endMonth} '26`
  }

  const getFilteredData = () => {
    const allData = {
      income: [830, 1200, 950, 800, 900, 1100, 950, 1050, 1150, 1250, 1350, 1400, 1100],
      expenses: [129, 400, 500, 450, 400, 600, 500, 650, 700, 750, 800, 850, 900],
      profit: [701, 800, 450, 350, 500, 500, 450, 400, 450, 500, 550, 550, 200],
      dividends: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -100, -200]
    }

    // Filter data based on date range
    const startIdx = dateRange[0]
    const endIdx = dateRange[1] + 1
    
    return {
      income: allData.income.slice(startIdx, endIdx),
      expenses: allData.expenses.slice(startIdx, endIdx),
      profit: allData.profit.slice(startIdx, endIdx),
      dividends: allData.dividends.slice(startIdx, endIdx)
    }
  }

  // Chart data with dynamic updates based on filters
  const getChartData = () => {
    const filteredData = getFilteredData()
    
    // Apply filter modifications
    let multiplier = 1
    if (selectedEntity === 'prometey') multiplier = 1.2
    if (selectedEntity === 'alekseenko') multiplier = 0.8
    if (selectedProject === 'construction') multiplier *= 1.1
    if (activeMethod === 'cash') multiplier *= 0.9

    // Get labels for the selected range
    const allLabels = ['янв', 'янв\n(план)', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
    const filteredLabels = allLabels.slice(dateRange[0], dateRange[1] + 1)

    // Точные данные как на фото
    const exactData = {
      income: [830, 1500, 950, 1000, 1200, 850, 450, 350, 300, 250, 200, 150, 100],
      expenses: [129, 1352, 500, 450, 400, 300, 200, 150, 100, 80, 60, 50, 40],
      profit: [800, 400, 200, -200, -300, 350, 250, 200, 200, 170, 140, 100, 60],
      dividends: [0, 0, 0, -400, -320, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    const filteredExactData = {
      income: exactData.income.slice(dateRange[0], dateRange[1] + 1),
      expenses: exactData.expenses.slice(dateRange[0], dateRange[1] + 1),
      profit: exactData.profit.slice(dateRange[0], dateRange[1] + 1),
      dividends: exactData.dividends.slice(dateRange[0], dateRange[1] + 1)
    }

    return {
      labels: filteredLabels,
      datasets: [
        {
          type: 'bar',
          label: 'Доходы',
          data: filteredExactData.income,
          backgroundColor: (ctx) => {
            // Проверяем, является ли это плановым столбцом (янв план)
            const isPlanned = ctx.dataIndex === 1 && dateRange[0] <= 1 && dateRange[1] >= 1
            return isPlanned ? 'rgba(79, 195, 247, 0.7)' : '#4FC3F7'
          },
          borderColor: (ctx) => {
            const isPlanned = ctx.dataIndex === 1 && dateRange[0] <= 1 && dateRange[1] >= 1
            return isPlanned ? '#4FC3F7' : 'transparent'
          },
          borderWidth: (ctx) => {
            const isPlanned = ctx.dataIndex === 1 && dateRange[0] <= 1 && dateRange[1] >= 1
            return isPlanned ? 2 : 0
          },
          borderDash: (ctx) => {
            const isPlanned = ctx.dataIndex === 1 && dateRange[0] <= 1 && dateRange[1] >= 1
            return isPlanned ? [5, 5] : []
          },
          borderRadius: 2,
          barThickness: 25,
          order: 2
        },
        {
          type: 'bar',
          label: 'Расходы',
          data: filteredExactData.expenses,
          backgroundColor: (ctx) => {
            const isPlanned = ctx.dataIndex === 1 && dateRange[0] <= 1 && dateRange[1] >= 1
            return isPlanned ? 'rgba(255, 183, 77, 0.7)' : '#FFB74D'
          },
          borderColor: (ctx) => {
            const isPlanned = ctx.dataIndex === 1 && dateRange[0] <= 1 && dateRange[1] >= 1
            return isPlanned ? '#FFB74D' : 'transparent'
          },
          borderWidth: (ctx) => {
            const isPlanned = ctx.dataIndex === 1 && dateRange[0] <= 1 && dateRange[1] >= 1
            return isPlanned ? 2 : 0
          },
          borderDash: (ctx) => {
            const isPlanned = ctx.dataIndex === 1 && dateRange[0] <= 1 && dateRange[1] >= 1
            return isPlanned ? [5, 5] : []
          },
          borderRadius: 2,
          barThickness: 25,
          order: 3
        },
        {
          type: 'line',
          label: 'Чистая прибыль',
          data: filteredExactData.profit,
          borderColor: '#4CAF50',
          backgroundColor: '#4CAF50',
          pointBackgroundColor: (ctx) => {
            return ctx.parsed.y < 0 ? '#F44336' : '#4CAF50'
          },
          pointBorderColor: (ctx) => {
            return ctx.parsed.y < 0 ? '#F44336' : '#4CAF50'
          },
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
          borderDash: [8, 4],
          fill: false,
          tension: 0.1,
          order: 1
        },
        {
          type: 'line',
          label: 'Дивиденды',
          data: filteredExactData.dividends,
          borderColor: '#9C27B0',
          backgroundColor: '#9C27B0',
          pointBackgroundColor: (ctx) => {
            return ctx.parsed.y < 0 ? '#F44336' : '#9C27B0'
          },
          pointBorderColor: (ctx) => {
            return ctx.parsed.y < 0 ? '#F44336' : '#9C27B0'
          },
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
          borderDash: [8, 4],
          fill: false,
          tension: 0.1,
          order: 1
        }
      ]
    }
  }

  // Cash Flow Chart data
  const getCashFlowChartData = () => {
    const cashFlowData = {
      income: [830, 1200, 950, 800, 900, 1100, 950, 1050, 1150, 1250, 1350, 1400, 1100],
      expenses: [324, 800, 600, 500, 400, 600, 500, 650, 700, 750, 800, 850, 900],
      difference: [506, 400, 350, 300, 500, 500, 450, 400, 450, 500, 550, 550, 200]
    }

    const filteredCashFlowData = {
      income: cashFlowData.income.slice(cashFlowDateRange[0], cashFlowDateRange[1] + 1),
      expenses: cashFlowData.expenses.slice(cashFlowDateRange[0], cashFlowDateRange[1] + 1),
      difference: cashFlowData.difference.slice(cashFlowDateRange[0], cashFlowDateRange[1] + 1)
    }

    const allLabels = ['янв', 'янв\n(план)', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
    const filteredLabels = allLabels.slice(cashFlowDateRange[0], cashFlowDateRange[1] + 1)

    return {
      labels: filteredLabels,
      datasets: [
        {
          type: 'bar',
          label: 'Поступления',
          data: filteredCashFlowData.income,
          backgroundColor: (ctx) => {
            const isPlanned = ctx.dataIndex === 1 && cashFlowDateRange[0] <= 1 && cashFlowDateRange[1] >= 1
            return isPlanned ? 'rgba(79, 195, 247, 0.7)' : '#4FC3F7'
          },
          borderColor: (ctx) => {
            const isPlanned = ctx.dataIndex === 1 && cashFlowDateRange[0] <= 1 && cashFlowDateRange[1] >= 1
            return isPlanned ? '#4FC3F7' : 'transparent'
          },
          borderWidth: (ctx) => {
            const isPlanned = ctx.dataIndex === 1 && cashFlowDateRange[0] <= 1 && cashFlowDateRange[1] >= 1
            return isPlanned ? 2 : 0
          },
          borderDash: (ctx) => {
            const isPlanned = ctx.dataIndex === 1 && cashFlowDateRange[0] <= 1 && cashFlowDateRange[1] >= 1
            return isPlanned ? [5, 5] : []
          },
          borderRadius: 2,
          barThickness: 25,
          order: 2
        },
        {
          type: 'bar',
          label: 'Выплаты',
          data: filteredCashFlowData.expenses,
          backgroundColor: (ctx) => {
            const isPlanned = ctx.dataIndex === 1 && cashFlowDateRange[0] <= 1 && cashFlowDateRange[1] >= 1
            return isPlanned ? 'rgba(255, 183, 77, 0.7)' : '#FFB74D'
          },
          borderColor: (ctx) => {
            const isPlanned = ctx.dataIndex === 1 && cashFlowDateRange[0] <= 1 && cashFlowDateRange[1] >= 1
            return isPlanned ? '#FFB74D' : 'transparent'
          },
          borderWidth: (ctx) => {
            const isPlanned = ctx.dataIndex === 1 && cashFlowDateRange[0] <= 1 && cashFlowDateRange[1] >= 1
            return isPlanned ? 2 : 0
          },
          borderDash: (ctx) => {
            const isPlanned = ctx.dataIndex === 1 && cashFlowDateRange[0] <= 1 && cashFlowDateRange[1] >= 1
            return isPlanned ? [5, 5] : []
          },
          borderRadius: 2,
          barThickness: 25,
          order: 3
        },
        {
          type: 'line',
          label: 'Разница',
          data: filteredCashFlowData.difference,
          borderColor: '#4CAF50',
          backgroundColor: '#4CAF50',
          pointBackgroundColor: (ctx) => {
            return ctx.parsed.y < 0 ? '#F44336' : '#4CAF50'
          },
          pointBorderColor: (ctx) => {
            return ctx.parsed.y < 0 ? '#F44336' : '#4CAF50'
          },
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
          borderDash: [8, 4],
          fill: false,
          tension: 0.1,
          order: 1
        }
      ]
    }
  }

  const cashFlowChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
      easing: 'easeInOutQuart'
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        padding: 12,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${Math.abs(context.parsed.y).toLocaleString()}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          },
          maxRotation: 0,
          callback: function(value, index) {
            const label = this.getLabelForValue(value)
            return label.replace('\n', ' ')
          }
        }
      },
      y: {
        beginAtZero: false,
        min: -500,
        max: 1400,
        grid: {
          color: '#f1f5f9',
          drawBorder: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          },
          stepSize: 500,
          callback: function(value) {
            if (value >= 1000) return `${value/1000} млн`
            if (value >= 500 || value <= -500) return `${value} тыс`
            if (value === 0) return '0'
            return value
          }
        },
        position: 'left'
      }
    },
    elements: {
      bar: {
        borderSkipped: false,
      }
    }
  }

  // Balance Chart data
  const getBalanceChartData = () => {
    const balanceData = [
      3000, 3100, 2600, 2400, 2200, 1800, 1600, 1400, 1200, 1000, 800, -800, -1200, -600, 1800, 2000, 2200, 1900
    ]
    
    const balanceLabels = [
      '1 янв', '22 янв', '13 фев', '7 мар', '26 мар', '29 мар', '20 апр', '6 мая', 
      '3 июн', '26 июл', '17 авг', '8 авг', '30 авг', '21 сен', '13 окт', '4 ноя', '26 ноя', '18 дек'
    ]

    const filteredData = balanceData.slice(balanceRange[0], balanceRange[1] + 1)
    const filteredLabels = balanceLabels.slice(balanceRange[0], balanceRange[1] + 1)

    return {
      labels: filteredLabels,
      datasets: [
        {
          label: 'Общий остаток',
          data: filteredData,
          borderColor: '#4CAF50',
          backgroundColor: (context) => {
            if (!context.chart.chartArea) return 'rgba(76, 175, 80, 0.3)'
            
            const {ctx, data, chartArea} = context.chart
            const gradientBg = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
            
            // Находим позицию нулевой линии
            const yScale = context.chart.scales.y
            const zeroPixel = yScale.getPixelForValue(0)
            const topPixel = chartArea.top
            const bottomPixel = chartArea.bottom
            
            // Вычисляем относительную позицию нуля
            const zeroPosition = (zeroPixel - topPixel) / (bottomPixel - topPixel)
            
            // Создаем градиент: зеленый сверху до нуля, красный снизу от нуля
            gradientBg.addColorStop(0, 'rgba(76, 175, 80, 0.3)')
            gradientBg.addColorStop(Math.max(0, Math.min(1, zeroPosition)), 'rgba(76, 175, 80, 0.3)')
            gradientBg.addColorStop(Math.max(0, Math.min(1, zeroPosition)), 'rgba(244, 67, 54, 0.3)')
            gradientBg.addColorStop(1, 'rgba(244, 67, 54, 0.3)')
            
            return gradientBg
          },
          pointBackgroundColor: (context) => {
            const value = context.parsed?.y
            return value >= 0 ? '#4CAF50' : '#F44336'
          },
          pointBorderColor: (context) => {
            const value = context.parsed?.y
            return value >= 0 ? '#4CAF50' : '#F44336'
          },
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
          fill: 'origin',
          tension: 0.1,
          segment: {
            borderColor: (context) => {
              const current = context.p1.parsed.y
              const previous = context.p0.parsed.y
              // Если оба значения положительные - зеленый
              if (current >= 0 && previous >= 0) return '#4CAF50'
              // Если оба отрицательные - красный
              if (current < 0 && previous < 0) return '#F44336'
              // Переходный сегмент - зеленый
              return '#4CAF50'
            }
          }
        }
      ]
    }
  }

  const balanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
      easing: 'easeInOutQuart'
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        padding: 12,
        callbacks: {
          title: function(context) {
            return `Общий остаток`
          },
          label: function(context) {
            return `${context.parsed.y.toLocaleString()} ₽`
          },
          filter: function(tooltipItem) {
            // Показываем только непустые значения
            return tooltipItem.parsed.y !== null
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 10
          },
          maxRotation: 45,
          callback: function(value, index) {
            const label = this.getLabelForValue(value)
            return label
          }
        }
      },
      y: {
        beginAtZero: false,
        min: -2000,
        max: 4000,
        grid: {
          color: '#f1f5f9',
          drawBorder: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          },
          stepSize: 1000,
          callback: function(value) {
            if (value >= 1000) return `${value/1000} млн`
            if (value <= -1000) return `${value/1000} млн`
            if (value === 0) return '0'
            return value
          }
        },
        position: 'left'
      }
    },
    elements: {
      point: {
        hoverRadius: 5
      }
    }
  }

  // Memoized chart data for better performance
  const chartData = useMemo(() => getChartData(), [dateRange, selectedEntity, selectedProject, activeMethod])
  const cashFlowChartData = useMemo(() => getCashFlowChartData(), [cashFlowDateRange, activeCashFlow])
  const balanceChartData = useMemo(() => getBalanceChartData(), [balanceRange])

  // Payment Structure Data
  const paymentStructureData = {
    labels: ['Поступления от заказчиков', 'Услуги ремонта'],
    datasets: [
      {
        data: [750000, 80000],
        backgroundColor: ['#4FC3F7', '#1976D2'],
        borderWidth: 0,
        cutout: '60%'
      }
    ]
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(2)
            return `${context.label}: ${context.parsed.toLocaleString()} ₽ (${percentage}%)`
          }
        }
      }
    }
  }

  // Payment Bar Chart Data
  const paymentBarChartData = {
    labels: ['янв\n(факт)', 'фев', 'апр', 'июн', 'авг', 'окт', 'дек'],
    datasets: [
      {
        label: 'Основная часть',
        data: [650, 1200, 700, 600, 0, 0, 0],
        backgroundColor: ['#4FC3F7', 'rgba(79, 195, 247, 0.7)', 'rgba(79, 195, 247, 0.7)', 'rgba(79, 195, 247, 0.7)', 'rgba(79, 195, 247, 0.7)', 'rgba(79, 195, 247, 0.7)', 'rgba(79, 195, 247, 0.7)'],
        borderColor: ['transparent', '#4FC3F7', '#4FC3F7', '#4FC3F7', '#4FC3F7', '#4FC3F7', '#4FC3F7'],
        borderWidth: [0, 2, 2, 2, 2, 2, 2],
        borderDash: [[], [5, 5], [5, 5], [5, 5], [5, 5], [5, 5], [5, 5]],
        borderRadius: 0,
        barThickness: 60,
        order: 2
      },
      {
        label: 'Дополнительная часть',
        data: [150, 250, 250, 300, 0, 0, 0],
        backgroundColor: ['#1976D2', 'rgba(25, 118, 210, 0.7)', 'rgba(25, 118, 210, 0.7)', 'rgba(25, 118, 210, 0.7)', 'rgba(25, 118, 210, 0.7)', 'rgba(25, 118, 210, 0.7)', 'rgba(25, 118, 210, 0.7)'],
        borderColor: ['transparent', '#1976D2', '#1976D2', '#1976D2', '#1976D2', '#1976D2', '#1976D2'],
        borderWidth: [0, 2, 2, 2, 2, 2, 2],
        borderDash: [[], [5, 5], [5, 5], [5, 5], [5, 5], [5, 5], [5, 5]],
        borderRadius: 0,
        barThickness: 60,
        order: 1
      }
    ]
  }

  // Payment Bar Chart Data with filtering
  const getPaymentBarChartData = () => {
    const allLabels = ['янв\n(факт)', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
    const allData1 = [650, 1200, 800, 700, 600, 500, 400, 300, 200, 100, 50, 0]
    const allData2 = [150, 250, 200, 250, 300, 250, 200, 150, 100, 50, 25, 0]
    
    const filteredLabels = allLabels.slice(paymentRange[0], paymentRange[1] + 1)
    const filteredData1 = allData1.slice(paymentRange[0], paymentRange[1] + 1)
    const filteredData2 = allData2.slice(paymentRange[0], paymentRange[1] + 1)
    
    // Create background colors and border properties based on filtered data
    const backgroundColors1 = filteredData1.map((_, idx) => 
      idx === 0 && paymentRange[0] === 0 ? '#4FC3F7' : 'rgba(79, 195, 247, 0.7)'
    )
    const backgroundColors2 = filteredData2.map((_, idx) => 
      idx === 0 && paymentRange[0] === 0 ? '#1976D2' : 'rgba(25, 118, 210, 0.7)'
    )
    const borderColors1 = filteredData1.map((_, idx) => 
      idx === 0 && paymentRange[0] === 0 ? 'transparent' : '#4FC3F7'
    )
    const borderColors2 = filteredData2.map((_, idx) => 
      idx === 0 && paymentRange[0] === 0 ? 'transparent' : '#1976D2'
    )
    const borderWidths1 = filteredData1.map((_, idx) => 
      idx === 0 && paymentRange[0] === 0 ? 0 : 2
    )
    const borderWidths2 = filteredData2.map((_, idx) => 
      idx === 0 && paymentRange[0] === 0 ? 0 : 2
    )
    const borderDashes1 = filteredData1.map((_, idx) => 
      idx === 0 && paymentRange[0] === 0 ? [] : [5, 5]
    )
    const borderDashes2 = filteredData2.map((_, idx) => 
      idx === 0 && paymentRange[0] === 0 ? [] : [5, 5]
    )

    return {
      labels: filteredLabels,
      datasets: [
        {
          label: 'Основная часть',
          data: filteredData1,
          backgroundColor: backgroundColors1,
          borderColor: borderColors1,
          borderWidth: borderWidths1,
          borderDash: borderDashes1,
          borderRadius: 0,
          barThickness: Math.max(20, Math.min(60, 400 / filteredLabels.length)),
          order: 2
        },
        {
          label: 'Дополнительная часть',
          data: filteredData2,
          backgroundColor: backgroundColors2,
          borderColor: borderColors2,
          borderWidth: borderWidths2,
          borderDash: borderDashes2,
          borderRadius: 0,
          barThickness: Math.max(20, Math.min(60, 400 / filteredLabels.length)),
          order: 1
        }
      ]
    }
  }

  // Expenses Structure Data
  const expensesStructureData = {
    labels: ['Реклама', 'Субподряд', 'Аренда', 'Проценты по кредиту', 'Канцелярия'],
    datasets: [
      {
        data: [50000, 32412, 16500, 15540, 14789],
        backgroundColor: ['#FFC107', '#FF9800', '#FF5722', '#FF7043', '#FFAB91'],
        borderWidth: 0,
        cutout: '60%'
      }
    ]
  }

  const expensesPieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((context.parsed / total) * 100).toFixed(2)
            return `${context.label}: ${context.parsed.toLocaleString()} ₽ (${percentage}%)`
          }
        }
      }
    }
  }

  // Expenses Bar Chart Data with filtering
  const getExpensesBarChartData = () => {
    const allLabels = ['янв\n(факт)', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
    
    // Данные для разных категорий расходов (стек из 5 категорий)
    const allReклама = [50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0, 0]
    const allСубподряд = [32, 30, 28, 25, 22, 20, 18, 15, 12, 10, 8, 5]
    const allАренда = [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16]
    const allПроценты = [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]
    const allКанцелярия = [14, 12, 10, 8, 6, 4, 2, 1, 1, 1, 1, 1]
    
    const filteredLabels = allLabels.slice(expensesRange[0], expensesRange[1] + 1)
    const filteredРеклама = allReклама.slice(expensesRange[0], expensesRange[1] + 1)
    const filteredСубподряд = allСубподряд.slice(expensesRange[0], expensesRange[1] + 1)
    const filteredАренда = allАренда.slice(expensesRange[0], expensesRange[1] + 1)
    const filteredПроценты = allПроценты.slice(expensesRange[0], expensesRange[1] + 1)
    const filteredКанцелярия = allКанцелярия.slice(expensesRange[0], expensesRange[1] + 1)

    return {
      labels: filteredLabels,
      datasets: [
        {
          label: 'Реклама',
          data: filteredРеклама,
          backgroundColor: '#FFC107',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          barThickness: Math.max(20, Math.min(60, 400 / filteredLabels.length)),
          order: 1
        },
        {
          label: 'Субподряд',
          data: filteredСубподряд,
          backgroundColor: '#FF9800',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          barThickness: Math.max(20, Math.min(60, 400 / filteredLabels.length)),
          order: 2
        },
        {
          label: 'Аренда',
          data: filteredАренда,
          backgroundColor: '#FF5722',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          barThickness: Math.max(20, Math.min(60, 400 / filteredLabels.length)),
          order: 3
        },
        {
          label: 'Проценты по кредиту',
          data: filteredПроценты,
          backgroundColor: '#FF7043',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          barThickness: Math.max(20, Math.min(60, 400 / filteredLabels.length)),
          order: 4
        },
        {
          label: 'Канцелярия',
          data: filteredКанцелярия,
          backgroundColor: '#FFAB91',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          barThickness: Math.max(20, Math.min(60, 400 / filteredLabels.length)),
          order: 5
        }
      ]
    }
  }

  const expensesBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
      easing: 'easeInOutQuart'
    },
    plugins: {
      squareMarkers: {
        enabled: true
      },
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            const total = context.chart.data.datasets.reduce((sum, dataset) => {
              return sum + (dataset.data[context.dataIndex] || 0)
            }, 0)
            return `Общие расходы: ${total.toLocaleString()} тыс ₽`
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          },
          maxRotation: 0,
          callback: function(value, index) {
            const label = this.getLabelForValue(value)
            return label.replace('\n', ' ')
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: 150,
        grid: {
          color: '#f1f5f9',
          drawBorder: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          },
          stepSize: 25,
          callback: function(value) {
            if (value >= 100) return `${value} тыс`
            if (value >= 25) return `${value} тыс`
            if (value === 0) return '0'
            return value
          }
        },
        position: 'left'
      }
    },
    elements: {
      bar: {
        borderSkipped: false,
      }
    }
  }

  // Clients Chart Data
  const getClientsChartData = () => {
    const clientsData = [
      { name: 'ООО "Компания"', revenue: 750, percentage: 85 },
      { name: 'Королев А. А.', revenue: 95, percentage: 100 }
    ]

    const labels = clientsData.map(client => client.name)
    const revenueData = clientsData.map(client => client.revenue)
    const percentageData = clientsData.map(client => client.percentage)

    return {
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: 'Высокодоходные клиенты',
          data: revenueData.map((revenue, index) => 
            clientsData[index].percentage >= 80 ? revenue : 0
          ),
          backgroundColor: '#4FC3F7',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          barThickness: 120,
          order: 2,
          yAxisID: 'y'
        },
        {
          type: 'bar',
          label: 'Низкодоходные клиенты',
          data: revenueData.map((revenue, index) => 
            clientsData[index].percentage < 80 ? revenue : 0
          ),
          backgroundColor: '#9C27B0',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          barThickness: 120,
          order: 3,
          yAxisID: 'y'
        },
        {
          type: 'line',
          label: 'Доля доходов с накопительным итогом',
          data: percentageData,
          borderColor: '#2196F3',
          backgroundColor: '#2196F3',
          pointBackgroundColor: '#2196F3',
          pointBorderColor: '#2196F3',
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
          fill: false,
          tension: 0.1,
          order: 1,
          yAxisID: 'y1'
        }
      ]
    }
  }

  const clientsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
      easing: 'easeInOutQuart'
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        padding: 12,
        callbacks: {
          title: function(context) {
            return context[0].label
          },
          label: function(context) {
            if (context.dataset.type === 'line') {
              return `Накопительная доля: ${context.parsed.y}%`
            } else {
              return `Доходы: ${context.parsed.y.toLocaleString()} тыс ₽`
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          },
          maxRotation: 0,
          callback: function(value, index) {
            const label = this.getLabelForValue(value)
            // Обрезаем длинные названия
            if (label.length > 15) {
              return label.substring(0, 12) + '...'
            }
            return label
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        max: 800,
        grid: {
          color: '#f1f5f9',
          drawBorder: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          },
          stepSize: 100,
          callback: function(value) {
            if (value >= 700) return `${value} тыс`
            if (value >= 100) return `${value} тыс`
            if (value === 0) return '0'
            return value
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          },
          stepSize: 10,
          callback: function(value) {
            return `${value}%`
          }
        }
      }
    },
    elements: {
      bar: {
        borderSkipped: false,
      },
      point: {
        hoverRadius: 6
      }
    }
  }

  // Projects Chart Data
  const getProjectsChartData = () => {
    const projectsData = [
      { 
        name: 'Загородный дом Михайлова 1', 
        plannedProfit: 700, 
        actualProfit: 650, 
        plannedProfitability: 85, 
        actualProfitability: 80 
      },
      { 
        name: 'Лоджия 10', 
        plannedProfit: 50, 
        actualProfit: 45, 
        plannedProfitability: 25, 
        actualProfitability: 20 
      },
      { 
        name: 'Дом Королев 63', 
        plannedProfit: -150, 
        actualProfit: -180, 
        plannedProfitability: -15, 
        actualProfitability: -20 
      },
      { 
        name: 'Отделка', 
        plannedProfit: 420, 
        actualProfit: 380, 
        plannedProfitability: 60, 
        actualProfitability: 55 
      },
      { 
        name: 'Загородный дом Михайлова 63', 
        plannedProfit: 650, 
        actualProfit: 620, 
        plannedProfitability: 75, 
        actualProfitability: 70 
      },
      { 
        name: 'Новостройка 11', 
        plannedProfit: -100, 
        actualProfit: -120, 
        plannedProfitability: -10, 
        actualProfitability: -15 
      },
      { 
        name: 'Кухня Михайлова 43', 
        plannedProfit: 50, 
        actualProfit: 45, 
        plannedProfitability: 15, 
        actualProfitability: 12 
      }
    ]

    const labels = projectsData.map(project => {
      // Обрезаем длинные названия для отображения
      if (project.name.length > 20) {
        return project.name.substring(0, 17) + '...'
      }
      return project.name
    })

    return {
      labels: labels,
      datasets: [
        {
          type: 'bar',
          label: 'Плановая прибыль',
          data: projectsData.map(p => p.plannedProfit),
          backgroundColor: '#81C784',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          barThickness: 40,
          order: 4,
          yAxisID: 'y'
        },
        {
          type: 'bar',
          label: 'Фактическая прибыль',
          data: projectsData.map(p => p.actualProfit),
          backgroundColor: '#4CAF50',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          barThickness: 40,
          order: 3,
          yAxisID: 'y'
        },
        {
          type: 'bar',
          label: 'Плановая рентабельность',
          data: projectsData.map(p => p.plannedProfitability),
          backgroundColor: '#A5D6A7',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          barThickness: 40,
          order: 2,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'Фактическая рентабельность',
          data: projectsData.map(p => p.actualProfitability),
          backgroundColor: '#4FC3F7',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 0,
          barThickness: 40,
          order: 1,
          yAxisID: 'y1'
        }
      ]
    }
  }

  const projectsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
      easing: 'easeInOutQuart'
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        padding: 12,
        callbacks: {
          title: function(context) {
            return context[0].label
          },
          label: function(context) {
            const value = context.parsed.y
            if (context.dataset.yAxisID === 'y1') {
              return `${context.dataset.label}: ${value}%`
            } else {
              return `${context.dataset.label}: ${value.toLocaleString()} тыс ₽`
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 10
          },
          maxRotation: 45,
          callback: function(value, index) {
            const label = this.getLabelForValue(value)
            return label
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: false,
        min: -600,
        max: 800,
        grid: {
          color: '#f1f5f9',
          drawBorder: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          },
          stepSize: 200,
          callback: function(value) {
            if (value >= 600) return `${value} тыс`
            if (value >= 200 || value <= -200) return `${value} тыс`
            if (value === 0) return '0'
            return value
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: false,
        min: -100,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          },
          stepSize: 25,
          callback: function(value) {
            return `${value}%`
          }
        }
      }
    },
    elements: {
      bar: {
        borderSkipped: false,
      }
    }
  }

  const paymentBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            const total = context.chart.data.datasets.reduce((sum, dataset) => {
              return sum + (dataset.data[context.dataIndex] || 0)
            }, 0)
            return `Общий доход: ${total.toLocaleString()} тыс ₽`
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          },
          maxRotation: 0,
          callback: function(value, index) {
            const label = this.getLabelForValue(value)
            return label.replace('\n', ' ')
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        max: 1600,
        grid: {
          color: '#f1f5f9',
          drawBorder: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          },
          stepSize: 200,
          callback: function(value) {
            if (value >= 1000) return `${value/1000} млн`
            if (value >= 200) return `${value} тыс`
            if (value === 0) return '0'
            return value
          }
        },
        position: 'left'
      }
    },
    elements: {
      bar: {
        borderSkipped: false,
      }
    }
  }

  // Memoized date range text
  const dateRangeText = useMemo(() => getDateRangeText(), [dateRange])
  const cashFlowDateRangeText = useMemo(() => {
    const startMonth = monthNames[cashFlowDateRange[0]]
    const endMonth = monthNames[cashFlowDateRange[1]]
    return `${startMonth} - ${endMonth}`
  }, [cashFlowDateRange])
  const balanceRangeText = useMemo(() => {
    const balanceLabels = [
      '1 янв', '22 янв', '13 фев', '7 мар', '26 мар', '29 мар', '20 апр', '6 мая', 
      '3 июн', '26 июл', '17 авг', '8 авг', '30 авг', '21 сен', '13 окт', '4 ноя', '26 ноя', '18 дек'
    ]
    return `${balanceLabels[balanceRange[0]]} - ${balanceLabels[balanceRange[1]]}`
  }, [balanceRange])
  const paymentRangeText = useMemo(() => {
    const startMonth = monthNames[paymentRange[0]]
    const endMonth = monthNames[paymentRange[1]]
    return `${startMonth} - ${endMonth}`
  }, [paymentRange])
  const expensesRangeText = useMemo(() => {
    const startMonth = monthNames[expensesRange[0]]
    const endMonth = monthNames[expensesRange[1]]
    return `${startMonth} - ${endMonth}`
  }, [expensesRange])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 300,
      easing: 'easeInOutQuart'
    },
    transitions: {
      active: {
        animation: {
          duration: 200
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        padding: 12,
        titleFont: {
          size: 12,
          weight: 'normal'
        },
        bodyFont: {
          size: 13,
          weight: 'bold'
        },
        callbacks: {
          title: function(context) {
            const label = context[0].label
            if (label.includes('план')) {
              return `${label.replace('\n', ' ')}`
            }
            return label
          },
          label: function(context) {
            const value = context.parsed.y
            if (context.dataset.label === 'Расходы' && context.label.includes('план')) {
              return `${context.dataset.label} за ${context.label.replace('\n', ' ')}\n${Math.abs(value).toLocaleString()}`
            }
            return `${context.dataset.label}: ${Math.abs(value).toLocaleString()}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          },
          maxRotation: 0,
          callback: function(value, index) {
            const label = this.getLabelForValue(value)
            return label.replace('\n', ' ')
          }
        }
      },
      y: {
        beginAtZero: false,
        min: -600,
        max: 1600,
        grid: {
          color: '#f1f5f9',
          drawBorder: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11
          },
          stepSize: 500,
          callback: function(value) {
            if (value >= 1000) return `${value/1000} млн`
            if (value >= 500 || value <= -500) return `${value} тыс`
            if (value === 0) return '0'
            return value
          }
        },
        position: 'left'
      }
    },
    elements: {
      bar: {
        borderSkipped: false,
      },
      point: {
        hoverRadius: 6
      }
    }
  }

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
        {/* Page Header */}
        <div className="mb-2">
          <h1 className="text-[24px] font-bold text-slate-900 mb-1">Строительство и ремонт под ключ</h1>
          <p className="text-[13px] text-slate-500">13 января 2026 года, вторник</p>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-3">
          {/* Date Range with Dropdown */}
          <div className="relative" ref={dateRangeRef}>
            <button 
              onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
              className="flex items-center gap-2 bg-white border border-slate-300 rounded px-3 py-2 hover:bg-slate-50 transition-colors"
            >
              <Calendar size={14} className="text-slate-400" />
              <span className="text-[13px] text-slate-700">{dateRangeText}</span>
              <ChevronDown size={12} className={cn("text-slate-400 transition-transform", isDateRangeOpen && "rotate-180")} />
            </button>

            {/* Date Range Dropdown */}
            {isDateRangeOpen && (
              <div className="absolute top-full left-0 mt-2 w-[300px] bg-white rounded-lg shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-50 mb-2">
                  <span className="text-[13px] font-semibold text-slate-800">Выберите период</span>
                </div>
                
                {/* Month Grid */}
                <div className="px-4">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {monthNames.map((month, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (dateRange[0] === index && dateRange[1] === index) {
                            // Если уже выбран только этот месяц, сбрасываем на весь год
                            setDateRange([0, 11])
                          } else if (dateRange[0] <= index && dateRange[1] >= index) {
                            // Если месяц в текущем диапазоне, выбираем только его
                            setDateRange([index, index])
                          } else {
                            // Иначе расширяем диапазон
                            setDateRange([
                              Math.min(dateRange[0], index),
                              Math.max(dateRange[1], index)
                            ])
                          }
                        }}
                        className={cn(
                          "px-3 py-2 text-[12px] rounded transition-colors text-center",
                          dateRange[0] <= index && dateRange[1] >= index
                            ? "bg-[#17a2b8] text-white"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                        )}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setDateRange([0, 11])}
                      className="text-[12px] text-[#17a2b8] hover:underline"
                    >
                      Весь год
                    </button>
                    <button
                      onClick={() => setIsDateRangeOpen(false)}
                      className="px-3 py-1 text-[12px] bg-[#17a2b8] text-white rounded hover:bg-[#138496] transition-colors"
                    >
                      Применить
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* По месяцам */}
          <div className="relative">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded px-3 py-2 pr-8 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <option value="months">По месяцам</option>
              <option value="quarters">По кварталам</option>
              <option value="years">По годам</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Юрлица и счета */}
          <div className="relative">
            <select 
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded px-3 py-2 pr-8 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <option value="all">Юрлица и счета</option>
              <option value="prometey">ООО "Прометей"</option>
              <option value="alekseenko">ИП Алексеенко М.Ф.</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Проекты */}
          <div className="relative">
            <select 
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded px-3 py-2 pr-8 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <option value="all">Проекты</option>
              <option value="construction">Строительство</option>
              <option value="repair">Ремонт</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Сделки */}
          <div className="relative">
            <button className="flex items-center gap-2 bg-white border border-slate-300 rounded px-3 py-2 hover:bg-slate-50 transition-colors">
              <span className="text-[13px] text-slate-700">Сделки</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>
          </div>

        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-6 py-6">
        {/* Method Toggle */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
          <span className="text-[14px] font-medium text-slate-900">Прибыль, ₽</span>
          <div className="flex bg-slate-100 rounded p-1">
            <button
              onClick={() => setActiveMethod('accrual')}
              className={cn(
                "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                activeMethod === 'accrual' 
                  ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]" 
                  : "text-slate-600 hover:text-slate-800"
              )}
            >
              Метод начисления
            </button>
            <button
              onClick={() => setActiveMethod('cash')}
              className={cn(
                "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                activeMethod === 'cash' 
                  ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]" 
                  : "text-slate-600 hover:text-slate-800"
              )}
            >
              Кассовый метод
            </button>
          </div>
        </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8 mb-12">
        {/* Left Sidebar - Metrics */}
        <div className="col-span-4 space-y-8">
          {/* Доходы */}
          <div className="flex justify-between items-start">
            <div className="text-[16px] text-slate-600 font-normal">Доходы</div>
            <div className="text-right">
              <div className="text-[48px] font-bold text-slate-900 leading-none mb-1">830 000</div>
              <div className="text-[16px] text-blue-600 font-medium">4 090 000 <span className="text-slate-400">- по плану</span></div>
            </div>
          </div>

          {/* Расходы */}
          <div className="flex justify-between items-start">
            <div className="text-[16px] text-slate-600 font-normal">Расходы</div>
            <div className="text-right">
              <div className="text-[48px] font-bold text-slate-900 leading-none mb-1">129 241</div>
              <div className="text-[16px] text-blue-600 font-medium">4 391 560 <span className="text-slate-400">- по плану</span></div>
            </div>
          </div>

          {/* Чистая прибыль */}
          <div className="flex justify-between items-start">
            <div className="text-[16px] text-slate-600 font-normal">Чистая прибыль</div>
            <div className="text-right">
              <div className="text-[48px] font-bold text-slate-900 leading-none mb-1">700 759</div>
              <div className="text-[16px] text-blue-600 font-medium">-301 560 <span className="text-slate-400">- по плану</span></div>
            </div>
          </div>

          {/* Рентабельность */}
          <div className="flex justify-between items-start">
            <div className="text-[16px] text-slate-600 font-normal">Рентабельность, %</div>
            <div className="text-right">
              <div className="text-[48px] font-bold text-slate-900 leading-none mb-1">84.43%</div>
              <div className="text-[16px] text-blue-600 font-medium">-7.37% <span className="text-slate-400">- по плану</span></div>
            </div>
          </div>

          {/* Дивиденды */}
          <div className="flex justify-between items-start">
            <div className="text-[16px] text-slate-600 font-normal">Дивиденды</div>
            <div className="text-right">
              <div className="text-[48px] font-bold text-slate-900 leading-none mb-1">0</div>
              <div className="text-[16px] text-blue-600 font-medium">300 000 <span className="text-slate-400">- по плану</span></div>
            </div>
          </div>
        </div>

        {/* Right Content - Chart Area */}
        <div className="col-span-8">
          {/* Range Slider above chart */}
          <div className="mb-4 px-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-slate-500">Период отображения</span>
              <span className="text-[12px] text-slate-600 font-medium">
                {monthNames[dateRange[0]]} - {monthNames[dateRange[1]]}
              </span>
            </div>
            
            {/* Compact Range Slider */}
            <div className="relative">
              {/* Month labels */}
              <div className="flex justify-between text-[10px] text-slate-400 mb-2">
                {monthNames.map((month, idx) => (
                  <span key={idx} className="w-8 text-center">{month}</span>
                ))}
              </div>
              
              {/* Slider track */}
              <div className="relative h-1 bg-slate-300 rounded-full">
                {/* Active range */}
                <div 
                  className="absolute h-1 bg-slate-400 rounded-full transition-all duration-150"
                  style={{
                    left: `${(dateRange[0] / 11) * 100}%`,
                    width: `${((dateRange[1] - dateRange[0]) / 11) * 100}%`
                  }}
                />
                
                {/* Start handle */}
                <input
                  type="range"
                  min="0"
                  max="11"
                  value={dateRange[0]}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onChange={(e) => {
                    const newStart = parseInt(e.target.value)
                    if (newStart <= dateRange[1]) {
                      setDateRange([newStart, dateRange[1]])
                    }
                  }}
                  className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer photo-range-slider"
                  style={{ zIndex: 2 }}
                />
                
                {/* End handle */}
                <input
                  type="range"
                  min="0"
                  max="11"
                  value={dateRange[1]}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onChange={(e) => {
                    const newEnd = parseInt(e.target.value)
                    if (newEnd >= dateRange[0]) {
                      setDateRange([dateRange[0], newEnd])
                    }
                  }}
                  className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer photo-range-slider"
                  style={{ zIndex: 1 }}
                />
                
                {/* Visual handles - круглые серые ручки как на фото */}
                <div 
                  className="absolute w-5 h-5 bg-white border-2 border-slate-400 rounded-full shadow-sm transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 hover:border-slate-500 hover:shadow-md"
                  style={{ 
                    left: `${(dateRange[0] / 11) * 100}%`,
                    top: '50%',
                    zIndex: 3,
                    pointerEvents: 'none'
                  }}
                />
                <div 
                  className="absolute w-5 h-5 bg-white border-2 border-slate-400 rounded-full shadow-sm transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 hover:border-slate-500 hover:shadow-md"
                  style={{ 
                    left: `${(dateRange[1] / 11) * 100}%`,
                    top: '50%',
                    zIndex: 3,
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="h-[450px] relative">
            <Chart type="bar" data={chartData} options={chartOptions} />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-8 mt-6 text-[12px]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-[#4FC3F7] rounded-sm"></div>
              <span className="text-slate-700">Доходы</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-[#FFB74D] rounded-sm"></div>
              <span className="text-slate-700">Расходы</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#4CAF50] rounded-full"></div>
              <span className="text-slate-700">Чистая прибыль</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#9C27B0] rounded-full"></div>
              <span className="text-slate-700">Дивиденды</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Section */}
      <div className="pt-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
          <span className="text-[14px] font-medium text-slate-900">Денежный поток, ₽</span>
          <div className="flex bg-slate-100 rounded p-1">
            <button
              onClick={() => setActiveCashFlow('general')}
              className={cn(
                "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                activeCashFlow === 'general' 
                  ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]" 
                  : "text-slate-600 hover:text-slate-800"
              )}
            >
              Общий
            </button>
            <button
              onClick={() => setActiveCashFlow('operational')}
              className={cn(
                "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                activeCashFlow === 'operational' 
                  ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]" 
                  : "text-slate-600 hover:text-slate-800"
              )}
            >
              Операционный
            </button>
            <button
              onClick={() => setActiveCashFlow('investment')}
              className={cn(
                "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                activeCashFlow === 'investment' 
                  ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]" 
                  : "text-slate-600 hover:text-slate-800"
              )}
            >
              Инвестиционный
            </button>
            <button
              onClick={() => setActiveCashFlow('financial')}
              className={cn(
                "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                activeCashFlow === 'financial' 
                  ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]" 
                  : "text-slate-600 hover:text-slate-800"
              )}
            >
              Финансовый
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Panel - Cash Flow Metrics */}
          <div className="col-span-4 space-y-8">
            {/* Поступления */}
            <div className="flex justify-between items-start">
              <div className="text-[16px] text-slate-600 font-normal">Поступления</div>
              <div className="text-right">
                <div className="text-[48px] font-bold text-slate-900 leading-none mb-1">830 000</div>
                <div className="text-[16px] text-blue-600 font-medium">7 238 620 <span className="text-slate-400">- по плану</span></div>
              </div>
            </div>

            {/* Выплаты */}
            <div className="flex justify-between items-start">
              <div className="text-[16px] text-slate-600 font-normal">Выплаты</div>
              <div className="text-right">
                <div className="text-[48px] font-bold text-slate-900 leading-none mb-1">324 801</div>
                <div className="text-[16px] text-blue-600 font-medium">7 798 140 <span className="text-slate-400">- по плану</span></div>
              </div>
            </div>

            {/* Разница */}
            <div className="flex justify-between items-start">
              <div className="text-[16px] text-slate-600 font-normal">Разница</div>
              <div className="text-right">
                <div className="text-[48px] font-bold text-slate-900 leading-none mb-1">505 199</div>
                <div className="text-[16px] text-blue-600 font-medium">-559 520 <span className="text-slate-400">- по плану</span></div>
              </div>
            </div>
          </div>

          {/* Right Content - Cash Flow Chart */}
          <div className="col-span-8">
            {/* Range Slider above cash flow chart */}
            <div className="mb-4 px-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] text-slate-500">6 млн</span>
                <span className="text-[12px] text-slate-600 font-medium">
                  {cashFlowDateRangeText}
                </span>
              </div>
              
              {/* Compact Range Slider for Cash Flow */}
              <div className="relative">
                {/* Month labels */}
                <div className="flex justify-between text-[10px] text-slate-400 mb-2">
                  {monthNames.map((month, idx) => (
                    <span key={idx} className="w-8 text-center">{month}</span>
                  ))}
                </div>
                
                {/* Slider track */}
                <div className="relative h-1 bg-slate-300 rounded-full">
                  {/* Active range */}
                  <div 
                    className="absolute h-1 bg-slate-400 rounded-full transition-all duration-150"
                    style={{
                      left: `${(cashFlowDateRange[0] / 11) * 100}%`,
                      width: `${((cashFlowDateRange[1] - cashFlowDateRange[0]) / 11) * 100}%`
                    }}
                  />
                  
                  {/* Start handle */}
                  <input
                    type="range"
                    min="0"
                    max="11"
                    value={cashFlowDateRange[0]}
                    onChange={(e) => {
                      const newStart = parseInt(e.target.value)
                      if (newStart <= cashFlowDateRange[1]) {
                        setCashFlowDateRange([newStart, cashFlowDateRange[1]])
                      }
                    }}
                    className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer photo-range-slider"
                    style={{ zIndex: 2 }}
                  />
                  
                  {/* End handle */}
                  <input
                    type="range"
                    min="0"
                    max="11"
                    value={cashFlowDateRange[1]}
                    onChange={(e) => {
                      const newEnd = parseInt(e.target.value)
                      if (newEnd >= cashFlowDateRange[0]) {
                        setCashFlowDateRange([cashFlowDateRange[0], newEnd])
                      }
                    }}
                    className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer photo-range-slider"
                    style={{ zIndex: 1 }}
                  />
                  
                  {/* Visual handles */}
                  <div 
                    className="absolute w-5 h-5 bg-white border-2 border-slate-400 rounded-full shadow-sm transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 hover:border-slate-500 hover:shadow-md"
                    style={{ 
                      left: `${(cashFlowDateRange[0] / 11) * 100}%`,
                      top: '50%',
                      zIndex: 3,
                      pointerEvents: 'none'
                    }}
                  />
                  <div 
                    className="absolute w-5 h-5 bg-white border-2 border-slate-400 rounded-full shadow-sm transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 hover:border-slate-500 hover:shadow-md"
                    style={{ 
                      left: `${(cashFlowDateRange[1] / 11) * 100}%`,
                      top: '50%',
                      zIndex: 3,
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Cash Flow Chart */}
            <div className="h-[300px] relative">
              <Chart type="bar" data={getCashFlowChartData()} options={cashFlowChartOptions} />
            </div>

            {/* Cash Flow Legend */}
            <div className="flex items-center justify-center gap-8 mt-6 text-[12px]">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-[#4FC3F7] rounded-sm"></div>
                <span className="text-slate-700">Поступления</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 bg-[#FFB74D] rounded-sm"></div>
                <span className="text-slate-700">Выплаты</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#4CAF50] rounded-full"></div>
                <span className="text-slate-700">Разница</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Account Balances */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="text-[16px] font-medium text-slate-900">Остатки на счетах, ₽</div>
            <div className="text-[48px] font-bold text-slate-900">3 373 340</div>
          </div>

          {/* Balance Chart Range Slider */}
          <div className="mb-4 px-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-slate-500">4 млн</span>
              <span className="text-[12px] text-slate-600 font-medium">
                {balanceRangeText}
              </span>
            </div>
            
            {/* Balance Range Slider */}
            <div className="relative">
              {/* Date labels for balance chart */}
              <div className="flex justify-between text-[10px] text-slate-400 mb-2">
                <span>1 янв '26</span>
                <span>22 янв '26</span>
                <span>13 фев '26</span>
                <span>7 мар '26</span>
                <span>26 мар '26</span>
                <span>29 мар '26</span>
                <span>20 апр '26</span>
                <span>6 мая '26</span>
                <span>3 июн '26</span>
                <span>26 июл '26</span>
                <span>17 авг '26</span>
                <span>8 авг '26</span>
                <span>30 авг '26</span>
                <span>21 сен '26</span>
                <span>13 окт '26</span>
                <span>4 ноя '26</span>
                <span>26 ноя '26</span>
                <span>18 дек '26</span>
              </div>
              
              {/* Slider track */}
              <div className="relative h-1 bg-slate-300 rounded-full">
                {/* Active range */}
                <div 
                  className="absolute h-1 bg-slate-400 rounded-full transition-all duration-150"
                  style={{
                    left: `${(balanceRange[0] / 17) * 100}%`,
                    width: `${((balanceRange[1] - balanceRange[0]) / 17) * 100}%`
                  }}
                />
                
                {/* Start handle */}
                <input
                  type="range"
                  min="0"
                  max="17"
                  value={balanceRange[0]}
                  onChange={(e) => {
                    const newStart = parseInt(e.target.value)
                    if (newStart <= balanceRange[1]) {
                      setBalanceRange([newStart, balanceRange[1]])
                    }
                  }}
                  className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer photo-range-slider"
                  style={{ zIndex: 2 }}
                />
                
                {/* End handle */}
                <input
                  type="range"
                  min="0"
                  max="17"
                  value={balanceRange[1]}
                  onChange={(e) => {
                    const newEnd = parseInt(e.target.value)
                    if (newEnd >= balanceRange[0]) {
                      setBalanceRange([balanceRange[0], newEnd])
                    }
                  }}
                  className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer photo-range-slider"
                  style={{ zIndex: 1 }}
                />
                
                {/* Visual handles */}
                <div 
                  className="absolute w-5 h-5 bg-white border-2 border-slate-400 rounded-full shadow-sm transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 hover:border-slate-500 hover:shadow-md"
                  style={{ 
                    left: `${(balanceRange[0] / 17) * 100}%`,
                    top: '50%',
                    zIndex: 3,
                    pointerEvents: 'none'
                  }}
                />
                <div 
                  className="absolute w-5 h-5 bg-white border-2 border-slate-400 rounded-full shadow-sm transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 hover:border-slate-500 hover:shadow-md"
                  style={{ 
                    left: `${(balanceRange[1] / 17) * 100}%`,
                    top: '50%',
                    zIndex: 3,
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Balance Chart */}
          <div className="h-[350px] relative">
            <Chart type="line" data={balanceChartData} options={balanceChartOptions} />
          </div>

          {/* Balance Chart Footer */}
          <div className="mt-4">
            {/* Legend */}
            <div className="text-[11px] text-slate-500 leading-relaxed">
              <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-[#4CAF50]"></div>
                  <span>Общий остаток</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-slate-400"></div>
                  <span>Сейф [ИП Алексеенко Михаил Федорович]</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-slate-400"></div>
                  <span>Альфа банк [ИП Алексеенко Михаил Федорович]</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-slate-400"></div>
                  <span>Карта физ. лица [ИП Алексеенко Михаил Федорович]</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-slate-400"></div>
                  <span>Т-Банк [ООО "Прометей"]</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-slate-400"></div>
                  <span>Сбер [ООО "Прометей"]</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-slate-400"></div>
                  <span>Наличка [ООО "Прометей"]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-[#17a2b8] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#138496] transition-colors">
          <MessageCircle size={20} fill="currentColor" />
        </button>
      </div>

      {/* Payment Structure Section */}
      <div className="mt-12 pt-8">
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
              Доходы и расходы
            </button>
            <button
              onClick={() => setActivePaymentView('payments')}
              className={cn(
                "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                activePaymentView === 'payments' 
                  ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]" 
                  : "text-slate-600 hover:text-slate-800"
              )}
            >
              Поступления и выплаты
            </button>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* Left Section - Pie Chart */}
          <div className="flex-shrink-0">
            <div className="text-[14px] text-slate-600 mb-6">Доходы, ₽</div>
            
            {/* Pie Chart */}
            <div className="relative w-56 h-56">
              <Chart type="doughnut" data={paymentStructureData} options={pieChartOptions} />
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[12px] text-slate-500 mb-1">Доходы:</div>
                <div className="text-[22px] font-bold text-slate-900">830 000</div>
              </div>
            </div>
          </div>

          {/* Middle Section - Legend */}
          <div className="flex-shrink-0 mt-16">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#4FC3F7] rounded-sm"></div>
                <span className="text-[13px] text-slate-600">Поступления от заказчиков</span>
                <span className="text-[13px] font-medium text-slate-900 ml-4">750 000 (90.36%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#1976D2] rounded-sm"></div>
                <span className="text-[13px] text-slate-600">Услуги ремонта</span>
                <span className="text-[13px] font-medium text-slate-900 ml-4">80 000 (9.64%)</span>
              </div>
            </div>
          </div>

          {/* Right Section - Bar Chart */}
          <div className="flex-1">
            {/* Range Slider above payment chart */}
            <div className="mb-3 px-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-500">1.6 млн</span>
                <span className="text-[11px] text-slate-600 font-medium">
                  {paymentRangeText}
                </span>
              </div>
              
              {/* Payment Range Slider */}
              <div className="relative">
                {/* Month labels */}
                <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                  {['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'].map((month, idx) => (
                    <span key={idx} className="w-6 text-center">{month}</span>
                  ))}
                </div>
                
                {/* Slider track */}
                <div className="relative h-1 bg-slate-300 rounded-full">
                  {/* Active range */}
                  <div 
                    className="absolute h-1 bg-slate-400 rounded-full transition-all duration-150"
                    style={{
                      left: `${(paymentRange[0] / 11) * 100}%`,
                      width: `${((paymentRange[1] - paymentRange[0]) / 11) * 100}%`
                    }}
                  />
                  
                  {/* Start handle */}
                  <input
                    type="range"
                    min="0"
                    max="11"
                    value={paymentRange[0]}
                    onChange={(e) => {
                      const newStart = parseInt(e.target.value)
                      if (newStart <= paymentRange[1]) {
                        setPaymentRange([newStart, paymentRange[1]])
                      }
                    }}
                    className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer photo-range-slider"
                    style={{ zIndex: 2 }}
                  />
                  
                  {/* End handle */}
                  <input
                    type="range"
                    min="0"
                    max="11"
                    value={paymentRange[1]}
                    onChange={(e) => {
                      const newEnd = parseInt(e.target.value)
                      if (newEnd >= paymentRange[0]) {
                        setPaymentRange([paymentRange[0], newEnd])
                      }
                    }}
                    className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer photo-range-slider"
                    style={{ zIndex: 1 }}
                  />
                  
                  {/* Visual handles */}
                  <div 
                    className="absolute w-4 h-4 bg-white border-2 border-slate-400 rounded-full shadow-sm transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 hover:border-slate-500 hover:shadow-md"
                    style={{ 
                      left: `${(paymentRange[0] / 11) * 100}%`,
                      top: '50%',
                      zIndex: 3,
                      pointerEvents: 'none'
                    }}
                  />
                  <div 
                    className="absolute w-4 h-4 bg-white border-2 border-slate-400 rounded-full shadow-sm transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 hover:border-slate-500 hover:shadow-md"
                    style={{ 
                      left: `${(paymentRange[1] / 11) * 100}%`,
                      top: '50%',
                      zIndex: 3,
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Payment Structure Chart */}
            <div className="h-[220px] relative">
              <Chart type="bar" data={getPaymentBarChartData()} options={paymentBarChartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Structure Section */}
      <div className="mt-12 pt-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
          <span className="text-[16px] font-medium text-slate-900">Расходы, ₽</span>
        </div>

        <div className="flex gap-8 items-start">
          {/* Left Section - Pie Chart */}
          <div className="flex-shrink-0">
            {/* Pie Chart */}
            <div className="relative w-56 h-56">
              <Chart type="doughnut" data={expensesStructureData} options={expensesPieChartOptions} />
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[12px] text-slate-500 mb-1">Расходы:</div>
                <div className="text-[22px] font-bold text-slate-900">129 241</div>
              </div>
            </div>
          </div>

          {/* Middle Section - Legend */}
          <div className="flex-shrink-0 mt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#FFC107] rounded-sm"></div>
                <span className="text-[13px] text-slate-600">Реклама</span>
                <span className="text-[13px] font-medium text-slate-900 ml-4">50 000 (38.69%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#FF9800] rounded-sm"></div>
                <span className="text-[13px] text-slate-600">Субподряд</span>
                <span className="text-[13px] font-medium text-slate-900 ml-4">32 412 (25.08%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#FF5722] rounded-sm"></div>
                <span className="text-[13px] text-slate-600">Аренда</span>
                <span className="text-[13px] font-medium text-slate-900 ml-4">16 500 (12.77%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#FF7043] rounded-sm"></div>
                <span className="text-[13px] text-slate-600">Проценты по кредиту</span>
                <span className="text-[13px] font-medium text-slate-900 ml-4">15 540 (12.02%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#FFAB91] rounded-sm"></div>
                <span className="text-[13px] text-slate-600">Канцелярия</span>
                <span className="text-[13px] font-medium text-slate-900 ml-4">14 789 (11.44%)</span>
              </div>
            </div>
          </div>

          {/* Right Section - Bar Chart */}
          <div className="flex-1">
            {/* Range Slider above expenses chart */}
            <div className="mb-3 px-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-500">1.4 млн</span>
                <span className="text-[11px] text-slate-600 font-medium">
                  {expensesRangeText}
                </span>
              </div>
              
              {/* Expenses Range Slider */}
              <div className="relative">
                {/* Month labels */}
                <div className="flex justify-between text-[9px] text-slate-400 mb-1">
                  {['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'].map((month, idx) => (
                    <span key={idx} className="w-6 text-center">{month}</span>
                  ))}
                </div>
                
                {/* Slider track */}
                <div className="relative h-1 bg-slate-300 rounded-full">
                  {/* Active range */}
                  <div 
                    className="absolute h-1 bg-slate-400 rounded-full transition-all duration-150"
                    style={{
                      left: `${(expensesRange[0] / 11) * 100}%`,
                      width: `${((expensesRange[1] - expensesRange[0]) / 11) * 100}%`
                    }}
                  />
                  
                  {/* Start handle */}
                  <input
                    type="range"
                    min="0"
                    max="11"
                    value={expensesRange[0]}
                    onChange={(e) => {
                      const newStart = parseInt(e.target.value)
                      if (newStart <= expensesRange[1]) {
                        setExpensesRange([newStart, expensesRange[1]])
                      }
                    }}
                    className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer photo-range-slider"
                    style={{ zIndex: 2 }}
                  />
                  
                  {/* End handle */}
                  <input
                    type="range"
                    min="0"
                    max="11"
                    value={expensesRange[1]}
                    onChange={(e) => {
                      const newEnd = parseInt(e.target.value)
                      if (newEnd >= expensesRange[0]) {
                        setExpensesRange([expensesRange[0], newEnd])
                      }
                    }}
                    className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer photo-range-slider"
                    style={{ zIndex: 1 }}
                  />
                  
                  {/* Visual handles */}
                  <div 
                    className="absolute w-4 h-4 bg-white border-2 border-slate-400 rounded-full shadow-sm transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 hover:border-slate-500 hover:shadow-md"
                    style={{ 
                      left: `${(expensesRange[0] / 11) * 100}%`,
                      top: '50%',
                      zIndex: 3,
                      pointerEvents: 'none'
                    }}
                  />
                  <div 
                    className="absolute w-4 h-4 bg-white border-2 border-slate-400 rounded-full shadow-sm transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 hover:border-slate-500 hover:shadow-md"
                    style={{ 
                      left: `${(expensesRange[1] / 11) * 100}%`,
                      top: '50%',
                      zIndex: 3,
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Expenses Structure Chart */}
            <div className="h-[220px] relative">
              <Chart type="bar" data={getExpensesBarChartData()} options={expensesBarChartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Most Profitable Clients Section */}
      <div className="mt-12 pt-8">
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

        {/* Clients Chart */}
        <div className="relative">
          <div className="h-[400px] relative">
            <Chart type="bar" data={getClientsChartData()} options={clientsChartOptions} />
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-8 mt-6 text-[12px]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-[#4FC3F7] rounded-sm"></div>
              <span className="text-slate-700">Клиенты, приносящие более 80% доходов</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-[#9C27B0] rounded-sm"></div>
              <span className="text-slate-700">Клиенты, приносящие менее 20% доходов</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#2196F3] rounded-full"></div>
              <span className="text-slate-700">Доля доходов с накопительным итогом, %</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Profitability Section */}
      <div className="mt-12 pt-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
          <span className="text-[16px] font-medium text-slate-900">Прибыльность проектов</span>
          <div className="flex bg-slate-100 rounded p-1">
            <button
              onClick={() => setActiveProjectMethod('accrual')}
              className={cn(
                "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                activeProjectMethod === 'accrual' 
                  ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]" 
                  : "text-slate-600 hover:text-slate-800"
              )}
            >
              Метод начисления
            </button>
            <button
              onClick={() => setActiveProjectMethod('cash')}
              className={cn(
                "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                activeProjectMethod === 'cash' 
                  ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]" 
                  : "text-slate-600 hover:text-slate-800"
              )}
            >
              Кассовый метод
            </button>
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

        {/* Projects Chart */}
        <div className="relative">
          <div className="h-[450px] relative">
            <Chart type="bar" data={getProjectsChartData()} options={projectsChartOptions} />
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-8 mt-6 text-[12px]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-[#81C784] rounded-sm"></div>
              <span className="text-slate-700">Плановая, ₽</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-[#4CAF50] rounded-sm"></div>
              <span className="text-slate-700">Фактическая прибыль, ₽</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-[#A5D6A7] rounded-sm"></div>
              <span className="text-slate-700">Плановая, %</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-[#4FC3F7] rounded-sm"></div>
              <span className="text-slate-700">Фактическая рентабельность, %</span>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Custom Range Slider Styles */}
      <style jsx>{`
        .range-slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #17a2b8;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .range-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #17a2b8;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .range-slider::-webkit-slider-track {
          background: transparent;
        }
        
        .range-slider::-moz-range-track {
          background: transparent;
        }

        .photo-range-slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid #94a3b8;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          opacity: 0;
        }
        
        .photo-range-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid #94a3b8;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          opacity: 0;
        }
        
        .photo-range-slider::-webkit-slider-track {
          background: transparent;
        }
        
        .photo-range-slider::-moz-range-track {
          background: transparent;
        }

        .photo-range-slider:hover::-webkit-slider-thumb {
          opacity: 0.1;
        }
        
        .photo-range-slider:hover::-moz-range-thumb {
          opacity: 0.1;
        }

        .compact-range-slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #17a2b8;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          opacity: 0;
        }
        
        .compact-range-slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #17a2b8;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          opacity: 0;
        }
        
        .compact-range-slider::-webkit-slider-track {
          background: transparent;
        }
        
        .compact-range-slider::-moz-range-track {
          background: transparent;
        }

        .compact-range-slider:hover::-webkit-slider-thumb {
          opacity: 0.3;
        }
        
        .compact-range-slider:hover::-moz-range-thumb {
          opacity: 0.3;
        }
      `}</style>
    </div>
  )
}