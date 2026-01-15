"use client"

import { cn } from '@/app/lib/utils'

export function FilterSidebar({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className="w-[280px] bg-white border-r border-slate-200 flex flex-col h-screen relative z-10">
      <div className="p-6 overflow-y-auto flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[16px] font-semibold text-slate-900">Фильтры</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-[18px]"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function FilterSection({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-[13px] font-medium text-slate-900 mb-3">{title}</h3>
      {children}
    </div>
  )
}

export function FilterCheckbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <div className={cn(
          "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
          checked 
            ? "bg-[#17a2b8] border-[#17a2b8]" 
            : "border-slate-300 group-hover:border-slate-400"
        )}>
          {checked && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-[13px] text-slate-700">{label}</span>
    </label>
  )
}
