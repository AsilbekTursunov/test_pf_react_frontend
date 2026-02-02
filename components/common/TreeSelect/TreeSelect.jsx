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
      <div
        className={cn(
          styles.treeNode,
          isSelected && styles.selected,
          !node.selectable && !hasChildren && styles.disabled
        )}
        style={{ paddingLeft: `${12 + level * 20}px` }}
      >
        {hasChildren ? (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleNode(node.value)
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className={styles.treeNodeIconButton}
            >
              <svg 
                className={cn(styles.treeNodeIcon, isExpanded && styles.expanded)} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (node.selectable) {
                  onSelect(node)
                }
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className={styles.treeNodeTextButton}
              disabled={!node.selectable}
            >
              <span className={styles.treeNodeText}>{node.title}</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (node.selectable) {
                onSelect(node)
              }
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className={styles.treeNodeTextButton}
            disabled={!node.selectable}
          >
            <span className={styles.treeNodeSpacer} />
            <span className={styles.treeNodeText}>{node.title}</span>
          </button>
        )}
      </div>

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
  loading = false,
  allowRoot = false
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [expandedNodes, setExpandedNodes] = useState(new Set())
  const [isRoot, setIsRoot] = useState(!value)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event) => {
      const target = event.target
      if (!target) return

      // Check if click is on the button that opens the dropdown
      if (buttonRef.current && buttonRef.current.contains(target)) {
        return
      }

      // Check if click is inside the dropdown
      if (dropdownRef.current && dropdownRef.current.contains(target)) {
        return
      }

      // Check if click is on modal overlay - don't close if it is
      if (target instanceof HTMLElement) {
        const isModalOverlay = target.classList.contains('overlay') || 
                               target.closest('.modal') !== null ||
                               target.closest('[class*="overlay"]') !== null
        
        if (!isModalOverlay) {
          setIsOpen(false)
        }
      } else {
        setIsOpen(false)
      }
    }

    // Use setTimeout to avoid immediate closure when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

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
  const selectedLabel = isRoot && allowRoot 
    ? "Корневой элемент" 
    : selectedNode 
      ? selectedNode.title 
      : placeholder
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
      setIsRoot(false)
      onChange(node.value, node)
      setIsOpen(false)
      setSearch('')
    }
  }

  const handleRootToggle = (e) => {
    e.stopPropagation()
    const newIsRoot = e.target.checked
    setIsRoot(newIsRoot)
    if (newIsRoot) {
      onChange(null, null)
    }
  }

  // Update isRoot when value changes externally
  useEffect(() => {
    setIsRoot(!value)
  }, [value])

  return (
    <div className={cn(styles.container, className)} ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          if (!disabled) {
            setIsOpen(!isOpen)
          }
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
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
        <div 
          className={styles.dropdown}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Search input */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск..."
              className={styles.searchInput}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          </div>

          {/* Root checkbox option */}
          {allowRoot && (
            <div className={styles.rootOption}>
              <label className={styles.rootCheckboxLabel}>
                <input
                  type="checkbox"
                  checked={isRoot}
                  onChange={handleRootToggle}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={styles.rootCheckbox}
                />
                <span className={styles.rootCheckboxText}>Создать как корневой элемент</span>
              </label>
            </div>
          )}

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
