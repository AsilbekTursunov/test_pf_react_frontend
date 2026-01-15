"use client"

import { useState } from 'react'
import { cn } from '@/app/lib/utils'
import { OperationModal } from './OperationModal'

export function OperationsTable({ operations = [], onRowClick }) {
  const [selectedRows, setSelectedRows] = useState([])
  const [expandedRows, setExpandedRows] = useState([])
  const [openModal, setOpenModal] = useState(null)
  const [modalType, setModalType] = useState('payment')
  const [isModalClosing, setIsModalClosing] = useState(false)
  const [isModalOpening, setIsModalOpening] = useState(false)

  const toggleRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const openOperationModal = (operation) => {
    setOpenModal(operation)
    setIsModalClosing(false)
    setIsModalOpening(true)
    document.body.style.overflow = 'hidden'
    
    // Определяем тип модалки
    // type 'in' = поступление (зеленая стрелка ←) = income modal (зеленая)
    // type 'out' = выплата (красная стрелка →) = payment modal (красная)
    // type 'transfer' = перемещение = transfer modal (серая)
    if (operation.type === 'transfer') {
      setModalType('transfer')
    } else if (operation.type === 'in') {
      setModalType('income')
    } else if (operation.type === 'out') {
      setModalType('payment')
    }
    
    // Запускаем анимацию появления
    setTimeout(() => {
      setIsModalOpening(false)
    }, 50)
  }

  const closeOperationModal = () => {
    setIsModalClosing(true)
    document.body.style.overflow = 'auto'
    setTimeout(() => {
      setOpenModal(null)
      setIsModalClosing(false)
      setIsModalOpening(false)
    }, 300)
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="w-12 px-4 py-3"></th>
              <th className="px-4 py-3 text-left text-[13px] font-normal text-slate-500">Дата</th>
              <th className="px-4 py-3 text-left text-[13px] font-normal text-slate-500">Счет</th>
              <th className="px-4 py-3 text-left text-[13px] font-normal text-slate-500">Тип</th>
              <th className="px-4 py-3 text-left text-[13px] font-normal text-slate-500">Контрагент</th>
              <th className="px-4 py-3 text-left text-[13px] font-normal text-slate-500">Статья</th>
              <th className="px-4 py-3 text-left text-[13px] font-normal text-slate-500">Проект</th>
              <th className="px-4 py-3 text-left text-[13px] font-normal text-slate-500">Сделка</th>
              <th className="px-4 py-3 text-right text-[13px] font-normal text-slate-500">Сумма</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {operations.map((operation) => (
              <tr
                key={operation.id}
                className={cn(
                  "hover:bg-slate-50 transition-colors cursor-pointer",
                  selectedRows.includes(operation.id) && "bg-blue-50"
                )}
                onClick={() => openOperationModal(operation)}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(operation.id)}
                        onChange={() => toggleRow(operation.id)}
                        className="peer sr-only"
                      />
                      <div className={cn(
                        "w-[18px] h-[18px] rounded-sm border-2 flex items-center justify-center transition-all cursor-pointer",
                        selectedRows.includes(operation.id)
                          ? "bg-[#17a2b8] border-[#17a2b8]"
                          : "border-slate-300 hover:border-slate-400"
                      )}>
                        {selectedRows.includes(operation.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-[#17a2b8]">{operation.date}</td>
                <td className="px-4 py-3 text-[13px] text-slate-700">{operation.account}</td>
                <td className="px-4 py-3 text-[13px]">
                  <span className={operation.type === 'in' ? 'text-green-500' : 'text-red-500'}>
                    {operation.type === 'in' ? '←' : '→'}
                  </span>
                </td>
                <td className="px-4 py-3 text-[13px] text-[#17a2b8]">{operation.kontragent}</td>
                <td className="px-4 py-3 text-[13px] text-[#17a2b8]">{operation.category}</td>
                <td className="px-4 py-3 text-[13px] text-slate-700">{operation.project}</td>
                <td className="px-4 py-3 text-[13px] text-slate-700">{operation.deal}</td>
                <td className="px-4 py-3 text-[13px] text-right">
                  <span className={operation.amount.startsWith('+') ? 'text-green-600' : operation.amount.startsWith('-') ? 'text-red-600' : ''}>
                    {operation.amount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <OperationModal 
        operation={openModal}
        modalType={modalType}
        isClosing={isModalClosing}
        isOpening={isModalOpening}
        onClose={closeOperationModal}
      />
    </>
  )
}
