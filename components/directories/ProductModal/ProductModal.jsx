"use client"

import React, { useState, useEffect } from 'react'
import { cn } from '@/app/lib/utils'
import styles from './ProductModal.module.scss'

export default function ProductModal({ isOpen, onClose, type = 'product' }) {
  const [formData, setFormData] = useState({
    name: '',
    article: '',
    unit: 'Штука (шт)',
    group: '',
    price: '0.00',
    currency: 'RUB',
    nds: '0%',
    comment: '',
    createAnother: false
  })
  
  const [errors, setErrors] = useState({})
  const [isClosing, setIsClosing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false)
      setIsVisible(true)
      setFormData({
        name: '',
        article: '',
        unit: 'Штука (шт)',
        group: '',
        price: '0.00',
        currency: 'RUB',
        nds: '0%',
        comment: '',
        createAnother: false
      })
      setErrors({})
    }
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 250)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Укажите название'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData)
      if (!formData.createAnother) {
        handleClose()
      } else {
        setFormData({
          ...formData,
          name: '',
          article: '',
          group: '',
          price: '0.00',
          nds: '0%',
          comment: ''
        })
        setErrors({})
      }
    }
  }

  if (!isOpen && !isVisible) return null

  return (
    <>
      <div 
        className={cn(styles.overlay, isClosing ? styles.closing : styles.opening)}
        onClick={handleClose}
      />

      <div 
        className={cn(styles.modal, isClosing ? styles.closing : styles.opening)}
        style={{
          width: type === 'product' ? '760px' : '1000px',
          maxHeight: '90vh'
        }}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>
            {type === 'product' ? 'Создание товара' : 'Создать группу'}
          </h2>
          <button onClick={handleClose} className={styles.closeButton}>
            <svg className={styles.closeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.content} style={{ maxHeight: 'calc(90vh - 180px)' }}>
          {type === 'product' ? (
            <div className={styles.form}>
              <div className={styles.formRow}>
                <label className={styles.label}>Название товара</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Например, кафельная плитка"
                    className={cn(styles.input, errors.name ? styles.error : styles.normal)}
                  />
                  {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
                </div>
              </div>

              <div className={styles.formRow}>
                <label className={styles.label}>Артикул</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    value={formData.article}
                    onChange={(e) => setFormData({ ...formData, article: e.target.value })}
                    placeholder="Введите артикул"
                    className={cn(styles.input, styles.default)}
                    style={{ flex: 1 }}
                  />
                  <div className={styles.inputGroupRow}>
                    <span className={styles.inputText}>Единица измерения</span>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className={cn(styles.select, styles.default)}
                    >
                      <option>Штука (шт)</option>
                      <option>Метр (м)</option>
                      <option>М² (м 2)</option>
                      <option>Килограмм (кг)</option>
                      <option>Литр (л)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <label className={styles.label}>Группа товаров</label>
                <div className={styles.inputGroup}>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    className={cn(styles.select, styles.default)}
                  >
                    <option value="">Выберите группу</option>
                    <option>Строительные материалы</option>
                    <option>Отделочные материалы</option>
                    <option>Инструменты</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <label className={cn(styles.label, styles.labelWithIcon)}>
                  Цена продажи
                  <svg className={styles.labelIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
                  </svg>
                </label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={cn(styles.input, styles.default)}
                    style={{ width: '180px' }}
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className={cn(styles.select, styles.default)}
                  >
                    <option>RUB</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                  <span className={cn(styles.inputText, styles.inputSpacer)}>НДС</span>
                  <input
                    type="text"
                    value={formData.nds}
                    onChange={(e) => setFormData({ ...formData, nds: e.target.value })}
                    className={cn(styles.input, styles.default)}
                    style={{ width: '120px' }}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <label className={styles.label}>Комментарий</label>
                <div className={styles.inputGroup}>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Добавьте комментарий к этому товару"
                    rows={4}
                    className={styles.textarea}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.form}>
              <div className={styles.formRow}>
                <label className={styles.label}>Название группы</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Например, расходные материалы"
                    className={cn(styles.input, errors.name ? styles.error : styles.normal)}
                  />
                  {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
                </div>
              </div>

              <div className={styles.formRow}>
                <label className={styles.label}>Комментарий</label>
                <div className={styles.inputGroup}>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Описание группы"
                    rows={4}
                    className={styles.textarea}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          {type === 'product' && (
            <label className={styles.checkboxLabel}>
              <div 
                onClick={() => setFormData({ ...formData, createAnother: !formData.createAnother })}
                className={styles.checkbox}
                style={{
                  backgroundColor: formData.createAnother ? '#6366f1' : 'white',
                  borderColor: formData.createAnother ? '#6366f1' : '#9ca3af'
                }}
              >
                {formData.createAnother && (
                  <svg className={styles.checkboxIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={styles.checkboxText}>Создать еще один товар</span>
            </label>
          )}
          {type === 'group' && <div className={styles.footerLeft} />}
          
          <div className={styles.footerRight}>
            <button onClick={handleClose} className={styles.cancelButton}>
              Отменить
            </button>
            <button onClick={handleSubmit} className={styles.submitButton}>
              Создать
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
