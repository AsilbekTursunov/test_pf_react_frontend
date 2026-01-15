"use client"

import { cn } from '@/app/lib/utils'

export function OperationModal({ operation, modalType, isClosing, isOpening, onClose }) {
  if (!operation) return null

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={onClose}
        className={cn(
          "fixed left-[90px] top-[64px] right-0 bottom-0 z-40 cursor-pointer -mt-[9px] transition-opacity duration-300",
          isClosing ? "opacity-0" : "opacity-100"
        )}
        style={{ backgroundColor: 'lab(34.66 -0.95 -5.29 / 0.78)' }}
      />

      {/* Modal */}
      <div 
        className={cn(
          "fixed left-[90px] top-[64px] bottom-0 bg-white shadow-2xl z-50 flex pointer-events-auto -mt-[9px] transition-all duration-300 ease-out origin-left",
          isOpening ? "w-0 opacity-0" : isClosing ? "w-0 opacity-0" : "w-[80%] opacity-100"
        )}
        style={{ 
          clipPath: isOpening || isClosing ? 'inset(0 100% 0 0)' : 'inset(0 0 0 0)'
        }}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-200 px-6 py-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[20px] font-semibold text-slate-900">Редактирование операции</h2>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 text-[20px]"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Создана 14 янв '26 в 00:12</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-white p-6">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button className={cn(
                "px-4 py-2 text-[13px] rounded",
                modalType === 'income' ? "text-white bg-[#28a745]" : "text-slate-600 bg-slate-100"
              )}>
                Поступление
              </button>
              <button className={cn(
                "px-4 py-2 text-[13px] rounded",
                modalType === 'payment' ? "text-white bg-[#dc3545]" : "text-slate-600 bg-slate-100"
              )}>
                Выплата
              </button>
              <button className={cn(
                "px-4 py-2 text-[13px] rounded",
                modalType === 'transfer' ? "text-white bg-[#6c757d]" : "text-slate-600 bg-slate-100"
              )}>
                Перемещение
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Дата оплаты */}
              <div className="flex items-center gap-4">
                <label className="w-[140px] text-[13px] text-slate-900">Дата оплаты</label>
                <div className="flex-1 flex items-center gap-3">
                  <input 
                    type="text" 
                    value={operation.date}
                    readOnly
                    className="flex-1 px-3 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                  />
                  <button className="px-4 py-2 text-[13px] text-slate-600 border border-slate-300 rounded hover:bg-slate-50">
                    Подтвердить оплату
                  </button>
                </div>
              </div>

              {/* Счет и юрлицо */}
              <div className="flex items-center gap-4">
                <label className="w-[140px] text-[13px] text-slate-900">Счет и юрлицо</label>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={operation.account}
                    readOnly
                    className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">✕</button>
                </div>
              </div>

              {/* Сумма */}
              <div className="flex items-center gap-4">
                <label className="w-[140px] text-[13px] text-slate-900">Сумма</label>
                <div className="flex-1 flex items-center gap-3">
                  <input 
                    type="text" 
                    value={operation.amount.replace(/[+-]/g, '').trim()}
                    readOnly
                    className="flex-1 px-3 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                  />
                  <span className="text-[13px] text-slate-600">RUB (Российский рубль)</span>
                </div>
              </div>

              {/* Разбить сумму */}
              <div className="flex items-center gap-4">
                <div className="w-[140px]"></div>
                <button className="text-[13px] text-[#17a2b8] hover:text-[#138496]">Разбить сумму</button>
              </div>

              {/* Добавить начисление */}
              <div className="flex items-center gap-4">
                <div className="w-[140px]"></div>
                <button className="text-[13px] text-[#17a2b8] hover:text-[#138496]">Добавить начисление</button>
              </div>

              {/* Контрагент */}
              <div className="flex items-center gap-4">
                <label className="w-[140px] text-[13px] text-slate-900">Контрагент</label>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={operation.kontragent}
                    readOnly
                    className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">✕</button>
                </div>
              </div>

              {/* Статья */}
              <div className="flex items-center gap-4">
                <label className="w-[140px] text-[13px] text-slate-900">Статья</label>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={operation.category}
                    readOnly
                    className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">✕</button>
                </div>
              </div>

              {/* Проект */}
              <div className="flex items-center gap-4">
                <label className="w-[140px] text-[13px] text-slate-900">Проект</label>
                <select className="flex-1 px-3 py-2 text-[13px] text-slate-500 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]">
                  <option>{operation.project || 'Не выбран'}</option>
                </select>
              </div>

              {/* Сделка закупки */}
              <div className="flex items-center gap-4">
                <label className="w-[140px] text-[13px] text-slate-900 flex items-center gap-1">
                  Сделка закупки
                  <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </label>
                <select className="flex-1 px-3 py-2 text-[13px] text-slate-500 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]">
                  <option>{operation.deal || 'Не выбран'}</option>
                </select>
              </div>

              {/* Назначение платежа */}
              <div className="flex items-start gap-4">
                <label className="w-[140px] text-[13px] text-slate-900 pt-2">Назначение платежа</label>
                <textarea 
                  placeholder="Назначение платежа"
                  rows="3"
                  className="flex-1 px-3 py-2 text-[13px] text-slate-500 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8] resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
