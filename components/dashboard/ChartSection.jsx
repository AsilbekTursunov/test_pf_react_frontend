import { Chart } from 'react-chartjs-2'

export default function ChartSection({ 
  title, 
  chartData, 
  chartOptions, 
  legend, 
  rangeSlider,
  height = "450px" 
}) {
  return (
    <div className="col-span-8">
      {rangeSlider && (
        <div className="mb-4 px-4">
          {rangeSlider}
        </div>
      )}

      <div className={`h-[${height}] relative`}>
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>

      {legend && (
        <div className="flex items-center justify-center gap-8 mt-6 text-[12px]">
          {legend.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className={item.shape === 'circle' ? 'w-3 h-3 rounded-full' : 'w-4 h-3 rounded-sm'}
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-700">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
