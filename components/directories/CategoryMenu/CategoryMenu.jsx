"use client"

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/app/lib/utils'
import styles from './CategoryMenu.module.scss'

export function CategoryMenu({ category, onEdit, onDelete, onAddChild }) {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [isPositioned, setIsPositioned] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const isStatic = category?.isStatic === true

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      setIsPositioned(false)
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.right - 180 // 180px is min-width of dropdown
      })
      // Use requestAnimationFrame to ensure position is set before showing
      requestAnimationFrame(() => {
        setIsPositioned(true)
      })
    } else {
      setIsPositioned(false)
    }
  }, [isOpen])

  const handleEdit = (e) => {
    e.stopPropagation()
    setIsOpen(false)
    if (!category?.guid) {
      console.error('CategoryMenu: category.guid is missing!', category)
    }
    onEdit(category)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    setIsOpen(false)
    if (!category?.guid) {
      console.error('CategoryMenu: category.guid is missing!', category)
    }
    onDelete(category)
  }

  const handleAddChild = (e) => {
    e.stopPropagation()
    setIsOpen(false)
    if (!category?.guid) {
      console.error('CategoryMenu: category.guid is missing!', category)
    }
    if (onAddChild) {
      onAddChild(category)
    }
  }

  return (
    <div 
      className={styles.menuContainer}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        ref={buttonRef}
        className={styles.menuButton}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
      >
        <svg className={styles.menuIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
      
      {isOpen && typeof window !== 'undefined' && createPortal(
        <div 
          ref={menuRef}
          className={styles.menuDropdown}
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            opacity: isPositioned ? 1 : 0,
            visibility: isPositioned ? 'visible' : 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {isStatic ? (
            // For static items, only show "Add child" option
            <button
              className={styles.menuItem}
              onClick={handleAddChild}
            >
              <svg className={styles.menuItemIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Добавить дочерний</span>
            </button>
          ) : (
            // For non-static items, show all options
            <>
              <button
                className={styles.menuItem}
                onClick={handleAddChild}
              >
                <svg className={styles.menuItemIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Добавить дочерний</span>
              </button>
              <button
                className={styles.menuItem}
                onClick={handleEdit}
              >
                <svg className={styles.menuItemIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Редактировать</span>
              </button>
              <button
                className={cn(styles.menuItem, styles.menuItemDanger)}
                onClick={handleDelete}
              >
                <svg className={styles.menuItemIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Удалить</span>
              </button>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}
