"use client"

import { useState, useEffect } from 'react'
import { PageLoader } from '@/components/PageLoader'

export default function ProdazhiPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <PageLoader isLoading={isLoading} />
      
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} flex items-center justify-center min-h-[calc(100vh-200px)]`}>
        <div className="text-center">
          <h1 className="text-[48px] font-bold text-slate-900 mb-4">📊</h1>
          <h2 className="text-[32px] font-bold text-slate-900 mb-2">Продажи</h2>
          <p className="text-[18px] text-slate-500">Скоро</p>
        </div>
      </div>
    </div>
  )
}
