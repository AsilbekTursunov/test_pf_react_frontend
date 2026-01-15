"use client"

import React, { useState, useEffect } from 'react'
import { cn } from '@/app/lib/utils'

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
      // Reset form when opening
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
    
    if (type === 'product') {
      if (!formData.name.trim()) {
        newErrors.name = 'Укажите название'
      }
    } else {
      if (!formData.name.trim()) {
        newErrors.name = 'Укажите название'
      }
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
        // Reset form but keep createAnother checked
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
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-250",
          isClosing ? "opacity-0" : "opacity-100"
        )}
        style={{ 
          backgroundColor: 'lab(34.66 -0.95 -5.29 / 0.78)'
        }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div 
        className={cn(
          "fixed left-1/2 top-1/2 z-50 bg-white rounded-lg shadow-2xl transition-all duration-250",
          isClosing 
            ? "opacity-0 scale-95 -translate-x-1/2 -translate-y-[48%]" 
            : "opacity-100 scale-100 -translate-x-1/2 -translate-y-1/2"
        )}
        style={{
          width: type === 'product' ? '760px' : '1000px',
          maxHeight: '90vh'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200">
          <h2 className="text-[28px] font-bold text-slate-900">
            {type === 'product' ? 'Создание товара' : 'Создать группу'}
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          {type === 'product' ? (
            <div className="space-y-6">
              {/* Название товара */}
              <div className="flex items-start gap-6">
                <label className="w-[180px] pt-3 text-[15px] text-slate-900 flex-shrink-0">
                  Название товара
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Например, кафельная плитка"
                    className={cn(
                      "w-full px-4 py-3 text-[15px] border rounded focus:outline-none transition-colors",
                      errors.name 
                        ? "border-red-500 focus:border-red-500" 
                        : "border-[#17a2b8] focus:border-[#17a2b8]"
                    )}
                  />
                  {errors.name && (
                    <p className="mt-2 text-[13px] text-red-500">{errors.name}</p>
                  )}
                </div>
              </div>

              {/* Артикул и Единица измерения */}
              <div className="flex items-start gap-6">
                <label className="w-[180px] pt-3 text-[15px] text-slate-900 flex-shrink-0">
                  Артикул
                </label>
                <div className="flex-1 flex gap-4">
                  <input
                    type="text"
                    value={formData.article}
                    onChange={(e) => setFormData({ ...formData, article: e.target.value })}
                    placeholder="Введите артикул"
                    className="flex-1 px-4 py-3 text-[15px] border border-slate-300 rounded focus:outline-none focus:border-[#17a2b8] transition-colors"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-[15px] text-slate-900 whitespace-nowrap">Единица измерения</span>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="px-4 py-3 text-[15px] border border-slate-300 rounded focus:outline-none focus:border-[#17a2b8] transition-colors bg-white"
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

              {/* Группа товаров */}
              <div className="flex items-start gap-6">
                <label className="w-[180px] pt-3 text-[15px] text-slate-900 flex-shrink-0">
                  Группа товаров
                </label>
                <div className="flex-1">
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    className="w-full px-4 py-3 text-[15px] text-slate-400 border border-slate-300 rounded focus:outline-none focus:border-[#17a2b8] transition-colors bg-white"
                  >
                    <option value="">Выберите группу</option>
                    <option>Строительные материалы</option>
                    <option>Отделочные материалы</option>
                    <option>Инструменты</option>
                  </select>
                </div>
              </div>

              {/* Цена продажи */}
              <div className="flex items-start gap-6">
                <label className="w-[180px] pt-3 text-[15px] text-slate-900 flex-shrink-0 flex items-center gap-2">
                  Цена продажи
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
                  </svg>
                </label>
                <div className="flex-1 flex gap-4 items-center">
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-[180px] px-4 py-3 text-[15px] border border-slate-300 rounded focus:outline-none focus:border-[#17a2b8] transition-colors"
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="px-4 py-3 text-[15px] border border-slate-300 rounded focus:outline-none focus:border-[#17a2b8] transition-colors bg-white"
                  >
                    <option>RUB</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                  <span className="text-[15px] text-slate-900 ml-8">НДС</span>
                  <input
                    type="text"
                    value={formData.nds}
                    onChange={(e) => setFormData({ ...formData, nds: e.target.value })}
                    className="w-[120px] px-4 py-3 text-[15px] border border-slate-300 rounded focus:outline-none focus:border-[#17a2b8] transition-colors"
                  />
                </div>
              </div>

              {/* Комментарий */}
              <div className="flex items-start gap-6">
                <label className="w-[180px] pt-3 text-[15px] text-slate-900 flex-shrink-0">
                  Комментарий
                </label>
                <div className="flex-1">
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Добавьте комментарий к этому товару"
                    rows={4}
                    className="w-full px-4 py-3 text-[15px] border border-slate-300 rounded focus:outline-none focus:border-[#17a2b8] transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Название группы */}
              <div className="flex items-start gap-6">
                <label className="w-[180px] pt-3 text-[15px] text-slate-900 flex-shrink-0">
                  Название группы
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Например, расходные материалы"
                    className={cn(
                      "w-full px-4 py-3 text-[15px] border rounded focus:outline-none transition-colors",
                      errors.name 
                        ? "border-red-500 focus:border-red-500" 
                        : "border-[#17a2b8] focus:border-[#17a2b8]"
                    )}
                  />
                  {errors.name && (
                    <p className="mt-2 text-[13px] text-red-500">{errors.name}</p>
                  )}
                </div>
              </div>

              {/* Комментарий */}
              <div className="flex items-start gap-6">
                <label className="w-[180px] pt-3 text-[15px] text-slate-900 flex-shrink-0">
                  Комментарий
                </label>
                <div className="flex-1">
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Описание группы"
                    rows={4}
                    className="w-full px-4 py-3 text-[15px] border border-slate-300 rounded focus:outline-none focus:border-[#17a2b8] transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-slate-200">
          {type === 'product' && (
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div 
                onClick={() => setFormData({ ...formData, createAnother: !formData.createAnother })}
                className="w-[20px] h-[20px] border-2 rounded flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: formData.createAnother ? '#17a2b8' : 'white',
                  borderColor: formData.createAnother ? '#17a2b8' : '#94a3b8'
                }}
              >
                {formData.createAnother && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-[15px] text-slate-900">Создать еще один товар</span>
            </label>
          )}
          {type === 'group' && <div />}
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="px-6 py-3 text-[15px] text-[#17a2b8] hover:text-[#138496] transition-colors font-medium"
            >
              Отменить
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 text-[15px] bg-[#17a2b8] text-white rounded hover:bg-[#138496] transition-colors font-medium"
            >
              Создать
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
