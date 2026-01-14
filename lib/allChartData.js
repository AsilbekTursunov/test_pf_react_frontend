// Основные метрики
export const mainMetrics = [
  { label: 'Доходы', value: '830 000', plan: '4 090 000' },
  { label: 'Расходы', value: '129 241', plan: '4 391 560' },
  { label: 'Чистая прибыль', value: '700 759', plan: '-301 560' },
  { label: 'Рентабельность, %', value: '84.43%', plan: '-7.37%' },
  { label: 'Дивиденды', value: '0', plan: '300 000' }
]

// Легенда главного графика
export const mainChartLegend = [
  { color: '#4FC3F7', label: 'Доходы', shape: 'square' },
  { color: '#FFB74D', label: 'Расходы', shape: 'square' },
  { color: '#4CAF50', label: 'Чистая прибыль', shape: 'circle' },
  { color: '#9C27B0', label: 'Дивиденды', shape: 'circle' }
]

// Функция получения данных главного графика
export function getMainChartData(dateRange) {
  const exactData = {
    income: [830, 1500, 950, 1000, 1200, 850, 450, 350, 300, 250, 200, 150, 100],
    expenses: [129, 1352, 500, 450, 400, 300, 200, 150, 100, 80, 60, 50, 40],
    profit: [800, 400, 200, -200, -300, 350, 250, 200, 200, 170, 140, 100, 60],
    dividends: [0, 0, 0, -400, -320, 0, 0, 0, 0, 0, 0, 0, 0]
  }

  const allLabels = ['янв', 'янв\n(план)', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  const filteredLabels = allLabels.slice(dateRange[0], dateRange[1] + 1)
  
  const filteredData = {
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
        data: filteredData.income,
        backgroundColor: (ctx) => {
          const isPlanned = ctx.dataIndex === 1 && dateRange[0] <= 1 && dateRange[1] >= 1
          return isPlanned ? 'rgba(79, 195, 247, 0.7)' : '#4FC3F7'
        },
        borderRadius: 2,
        barThickness: 25,
        order: 2
      },
      {
        type: 'bar',
        label: 'Расходы',
        data: filteredData.expenses,
        backgroundColor: (ctx) => {
          const isPlanned = ctx.dataIndex === 1 && dateRange[0] <= 1 && dateRange[1] >= 1
          return isPlanned ? 'rgba(255, 183, 77, 0.7)' : '#FFB74D'
        },
        borderRadius: 2,
        barThickness: 25,
        order: 3
      },
      {
        type: 'line',
        label: 'Чистая прибыль',
        data: filteredData.profit,
        borderColor: '#4CAF50',
        pointBackgroundColor: (ctx) => ctx.parsed.y < 0 ? '#F44336' : '#4CAF50',
        pointRadius: 4,
        borderWidth: 2,
        borderDash: [8, 4],
        tension: 0.1,
        order: 1
      },
      {
        type: 'line',
        label: 'Дивиденды',
        data: filteredData.dividends,
        borderColor: '#9C27B0',
        pointBackgroundColor: (ctx) => ctx.parsed.y < 0 ? '#F44336' : '#9C27B0',
        pointRadius: 4,
        borderWidth: 2,
        borderDash: [8, 4],
        tension: 0.1,
        order: 1
      }
    ]
  }
}

// Опции главного графика
export function chartOptions(dateRange) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      y: {
        min: -600,
        max: 1600,
        grid: { color: '#f1f5f9' },
        ticks: {
          color: '#64748b',
          stepSize: 500,
          callback: (value) => {
            if (value >= 1000) return `${value/1000} млн`
            if (value >= 500 || value <= -500) return `${value} тыс`
            return value === 0 ? '0' : value
          }
        }
      }
    }
  }
}

// Данные денежного потока
export function getCashFlowChartData(cashFlowDateRange) {
  const cashFlowData = {
    income: [830, 1200, 950, 800, 900, 1100, 950, 1050, 1150, 1250, 1350, 1400, 1100],
    expenses: [324, 800, 600, 500, 400, 600, 500, 650, 700, 750, 800, 850, 900],
    difference: [506, 400, 350, 300, 500, 500, 450, 400, 450, 500, 550, 550, 200]
  }

  const allLabels = ['янв', 'янв\n(план)', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  
  return {
    labels: allLabels.slice(cashFlowDateRange[0], cashFlowDateRange[1] + 1),
    datasets: [
      {
        type: 'bar',
        label: 'Поступления',
        data: cashFlowData.income.slice(cashFlowDateRange[0], cashFlowDateRange[1] + 1),
        backgroundColor: '#4FC3F7',
        barThickness: 25
      },
      {
        type: 'bar',
        label: 'Выплаты',
        data: cashFlowData.expenses.slice(cashFlowDateRange[0], cashFlowDateRange[1] + 1),
        backgroundColor: '#FFB74D',
        barThickness: 25
      },
      {
        type: 'line',
        label: 'Разница',
        data: cashFlowData.difference.slice(cashFlowDateRange[0], cashFlowDateRange[1] + 1),
        borderColor: '#4CAF50',
        pointRadius: 4,
        borderWidth: 2
      }
    ]
  }
}

export const cashFlowChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { min: -500, max: 1400, grid: { color: '#f1f5f9' } }
  }
}

// Заглушки для остальных функций - TODO: добавить реальные данные
export function getBalanceChartData(balanceRange) {
  const balanceData = [
    3000, 3100, 2600, 2400, 2200, 1800, 1600, 1400, 1200, 1000, 800, -800, -1200, -600, 1800, 2000, 2200, 1900
  ]
  
  const balanceLabels = [
    '1 янв', '22 янв', '13 фев', '7 мар', '26 мар', '29 мар', '20 апр', '6 мая', 
    '3 июн', '26 июл', '17 авг', '8 авг', '30 авг', '21 сен', '13 окт', '4 ноя', '26 ноя', '18 дек'
  ]

  const slicedData = balanceData.slice(balanceRange[0], balanceRange[1] + 1)
  const hasNegative = slicedData.some(val => val < 0)

  return {
    labels: balanceLabels.slice(balanceRange[0], balanceRange[1] + 1),
    datasets: [{
      label: 'Общий остаток',
      data: slicedData,
      borderColor: '#4CAF50',
      backgroundColor: (context) => {
        if (!hasNegative) {
          return 'rgba(76, 175, 80, 0.3)'
        }
        const ctx = context.chart.ctx
        const chartArea = context.chart.chartArea
        if (!chartArea) return 'rgba(76, 175, 80, 0.3)'
        
        const yScale = context.chart.scales.y
        const zeroPixel = yScale.getPixelForValue(0)
        
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        const zeroPosition = (zeroPixel - chartArea.top) / (chartArea.bottom - chartArea.top)
        
        gradient.addColorStop(0, 'rgba(76, 175, 80, 0.35)')
        gradient.addColorStop(Math.max(0, zeroPosition - 0.01), 'rgba(76, 175, 80, 0.35)')
        gradient.addColorStop(Math.min(1, zeroPosition), 'rgba(244, 67, 54, 0.35)')
        gradient.addColorStop(1, 'rgba(244, 67, 54, 0.35)')
        return gradient
      },
      pointRadius: 0,
      pointHoverRadius: 0,
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  }
}

export const balanceChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1f2937',
      bodyColor: '#1f2937',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: (context) => `${context.parsed.y.toLocaleString('ru-RU')} ₽`
      }
    }
  },
  scales: {
    x: { 
      grid: { display: false },
      ticks: { 
        color: '#64748b',
        font: { size: 11 }
      }
    },
    y: { 
      min: -2000, 
      max: 4000,
      grid: { 
        color: (context) => context.tick.value === 0 ? '#cbd5e1' : '#f1f5f9',
        lineWidth: (context) => context.tick.value === 0 ? 2 : 1
      },
      ticks: {
        color: '#64748b',
        font: { size: 11 },
        callback: (value) => {
          if (value >= 1000 || value <= -1000) return `${value/1000} млн`
          return value === 0 ? '0' : `${value} тыс`
        }
      }
    }
  }
}

export function getPaymentBarChartData(paymentRange) {
  const allLabels = ['янв\n(факт)', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  const allData1 = [650, 1200, 800, 700, 600, 500, 400, 300, 200, 100, 50, 0]
  const allData2 = [150, 250, 200, 250, 300, 250, 200, 150, 100, 50, 25, 0]
  const isPlanned = [false, true, true, true, false, false, false, false, false, false, false, false]
  
  return {
    labels: allLabels.slice(paymentRange[0], paymentRange[1] + 1),
    datasets: [
      {
        label: 'Поступления от заказчиков',
        data: allData1.slice(paymentRange[0], paymentRange[1] + 1),
        backgroundColor: (ctx) => {
          const index = ctx.dataIndex + paymentRange[0]
          return isPlanned[index] ? 'rgba(79, 195, 247, 0.3)' : '#4FC3F7'
        },
        borderColor: (ctx) => {
          const index = ctx.dataIndex + paymentRange[0]
          return isPlanned[index] ? '#4FC3F7' : 'transparent'
        },
        borderWidth: (ctx) => {
          const index = ctx.dataIndex + paymentRange[0]
          return isPlanned[index] ? 2 : 0
        },
        borderDash: (ctx) => {
          const index = ctx.dataIndex + paymentRange[0]
          return isPlanned[index] ? [5, 3] : []
        },
        barThickness: 60
      },
      {
        label: 'Услуги ремонта',
        data: allData2.slice(paymentRange[0], paymentRange[1] + 1),
        backgroundColor: (ctx) => {
          const index = ctx.dataIndex + paymentRange[0]
          return isPlanned[index] ? 'rgba(30, 58, 138, 0.3)' : '#1E3A8A'
        },
        borderColor: (ctx) => {
          const index = ctx.dataIndex + paymentRange[0]
          return isPlanned[index] ? '#1E3A8A' : 'transparent'
        },
        borderWidth: (ctx) => {
          const index = ctx.dataIndex + paymentRange[0]
          return isPlanned[index] ? 2 : 0
        },
        borderDash: (ctx) => {
          const index = ctx.dataIndex + paymentRange[0]
          return isPlanned[index] ? [5, 3] : []
        },
        barThickness: 60
      }
    ]
  }
}

export const paymentBarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1f2937',
      bodyColor: '#1f2937',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      displayColors: true
    }
  },
  scales: {
    x: { 
      stacked: true, 
      grid: { display: false },
      ticks: { 
        color: '#64748b',
        font: { size: 11 }
      }
    },
    y: { 
      stacked: true, 
      max: 1600,
      grid: { color: '#f1f5f9' },
      ticks: {
        color: '#64748b',
        font: { size: 11 },
        callback: (value) => {
          if (value >= 1000) return `${value/1000} млн`
          return `${value} тыс`
        }
      }
    }
  }
}

export function getExpensesBarChartData(expensesRange) {
  const allLabels = ['янв\n(факт)', 'фев', 'мар', 'апр', 'май', 'июн', 'авг', 'сен', 'окт', 'ноя', 'дек']
  const isPlanned = [false, true, true, true, false, false, false, false, false, false, false]
  
  // Данные по категориям расходов
  const allОдежда = [0, 200, 200, 200, 0, 0, 0, 0, 0, 0, 0]
  const allРеклама = [50, 50, 50, 50, 0, 0, 0, 0, 0, 0, 0]
  const allСубподряд = [32, 32, 32, 32, 0, 0, 0, 0, 0, 0, 0]
  const allМонтаж = [16, 16, 16, 16, 0, 0, 0, 0, 0, 0, 0]
  const allПроценты = [15, 15, 15, 15, 0, 0, 0, 0, 0, 0, 0]
  const allКанцелярия = [14, 14, 14, 14, 0, 0, 0, 0, 0, 0, 0]
  
  return {
    labels: allLabels.slice(expensesRange[0], expensesRange[1] + 1),
    datasets: [
      {
        label: 'Одежда',
        data: allОдежда.slice(expensesRange[0], expensesRange[1] + 1),
        backgroundColor: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? 'rgba(255, 193, 7, 0.3)' : '#FFC107'
        },
        borderColor: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? '#FFC107' : 'transparent'
        },
        borderWidth: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? 2 : 0
        },
        borderDash: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? [5, 3] : []
        },
        barThickness: 60
      },
      {
        label: 'Реклама',
        data: allРеклама.slice(expensesRange[0], expensesRange[1] + 1),
        backgroundColor: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? 'rgba(255, 152, 0, 0.3)' : '#FF9800'
        },
        borderColor: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? '#FF9800' : 'transparent'
        },
        borderWidth: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? 2 : 0
        },
        borderDash: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? [5, 3] : []
        },
        barThickness: 60
      },
      {
        label: 'Субподряд',
        data: allСубподряд.slice(expensesRange[0], expensesRange[1] + 1),
        backgroundColor: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? 'rgba(255, 87, 34, 0.3)' : '#FF5722'
        },
        borderColor: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? '#FF5722' : 'transparent'
        },
        borderWidth: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? 2 : 0
        },
        borderDash: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? [5, 3] : []
        },
        barThickness: 60
      },
      {
        label: 'Монтаж',
        data: allМонтаж.slice(expensesRange[0], expensesRange[1] + 1),
        backgroundColor: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? 'rgba(255, 112, 67, 0.3)' : '#FF7043'
        },
        borderColor: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? '#FF7043' : 'transparent'
        },
        borderWidth: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? 2 : 0
        },
        borderDash: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? [5, 3] : []
        },
        barThickness: 60
      },
      {
        label: 'Проценты по кредитам',
        data: allПроценты.slice(expensesRange[0], expensesRange[1] + 1),
        backgroundColor: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? 'rgba(255, 171, 145, 0.3)' : '#FFAB91'
        },
        borderColor: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? '#FFAB91' : 'transparent'
        },
        borderWidth: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? 2 : 0
        },
        borderDash: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? [5, 3] : []
        },
        barThickness: 60
      },
      {
        label: 'Канцелярия',
        data: allКанцелярия.slice(expensesRange[0], expensesRange[1] + 1),
        backgroundColor: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? 'rgba(188, 170, 164, 0.3)' : '#BCAAA4'
        },
        borderColor: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? '#BCAAA4' : 'transparent'
        },
        borderWidth: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? 2 : 0
        },
        borderDash: (ctx) => {
          const index = ctx.dataIndex + expensesRange[0]
          return isPlanned[index] ? [5, 3] : []
        },
        barThickness: 60
      }
    ]
  }
}

export const expensesBarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1f2937',
      bodyColor: '#1f2937',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      displayColors: true
    }
  },
  scales: {
    x: { 
      stacked: true, 
      grid: { display: false },
      ticks: { 
        color: '#64748b',
        font: { size: 11 }
      }
    },
    y: { 
      stacked: true, 
      max: 1400,
      grid: { color: '#f1f5f9' },
      ticks: {
        color: '#64748b',
        font: { size: 11 },
        callback: (value) => {
          if (value >= 1000) return `${value/1000} млн`
          return `${value} тыс`
        }
      }
    }
  }
}

export function getClientsChartData() {
  return {
    labels: ['ООО "Компания"', 'Королев А. А.'],
    datasets: [
      {
        type: 'bar',
        label: 'Клиенты, приносящие более 80% доходов',
        data: [750, 0],
        backgroundColor: '#4FC3F7',
        barThickness: 120,
        yAxisID: 'y',
        order: 2
      },
      {
        type: 'bar',
        label: 'Клиенты, приносящие менее 20% доходов',
        data: [0, 95],
        backgroundColor: '#9C27B0',
        barThickness: 120,
        yAxisID: 'y',
        order: 2
      },
      {
        type: 'line',
        label: 'Доля доходов с накопительным итогом, %',
        data: [85, 100],
        borderColor: '#2196F3',
        backgroundColor: 'transparent',
        pointRadius: 4,
        pointBackgroundColor: '#2196F3',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 2,
        yAxisID: 'y1',
        order: 1
      }
    ]
  }
}

export const clientsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { 
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'rect',
        padding: 20,
        font: { size: 12 },
        color: '#64748b',
        generateLabels: (chart) => {
          return [
            {
              text: 'Клиенты, приносящие более 80% доходов',
              fillStyle: '#4FC3F7',
              strokeStyle: '#4FC3F7',
              lineWidth: 0,
              pointStyle: 'rect'
            },
            {
              text: 'Клиенты, приносящие менее 20% доходов',
              fillStyle: '#9C27B0',
              strokeStyle: '#9C27B0',
              lineWidth: 0,
              pointStyle: 'rect'
            },
            {
              text: 'Доля доходов с накопительным итогом, %',
              fillStyle: '#2196F3',
              strokeStyle: '#2196F3',
              lineWidth: 2,
              pointStyle: 'line'
            }
          ]
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1f2937',
      bodyColor: '#1f2937',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { 
        color: '#64748b',
        font: { size: 11 }
      }
    },
    y: { 
      position: 'left',
      max: 800,
      grid: { color: '#f1f5f9' },
      ticks: {
        color: '#64748b',
        font: { size: 11 },
        callback: (value) => `${value} тыс`
      }
    },
    y1: { 
      position: 'right',
      max: 100,
      grid: { display: false },
      ticks: {
        color: '#64748b',
        font: { size: 11 },
        callback: (value) => `${value}%`
      }
    }
  }
}

export function getProjectsChartData() {
  return {
    labels: ['Загородный дом, Яковлева 7', 'Лоджия 15', 'Проходная 85', 'Отделка', 'Надежда 11', 'Загородный дом, Михайлова 93', 'Кухонная 45'],
    datasets: [
      {
        type: 'bar',
        label: 'Плановая, ₽',
        data: [420, 0, 0, 420, 0, 0, 0],
        backgroundColor: '#A5D6A7',
        barThickness: 40,
        yAxisID: 'y',
        order: 2
      },
      {
        type: 'bar',
        label: 'Фактическая прибыль, ₽',
        data: [550, 0, 0, 0, 0, 680, 0],
        backgroundColor: '#4CAF50',
        barThickness: 40,
        yAxisID: 'y',
        order: 2
      },
      {
        type: 'bar',
        label: 'Плановая, %',
        data: [0, 0, -180, 0, -120, 0, 0],
        backgroundColor: '#A5D6A7',
        barThickness: 40,
        yAxisID: 'y',
        order: 2
      },
      {
        type: 'bar',
        label: 'Фактическая рентабельность, %',
        data: [0, 520, 0, 0, 0, 0, 180],
        backgroundColor: '#81D4FA',
        barThickness: 40,
        yAxisID: 'y1',
        order: 2
      }
    ]
  }
}

export const projectsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { 
      display: true,
      position: 'top',
      align: 'start',
      labels: {
        usePointStyle: true,
        pointStyle: 'rect',
        padding: 15,
        font: { size: 12 },
        color: '#64748b',
        generateLabels: (chart) => {
          return [
            {
              text: 'Плановая, ₽',
              fillStyle: '#A5D6A7',
              strokeStyle: '#A5D6A7',
              lineWidth: 0,
              pointStyle: 'rect'
            },
            {
              text: 'Фактическая прибыль, ₽',
              fillStyle: '#4CAF50',
              strokeStyle: '#4CAF50',
              lineWidth: 0,
              pointStyle: 'rect'
            },
            {
              text: 'Плановая, %',
              fillStyle: '#A5D6A7',
              strokeStyle: '#A5D6A7',
              lineWidth: 0,
              pointStyle: 'rect'
            },
            {
              text: 'Фактическая рентабельность, %',
              fillStyle: '#81D4FA',
              strokeStyle: '#81D4FA',
              lineWidth: 0,
              pointStyle: 'rect'
            }
          ]
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1f2937',
      bodyColor: '#1f2937',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { 
        color: '#64748b',
        font: { size: 11 },
        maxRotation: 45,
        minRotation: 45
      }
    },
    y: { 
      position: 'left',
      min: -600,
      max: 800,
      grid: { 
        color: (context) => context.tick.value === 0 ? '#cbd5e1' : '#f1f5f9',
        lineWidth: (context) => context.tick.value === 0 ? 2 : 1
      },
      ticks: {
        color: '#64748b',
        font: { size: 11 },
        callback: (value) => `${value} тыс`
      }
    },
    y1: { 
      position: 'right',
      min: -100,
      max: 100,
      grid: { display: false },
      ticks: {
        color: '#64748b',
        font: { size: 11 },
        callback: (value) => `${value}%`
      }
    }
  }
}

export const paymentStructureData = {
  labels: ['Поступления от заказчиков', 'Услуги ремонта'],
  datasets: [{
    data: [750000, 80000],
    backgroundColor: ['#4FC3F7', '#1E3A8A'],
    borderWidth: 0,
    cutout: '70%'
  }]
}

export const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1f2937',
      bodyColor: '#1f2937',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      callbacks: {
        label: (context) => {
          const value = context.parsed
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(2)
          return `${context.label}: ${value.toLocaleString('ru-RU')} ₽ (${percentage}%)`
        }
      }
    }
  }
}

export const expensesStructureData = {
  labels: ['Одежда', 'Реклама', 'Субподряд', 'Монтаж', 'Проценты по кредитам', 'Канцелярия'],
  datasets: [{
    data: [200019, 50000, 32412, 16500, 15540, 14789],
    backgroundColor: ['#FFC107', '#FF9800', '#FF5722', '#FF7043', '#FFAB91', '#BCAAA4'],
    borderWidth: 0,
    cutout: '70%'
  }]
}

export const expensesPieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1f2937',
      bodyColor: '#1f2937',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      callbacks: {
        label: (context) => {
          const value = context.parsed
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(2)
          return `${context.label}: ${value.toLocaleString('ru-RU')} ₽ (${percentage}%)`
        }
      }
    }
  }
}
