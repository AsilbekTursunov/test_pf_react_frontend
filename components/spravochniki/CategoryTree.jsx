"use client"

import { useState } from 'react'
import { cn } from '@/app/lib/utils'

export function CategoryTree({ data, onSelect }) {
  const [expanded, setExpanded] = useState([])

  const toggleExpand = (id) => {
    setExpanded(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const renderNode = (node, level = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expanded.includes(node.id)

    return (
      <div key={node.id}>
        <div 
          className={cn(
            "flex items-center gap-2 py-2 px-3 hover:bg-slate-50 cursor-pointer transition-colors",
            level > 0 && "ml-6"
          )}
          onClick={() => {
            if (hasChildren) toggleExpand(node.id)
            onSelect?.(node)
          }}
        >
          {hasChildren && (
            <svg 
              className={cn(
                "w-3 h-3 text-slate-400 transition-transform",
                isExpanded && "rotate-90"
              )} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          )}
          {!hasChildren && <div className="w-3" />}
          <span className="text-[13px] text-slate-700">{node.name}</span>
          {node.count !== undefined && (
            <span className="text-[12px] text-slate-400 ml-auto">({node.count})</span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      {data.map(node => renderNode(node))}
    </div>
  )
}
