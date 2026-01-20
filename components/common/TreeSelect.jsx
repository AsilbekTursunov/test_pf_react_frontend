"use client"

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/app/lib/utils'

function TreeNode({ node, level = 0, selectedValue, onSelect, expandedNodes, toggleNode }) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedNodes.has(node.value)
  const isSelected = selectedValue === node.value

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (hasChildren) {
            toggleNode(node.value)
          }
          if (node.selectable) {
            onSelect(node)
          }
        }}
        disabled={!node.selectable && !hasChildren}
        className={cn(
          "w-full px-3 py-2 text-[13px] text-left hover:bg-slate-50 transition-colors flex items-center gap-2",
          isSelected && "bg-[#17a2b8]/10 text-[#17a2b8]",
          !node.selectable && !hasChildren && "text-slate-400 cursor-not-allowed"
        )}
        style={{ paddingLeft: `${12 + level * 20}px` }}
      >
        {hasChildren && (
          <svg 
            className={cn("w-3 h-3 text-slate-400 transition-transform flex-shrink-0", isExpanded && "rotate-90")} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        )}
        {!hasChildren && <span className="w-3" />}
        <span className="truncate">{node.title}</span>
      </button>

      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.value}
              node={child}
              level={level + 1}
              selectedValue={selectedValue}
              onSelect={onSelect}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function TreeSelect({ 
  data = [], 
  value, 
  onChange, 
  placeholder = "Выберите статью...",
  className = "",
  disabled = false,
  loading = false
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Find selected item in tree
  const findNodeByValue = (nodes, targetValue) => {
    for (const node of nodes) {
      if (node.value === targetValue) return node
      if (node.children) {
        const found = findNodeByValue(node.children, targetValue)
        if (found) return found
      }
    }
    return null
  }

  // Filter tree by search
  const filterTree = (nodes, searchTerm) => {
    if (!searchTerm) return nodes

    return nodes.reduce((acc, node) => {
      const matchesSearch = node.title?.toLowerCase().includes(searchTerm.toLowerCase())
      const filteredChildren = node.children ? filterTree(node.children, searchTerm) : []

      if (matchesSearch || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren
        })
      }

      return acc
    }, [])
  }

  const selectedNode = findNodeByValue(data, value)
  const selectedLabel = selectedNode ? selectedNode.title : placeholder
  const filteredData = filterTree(data, search)

  // Auto-expand nodes when searching
  useEffect(() => {
    if (search) {
      const expandAll = (nodes) => {
        const expanded = new Set()
        const traverse = (items) => {
          items.forEach(item => {
            if (item.children && item.children.length > 0) {
              expanded.add(item.value)
              traverse(item.children)
            }
          })
        }
        traverse(nodes)
        return expanded
      }
      setExpandedNodes(expandAll(filteredData))
    }
  }, [search, filteredData])

  const toggleNode = (nodeValue) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nodeValue)) {
        newSet.delete(nodeValue)
      } else {
        newSet.add(nodeValue)
      }
      return newSet
    })
  }

  const handleSelect = (node) => {
    if (node.selectable) {
      onChange(node.value, node)
      setIsOpen(false)
      setSearch('')
    }
  }

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={cn(
          "w-full px-3 py-2 text-[13px] text-left border rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8] transition-colors",
          disabled || loading ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-white text-slate-900 hover:bg-slate-50",
          !value && "text-slate-500",
          "border-slate-300"
        )}
      >
        <div className="flex items-center justify-between">
          <span className="truncate">{loading ? "Загрузка..." : selectedLabel}</span>
          <svg 
            className={cn("w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ml-2", isOpen && "rotate-180")} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-[400px] overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-slate-200">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск..."
              className="w-full px-3 py-1.5 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
              autoFocus
            />
          </div>

          {/* Tree list */}
          <div className="overflow-y-auto max-h-[340px]">
            {filteredData.length === 0 ? (
              <div className="px-3 py-2 text-[13px] text-slate-500 text-center">
                Ничего не найдено
              </div>
            ) : (
              filteredData.map((node) => (
                <TreeNode
                  key={node.value}
                  node={node}
                  level={0}
                  selectedValue={value}
                  onSelect={handleSelect}
                  expandedNodes={expandedNodes}
                  toggleNode={toggleNode}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
