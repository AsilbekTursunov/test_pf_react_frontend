import { Calendar, ChevronDown, Search } from 'lucide-react'
import { cn } from '@/app/lib/utils'

export default function FilterBar({ 
  dateRangeText,
  isDateRangeOpen,
  setIsDateRangeOpen,
  dateRangeRef,
  monthNames,
  dateRange,
  setDateRange,
  selectedPeriod,
  setSelectedPeriod,
  selectedEntity,
  setSelectedEntity,
  selectedProject,
  setSelectedProject
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
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
                        setDateRange([0, 11])
                      } else if (dateRange[0] <= index && dateRange[1] >= index) {
                        setDateRange([index, index])
                      } else {
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

      {/* Search */}
      <button className="p-2 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors">
        <Search size={14} className="text-slate-400" />
      </button>
    </div>
  )
}
