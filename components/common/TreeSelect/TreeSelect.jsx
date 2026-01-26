"use client"

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/app/lib/utils'
import styles from './TreeSelect.module.scss'

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
          styles.treeNode,
          isSelected && styles.selected,
          !node.selectable && !hasChildren && styles.disabled
        )}
        style={{ paddingLeft: `${12 + level * 20}px` }}
      >
        {hasChildren && (
          <svg 
            className={cn(styles.treeNodeIcon, isExpanded && styles.expanded)} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        )}
        {!hasChildren && <span className={styles.treeNodeSpacer} />}
        <span className={styles.treeNodeText}>{node.title}</span>
      </button>

      {hasChildren && isExpanded && (
        <div className={styles.treeNodeChildren}>
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
    <div className={cn(styles.container, className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={cn(
          styles.button,
          disabled || loading ? styles.disabled : styles.enabled,
          !value && styles.empty
        )}
      >
        <div className={styles.buttonContent}>
          <span className={styles.buttonText}>{loading ? "Загрузка..." : selectedLabel}</span>
          <svg 
            className={cn(styles.buttonIcon, isOpen && styles.open)} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {/* Search input */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск..."
              className={styles.searchInput}
              autoFocus
            />
          </div>

          {/* Tree list */}
          <div className={styles.treeList}>
            {filteredData.length === 0 ? (
              <div className={styles.emptyState}>
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
