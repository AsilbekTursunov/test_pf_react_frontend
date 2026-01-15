"use client"

import { useState } from 'react'
import Link from 'next/link'
import { OperationsTable } from '@/components/operations/OperationsTable'

export default function KontragentDetailPage({ params }) {
  const [accountingMethod, setAccountingMethod] = useState('cash')

  // Mock data - в реальном приложении загружается по params.id
  const kontragent = {
    id: 1,
    name: 'Алексеенко М.Ф.',
    dateRange: '31.12.21 – 20.03.26',
    receipts: '+5 000 000 ₽',
    payments: '-1 210 000 ₽',
    difference: '+3 790 000 ₽',
    debit: 'Нет задолженности',
    credit: 'Нет задолженности',
    fullName: 'Полное название не указано',
    type: 'Смешанный'
  }

  const operations = [
    { id: 1, date: '20 мар 2026', account: 'Т-Банк', type: 'out', kontragent: 'Алексеенко М.Ф.', category: '[undefined]', project: '', deal: '', amount: '-70 000' },
    { id: 2, date: '20 мар 2026', account: 'Карта физ. лица', type: 'out', kontragent: 'Алексеенко М.Ф.', category: '[undefined]', project: '', deal: '', amount: '-30 000' },
    { id: 3, date: '20 фев 2026', account: 'Т-Банк', type: 'out', kontragent: 'Алексеенко М.Ф.', category: '[undefined]', project: '', deal: '', amount: '-70 000' },
    { id: 4, date: '20 фев 2026', account: 'Карта физ. лица', type: 'out', kontragent: 'Алексеенко М.Ф.', category: '[undefined]', project: '', deal: '', amount: '-30 000' },
    { id: 5, date: '20 окт 2025', account: 'Т-Банк', type: 'out', kontragent: 'Алексеенко М.Ф.', category: '[undefined]', project: '', deal: '', amount: '-70 000' },
    { id: 6, date: '20 окт 2025', account: 'Карта физ. лица', type: 'out', kontragent: 'Алексеенко М.Ф.', category: '[undefined]', project: '', deal: '', amount: '-30 000' },
    { id: 7, date: '20 сен 2025', account: 'Т-Банк', type: 'out', kontragent: 'Алексеенко М.Ф.', category: '[undefined]', project: '', deal: '', amount: '-70 000' },
    { id: 8, date: '20 сен 2025', account: 'Карта физ. лица', type: 'out', kontragent: 'Алексеенко М.Ф.', category: '[undefined]', project: '', deal: '', amount: '-30 000' },
    { id: 9, date: '21 авг 2025', account: 'Сейф', type: 'out', kontragent: 'Алексеенко М.Ф.', category: '[undefined]', project: '', deal: '', amount: '-650 000' },
    { id: 10, date: '20 авг 2025', account: 'Т-Банк', type: 'out', kontragent: 'Алексеенко М.Ф.', category: '[undefined]', project: '', deal: '', amount: '-70 000' },
    { id: 11, date: '20 авг 2025', account: 'Карта физ. лица', type: 'out', kontragent: 'Алексеенко М.Ф.', category: '[undefined]', project: '', deal: '', amount: '-30 000' },
    { id: 12, date: '20 июл 2025', account: 'Т-Банк', type: 'out', kontragent: 'Алексеенко М.Ф.', category: '[undefined]', project: '', deal: '', amount: '-70 000' },
    { id: 13, date: '20 июл 2025', account: 'Карта физ. лица', type: 'out', kontragent: 'Алексеенко М.Ф.', category: '[undefined]', project: '', deal: '', amount: '-30 000' },
    { id: 14, date: '31 дек 2021', account: 'Наличка', type: 'in', kontragent: 'Алексеенко М.Ф.', category: '[undefined]', project: '', deal: '', amount: '+5 000 000' }
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex-1 flex flex-col">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-slate-200 px-6 py-2">
          <div className="flex items-center gap-2 text-[13px]">
            <Link href="/spravochniki/kontragenty" className="text-slate-500 hover:text-slate-700">
              Список контрагентов
            </Link>
            <span className="text-slate-400">›</span>
            <span className="text-slate-900">Контрагент</span>
          </div>
        </div>

        {/* Header with kontragent info */}
        <div className="bg-slate-50 px-6 py-5 flex-shrink-0">
          <div className="flex items-center gap-6 mb-5">
            <h1 className="text-[22px] font-bold text-slate-900">{kontragent.name}</h1>
            <div className="flex items-center gap-2 text-[12px] text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span className="text-slate-600">31.12.21 – 20.03.26</span>
            </div>
            <select
              value={accountingMethod}
              onChange={(e) => setAccountingMethod(e.target.value)}
              className="px-3 py-1.5 text-[12px] text-slate-700 bg-white border border-slate-300 rounded hover:border-slate-400 transition-colors focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"
            >
              <option value="cash">Учет по денежному потоку</option>
              <option value="accrual">Учет по начислению</option>
            </select>
          </div>

          {/* Stats Grid */}
          <div className="flex gap-4">
            {/* Left Card - Financial Stats */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 min-w-[200px]">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5dade2]"></div>
                    <span className="text-[13px] text-slate-700">Поступления</span>
                  </div>
                  <div className="text-[20px] font-bold text-slate-900">+5 000 000 <span className="text-slate-400 text-[16px]">₽</span></div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f39c6b]"></div>
                    <span className="text-[13px] text-slate-700">Выплаты</span>
                  </div>
                  <div className="text-[20px] font-bold text-slate-900">-1 210 000 <span className="text-slate-400 text-[16px]">₽</span></div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#52c41a]"></div>
                    <span className="text-[13px] text-slate-700">Разница</span>
                  </div>
                  <div className="text-[20px] font-bold text-slate-900">+3 790 000 <span className="text-slate-400 text-[16px]">₽</span></div>
                </div>
              </div>
            </div>

            {/* Middle Column - Debit and Credit stacked */}
            <div className="flex flex-col gap-4 min-w-[180px]">
              {/* Debit Card */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 flex-1">
                <div className="text-[14px] text-slate-700 mb-1.5">Дебиторка</div>
                <div className="text-[13px] text-slate-400">Нет задолженности</div>
              </div>

              {/* Credit Card */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 flex-1">
                <div className="text-[14px] text-slate-700 mb-1.5">Кредиторка</div>
                <div className="text-[13px] text-slate-400">Нет задолженности</div>
              </div>
            </div>

            {/* Right Card - Additional Info (takes remaining space) */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[13px] text-slate-400">Полное название не указано</div>
                <div className="text-[13px] text-slate-400 text-right">Тип: смешанный</div>
              </div>
              <div className="text-center text-[13px] text-slate-400">Реквизиты контрагента отсутствуют</div>
            </div>
          </div>
        </div>

        {/* Operations Section */}
        <div className="flex-1 bg-white">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-semibold text-slate-900">Операции по контрагенту</h2>
              <button className="text-[13px] text-[#17a2b8] hover:text-[#138496] flex items-center gap-1">
                Фильтры
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-3 mb-4">
              <select className="px-3 py-2 text-[13px] text-slate-600 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]">
                <option>Юрлица и счета</option>
              </select>
              <select className="px-3 py-2 text-[13px] text-slate-600 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]">
                <option>Статьи учета</option>
              </select>
              <select className="px-3 py-2 text-[13px] text-slate-600 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]">
                <option>Проекты</option>
              </select>
              <select className="px-3 py-2 text-[13px] text-slate-600 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]">
                <option>Сделки</option>
              </select>
            </div>

            <OperationsTable 
              operations={operations}
              onRowClick={(operation) => console.log('Clicked:', operation)}
            />
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="bg-white border-t border-slate-200 px-6 py-3 sticky bottom-0 z-10">
          <div className="flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-6">
              <span className="text-slate-600">
                <span className="font-medium text-slate-900">{operations.length}</span> операций
              </span>
              <span className="text-slate-600">
                1 поступление: <span className="font-medium text-slate-900">5 000 000 ₽</span>
              </span>
              <span className="text-slate-600">
                19 выплат: <span className="font-medium text-slate-900">1 510 000 ₽</span>
              </span>
              <span className="text-slate-600">
                Итого: <span className="font-medium text-green-600">+3 490 000 ₽</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
