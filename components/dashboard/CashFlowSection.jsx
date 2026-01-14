import { Chart } from 'react-chartjs-2'
import { cn } from '@/app/lib/utils'
import RangeSlider from './RangeSlider'

export default function CashFlowSection({
  activeCashFlow,
  setActiveCashFlow,
  cashFlowDateRange,
  setCashFlowDateRange,
  monthNames,
  getCashFlowChartData,
  cashFlowChartOptions
}) {
  const cashFlowMetrics = [
    { label: 'Поступления', value: '830 000', plan: '7 238 620' },
    { label: 'Выплаты', value: '324 801', plan: '7 798 140' },
    { label: 'Разница', value: '505 199', plan: '-559 520' }
  ]

  const cashFlowDateRangeText = `${monthNames[cashFlowDateRange[0]]} - ${monthNames[cashFlowDateRange[1]]}`

  return (
    <div className="pt-8">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
        <span className="text-[14px] font-medium text-slate-900">Денежный поток, ₽</span>
        <div className="flex bg-slate-100 rounded p-1">
          {['general', 'operational', 'investment', 'financial'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveCashFlow(type)}
              className={cn(
                "px-4 py-1.5 text-[13px] font-medium rounded transition-colors",
                activeCashFlow === type
                  ? "bg-white text-[#17a2b8] shadow-sm border border-[#17a2b8]"
                  : "text-slate-600 hover:text-slate-800"
              )}
            >
              {type === 'general' ? 'Общий' : type === 'operational' ? 'Операционный' : type === 'investment' ? 'Инвестиционный' : 'Финансовый'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Panel - Cash Flow Metrics */}
        <div className="col-span-4 space-y-8">
          {cashFlowMetrics.map((metric, index) => (
            <div key={index} className="flex justify-between items-start">
              <div className="text-[16px] text-slate-600 font-normal">{metric.label}</div>
              <div className="text-right">
                <div className="text-[48px] font-bold text-slate-900 leading-none mb-1">{metric.value}</div>
                <div className="text-[16px] text-blue-600 font-medium">
                  {metric.plan} <span className="text-slate-400">- по плану</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Content - Cash Flow Chart */}
        <div className="col-span-8">
          <div className="mb-4 px-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-slate-500">6 млн</span>
              <span className="text-[12px] text-slate-600 font-medium">{cashFlowDateRangeText}</span>
            </div>
            
            <RangeSlider
              range={cashFlowDateRange}
              setRange={setCashFlowDateRange}
              labels={monthNames}
              maxValue={11}
              title=""
            />
          </div>

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
    </div>
  )
}
