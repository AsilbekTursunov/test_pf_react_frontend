"use client"

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/app/lib/utils'

export function DropdownFilter({ label, options, selectedValues, onChange, placeholder = "Выберите..." }) {
  const [isOpen, setIsOpen] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect()
      const dropdownHeight = Math.min(options.length * 40 + 16, 300) // высота элемента * кол-во + padding
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      
      setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > spaceBelow)
    }
  }, [isOpen, options.length])

  const toggleOption = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value))
    } else {
      onChange([...selectedValues, value])
    }
  }

  const selectedCount = selectedValues.length
  const displayText = selectedCount > 0 ? `Выбрано: ${selectedCount}` : placeholder

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-[13px] text-slate-700 bg-white border border-slate-300 rounded hover:border-slate-400 transition-colors"
      >
        <span className={cn(selectedCount === 0 && "text-slate-400")}>{displayText}</span>
        <svg 
          className={cn("w-4 h-4 text-slate-400 transition-transform", isOpen && "rotate-180")} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className={cn(
            "absolute left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto",
            openUpward ? "bottom-full mb-1" : "top-full mt-1"
          )}
          style={{ 
            animation: openUpward ? 'fadeSlideUp 0.2s ease-out' : 'fadeSlideIn 0.2s ease-out'
          }}
        >
          <div className="p-2">
            {options.map((option) => (
              <label 
                key={option.value} 
                className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => toggleOption(option.value)}
                    className="peer sr-only"
                  />
                  <div className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                    selectedValues.includes(option.value)
                      ? "bg-[#17a2b8] border-[#17a2b8]"
                      : "border-slate-300 group-hover:border-slate-400"
                  )}>
                    {selectedValues.includes(option.value) && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-[13px] text-slate-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
