import { cn } from '@/app/lib/utils'

export default function MethodToggle({ activeMethod, setActiveMethod, title }) {
  return (
    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
      <span className="text-[14px] font-medium text-slate-900">{title}</span>
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
  )
}
