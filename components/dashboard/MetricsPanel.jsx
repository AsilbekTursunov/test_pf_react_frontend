export default function MetricsPanel({ metrics }) {
  return (
    <div className="col-span-4 space-y-8">
      {metrics.map((metric, index) => (
        <div key={index} className="flex justify-between items-start">
          <div className="text-[16px] text-slate-600 font-normal">{metric.label}</div>
          <div className="text-right">
            <div className="text-[48px] font-bold text-slate-900 leading-none mb-1">
              {metric.value}
            </div>
            <div className="text-[16px] text-blue-600 font-medium">
              {metric.plan} <span className="text-slate-400">- по плану</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
