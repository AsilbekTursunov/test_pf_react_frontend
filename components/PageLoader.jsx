"use client"

import { cn } from '@/app/lib/utils'

export function PageLoader({ isLoading }) {
  if (!isLoading) return null

  return (
    <div className={cn(
      "absolute inset-0 bg-white z-40 flex items-center justify-center transition-opacity duration-500",
      !isLoading && "opacity-0 pointer-events-none"
    )}>
      <div className="flex flex-col items-center gap-4">
        {/* Animated Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#17a2b8] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-600 text-sm font-medium animate-pulse">Загрузка...</p>
      </div>
    </div>
  )
}
