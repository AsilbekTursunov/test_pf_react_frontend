"use client"

import { cn } from '@/app/lib/utils'

export function ViewToggle({ view, onViewChange }) {
  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded p-1">
      <button
        onClick={() => onViewChange('list')}
        className={cn(
          "p-1.5 rounded transition-colors",
          view === 'list' ? "bg-white shadow-sm" : "hover:bg-slate-200"
        )}
        title="Список"
      >
        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
      <button
        onClick={() => onViewChange('grid')}
        className={cn(
          "p-1.5 rounded transition-colors",
          view === 'grid' ? "bg-white shadow-sm" : "hover:bg-slate-200"
        )}
        title="Сетка"
      >
        <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      </button>
    </div>
  )
}
