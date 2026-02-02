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
export const dashedBorderPlugin = {
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

ChartJS.register(dashedBorderPlugin)

export const defaultChartOptions = {
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
        color: '#6b7280',
        font: {
          size: 11
        },
        maxRotation: 0,
      }
    },
    y: {
      beginAtZero: false,
      grid: {
        color: '#f3f4f6',
        drawBorder: false
      },
      border: {
        display: false
      },
      ticks: {
        color: '#6b7280',
        font: {
          size: 11
        },
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
