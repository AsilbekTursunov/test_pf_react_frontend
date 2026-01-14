export default function RangeSlider({ 
  range, 
  setRange, 
  labels, 
  maxValue,
  title 
}) {
  return (
    <>
      <div className="relative">
        <div className="relative h-1 bg-slate-300 rounded-full">
          <div 
            className="absolute h-1 bg-slate-400 rounded-full transition-all duration-150"
            style={{
              left: `${(range[0] / maxValue) * 100}%`,
              width: `${((range[1] - range[0]) / maxValue) * 100}%`
            }}
          />
          
          <input
            type="range"
            min="0"
            max={maxValue}
            value={range[0]}
            onChange={(e) => {
              const newStart = parseInt(e.target.value)
              if (newStart <= range[1]) {
                setRange([newStart, range[1]])
              }
            }}
            className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer photo-range-slider"
            style={{ zIndex: 2 }}
          />
          
          <input
            type="range"
            min="0"
            max={maxValue}
            value={range[1]}
            onChange={(e) => {
              const newEnd = parseInt(e.target.value)
              if (newEnd >= range[0]) {
                setRange([range[0], newEnd])
              }
            }}
            className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer photo-range-slider"
            style={{ zIndex: 1 }}
          />
          
          <div 
            className="absolute w-5 h-5 bg-white border-2 border-slate-400 rounded-full shadow-sm transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 hover:border-slate-500 hover:shadow-md"
            style={{ 
              left: `${(range[0] / maxValue) * 100}%`,
              top: '50%',
              zIndex: 3,
              pointerEvents: 'none'
            }}
          />
          <div 
            className="absolute w-5 h-5 bg-white border-2 border-slate-400 rounded-full shadow-sm transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 hover:border-slate-500 hover:shadow-md"
            style={{ 
              left: `${(range[1] / maxValue) * 100}%`,
              top: '50%',
              zIndex: 3,
              pointerEvents: 'none'
            }}
          />
        </div>
      </div>
    </>
  )
}
