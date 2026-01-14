export function getFilteredData(dateRange) {
  const allData = {
    income: [830, 1500, 950, 1000, 1200, 850, 450, 350, 300, 250, 200, 150, 100],
    expenses: [129, 1352, 500, 450, 400, 300, 200, 150, 100, 80, 60, 50, 40],
    profit: [800, 400, 200, -200, -300, 350, 250, 200, 200, 170, 140, 100, 60],
    dividends: [0, 0, 0, -400, -320, 0, 0, 0, 0, 0, 0, 0, 0]
  }

  const startIdx = dateRange[0]
  const endIdx = dateRange[1] + 1
  
  return {
    income: allData.income.slice(startIdx, endIdx),
    expenses: allData.expenses.slice(startIdx, endIdx),
    profit: allData.profit.slice(startIdx, endIdx),
    dividends: allData.dividends.slice(startIdx, endIdx)
  }
}

export function getMainChartData(dateRange) {
  const allLabels = ['янв', 'янв\n(план)', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  const filteredLabels = allLabels.slice(dateRange[0], dateRange[1] + 1)
  const filteredData = getFilteredData(dateRange)

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
        borderColor: (ctx) => {
          const isPlanned = ctx.dataIndex === 1 && dateRange[0] <= 1 && dateRange[1] >= 1
          return isPlanned ? '#4FC3F7' : 'transparent'
        },
        borderWidth: (ctx) => {
          const isPlanned = ctx.dataIndex === 1 && dateRange[0] <= 1 && dateRange[1] >= 1
          return isPlanned ? 2 : 0
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
        borderColor: (ctx) => {
          const isPlanned = ctx.dataIndex === 1 && dateRange[0] <= 1 && dateRange[1] >= 1
          return isPlanned ? '#FFB74D' : 'transparent'
        },
        borderWidth: (ctx) => {
          const isPlanned = ctx.dataIndex === 1 && dateRange[0] <= 1 && dateRange[1] >= 1
          return isPlanned ? 2 : 0
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
        backgroundColor: '#4CAF50',
        pointBackgroundColor: (ctx) => ctx.parsed.y < 0 ? '#F44336' : '#4CAF50',
        pointBorderColor: (ctx) => ctx.parsed.y < 0 ? '#F44336' : '#4CAF50',
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
        data: filteredData.dividends,
        borderColor: '#9C27B0',
        backgroundColor: '#9C27B0',
        pointBackgroundColor: (ctx) => ctx.parsed.y < 0 ? '#F44336' : '#9C27B0',
        pointBorderColor: (ctx) => ctx.parsed.y < 0 ? '#F44336' : '#9C27B0',
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

export const mainMetrics = [
  { label: 'Доходы', value: '830 000', plan: '4 090 000' },
  { label: 'Расходы', value: '129 241', plan: '4 391 560' },
  { label: 'Чистая прибыль', value: '700 759', plan: '-301 560' },
  { label: 'Рентабельность, %', value: '84.43%', plan: '-7.37%' },
  { label: 'Дивиденды', value: '0', plan: '300 000' }
]

export const mainChartLegend = [
  { color: '#4FC3F7', label: 'Доходы', shape: 'square' },
  { color: '#FFB74D', label: 'Расходы', shape: 'square' },
  { color: '#4CAF50', label: 'Чистая прибыль', shape: 'circle' },
  { color: '#9C27B0', label: 'Дивиденды', shape: 'circle' }
]
