"use client"

import { useState } from 'react'
import { cn } from '@/app/lib/utils'

export default function TransactionCategoriesPage() {
  const [activeTab, setActiveTab] = useState('income')
  const [expandedCategories, setExpandedCategories] = useState([1, 2, 3])
  const [selectedCategory, setSelectedCategory] = useState(null)

  const toggleCategory = (id) => {
    setExpandedCategories(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    )
  }

  const categories = [
    { 
      id: 1, 
      name: 'Услуги ремонта',
      icon: '⚙️'
    },
    { 
      id: 2, 
      name: 'Поступление от заказчика',
      icon: '📥'
    },
    { 
      id: 3, 
      name: 'Прочие доходы', 
      icon: '📊',
      children: [
        { id: 31, name: 'Проценты по выданным займам', icon: '💰' }
      ]
    },
    { 
      id: 4, 
      name: 'Курсовая разница (+)', 
      badge: 'АРХИВ',
      icon: '💱'
    }
  ]

  const tabs = [
    { key: 'income', label: 'Доходы' },
    { key: 'expense', label: 'Расходы' },
    { key: 'assets', label: 'Активы' },
    { key: 'liabilities', label: 'Обязательства' },
    { key: 'capital', label: 'Капитал' }
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[20px] font-semibold text-slate-900">Учетные статьи</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по названию"
                className="w-[280px] pl-9 pr-4 py-2 text-[13px] border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17a2b8]"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-4 py-2 text-[13px] transition-colors rounded border",
                  activeTab === tab.key
                    ? "text-[#17a2b8] border-[#17a2b8] bg-white"
                    : "text-slate-600 hover:text-slate-900 border-slate-300 bg-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex">
          {/* Left Sidebar - Category Tree */}
          <div className="w-[400px] bg-white border-r border-slate-200 overflow-y-auto">
            <div className="p-4">
              {categories.map((category) => (
                <div key={category.id} className="mb-1">
                  <div 
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded cursor-pointer transition-colors group",
                      selectedCategory === category.id ? "bg-slate-100" : "hover:bg-slate-50"
                    )}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.children && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleCategory(category.id)
                        }}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <svg 
                          className={cn("w-4 h-4 transition-transform", expandedCategories.includes(category.id) && "rotate-90")} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                    {!category.children && <div className="w-4"></div>}
                    
                    <span className="text-[13px] flex-1 text-slate-700">{category.name}</span>
                    
                    {category.badge && (
                      <span className="px-2 py-0.5 text-[10px] bg-slate-200 text-slate-600 rounded">
                        {category.badge}
                      </span>
                    )}
                    
                    <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>

                  {/* Children */}
                  {category.children && expandedCategories.includes(category.id) && (
                    <div className="ml-6 mt-1">
                      {category.children.map((child) => (
                        <div
                          key={child.id}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors group",
                            selectedCategory === child.id ? "bg-slate-100" : "hover:bg-slate-50"
                          )}
                          onClick={() => setSelectedCategory(child.id)}
                        >
                          <span className="text-[13px] flex-1 text-slate-600">{child.name}</span>
                          <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Cards */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <p className="text-[14px] text-slate-600 mb-6">
                Эта схема наглядно показывает, как статьи участвуют в формировании отчета Баланс
              </p>

              <div className="grid grid-cols-2 gap-4">
                {/* Движение денег */}
                <div className="bg-white rounded-lg border-2 border-[#7dd3de] p-4">
                  <h3 className="text-[18px] font-bold text-slate-900 mb-3 pb-3 border-b border-slate-200">Движение денег</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-[15px] font-semibold text-slate-900 mb-1.5">Операционный поток</div>
                      <div className="space-y-0.5 ml-4">
                        <div className="text-[14px] text-slate-700">Поступления</div>
                        <div className="text-[14px] text-slate-700">Выплаты</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <div className="text-[15px] font-semibold text-slate-900 mb-1.5">Инвестиционный поток</div>
                      <div className="space-y-0.5 ml-4">
                        <div className="text-[14px] text-slate-700">Поступления</div>
                        <div className="text-[14px] text-slate-700">Выплаты</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <div className="text-[15px] font-semibold text-slate-900 mb-1.5">Финансовый поток</div>
                      <div className="space-y-0.5 ml-4">
                        <div className="text-[14px] text-slate-700">Поступления</div>
                        <div className="text-[14px] text-slate-700">Выплаты</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-300">
                      <div className="text-[15px] font-bold text-slate-900">ОБЩИЙ ДЕНЕЖНЫЙ ПОТОК</div>
                    </div>
                  </div>
                </div>

                {/* Баланс */}
                <div className="bg-white rounded-lg border-2 border-[#7dd3de] p-4">
                  <h3 className="text-[18px] font-bold text-slate-900 mb-3 pb-3 border-b border-slate-200">Баланс</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-[15px] font-semibold text-slate-900">Оборотные активы</div>
                        <span className="px-2 py-0.5 text-[11px] bg-slate-300 text-slate-700 rounded font-medium">0</span>
                      </div>
                      <div className="space-y-0.5 ml-4">
                        <div className="text-[14px] text-slate-700">Дебиторская задолженность</div>
                        <div className="text-[14px] text-slate-700">Денежные средства</div>
                        <div className="text-[14px] text-slate-700">Запасы</div>
                        <div className="text-[14px] text-slate-700">Другие оборотные</div>
                        <div className="text-[14px] text-slate-700 ml-4">Заготовые платежи</div>
                        <div className="text-[14px] text-slate-700 ml-4">Выданные займы (до 1 года)</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-[15px] font-semibold text-slate-900 flex items-center gap-2">
                          Внеоборотные активы
                          <span className="px-2 py-0.5 text-[11px] bg-slate-700 text-white rounded font-medium">И</span>
                        </div>
                      </div>
                      <div className="space-y-0.5 ml-4">
                        <div className="text-[14px] text-slate-700">Основные средства</div>
                        <div className="text-[14px] text-slate-700">Оборудование</div>
                        <div className="text-[14px] text-slate-700">Транспорт</div>
                        <div className="text-[14px] text-slate-700">Другие внеоборотные</div>
                        <div className="text-[14px] text-slate-700 ml-4">Выданные займы (от 1 года)</div>
                        <div className="text-[14px] text-slate-700 ml-4">Финансовые вложения</div>
                        <div className="text-[14px] text-slate-700 ml-4">Нематериальные активы</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-300">
                      <div className="text-[15px] font-bold text-slate-900">ИТОГО АКТИВЫ</div>
                    </div>
                  </div>
                </div>

                {/* Прибыли и убытки */}
                <div className="bg-white rounded-lg border-2 border-[#7dd3de] p-4">
                  <h3 className="text-[18px] font-bold text-slate-900 mb-3 pb-3 border-b border-slate-200">Прибыли и убытки</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-[15px] font-semibold text-slate-900">Доходы</div>
                        <span className="px-2 py-0.5 text-[11px] bg-slate-300 text-slate-700 rounded font-medium">0</span>
                      </div>
                      <div className="space-y-0.5 ml-4">
                        <div className="text-[14px] text-slate-700">Продажа товаров</div>
                        <div className="text-[14px] text-slate-700">Оказание услуг</div>
                        <div className="text-[14px] text-slate-700">Прочие доходы</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-[15px] font-semibold text-slate-900 flex items-center gap-2">
                          <span className="text-red-500 text-[12px]">минус</span>
                          Расходы
                        </div>
                        <span className="px-2 py-0.5 text-[11px] bg-slate-300 text-slate-700 rounded font-medium">0</span>
                      </div>
                      <div className="space-y-0.5 ml-4">
                        <div className="text-[14px] text-slate-700">Производственный персонал</div>
                        <div className="text-[14px] text-slate-700">Покупка товаров</div>
                        <div className="text-[14px] text-slate-700">Административный персонал</div>
                        <div className="text-[14px] text-slate-700">Аренда</div>
                        <div className="text-[14px] text-slate-700">Прочие расходы</div>
                        <div className="text-[14px] text-slate-700 ml-4">Банковские услуги</div>
                        <div className="text-[14px] text-slate-700 ml-4 flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] bg-slate-400 text-white rounded">скоро</span>
                          Курсовая разница минус
                        </div>
                        <div className="text-[14px] text-slate-700 ml-4">Амортизация</div>
                        <div className="text-[14px] text-slate-700 ml-4">Проценты</div>
                        <div className="text-[14px] text-slate-700 ml-4">Налог на прибыль (доходы)</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-300">
                      <div className="text-[15px] font-bold text-slate-900">НЕРАСПРЕДЕЛЕННАЯ ПРИБЫЛЬ</div>
                    </div>
                  </div>
                </div>

                {/* Обязательства и Капитал */}
                <div className="space-y-4">
                  {/* Краткосрочные и Долгосрочные обязательства */}
                  <div className="bg-white rounded-lg border-2 border-[#7dd3de] p-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="text-[15px] font-semibold text-slate-900">Краткосрочные обязательства</div>
                          <span className="px-2 py-0.5 text-[11px] bg-slate-300 text-slate-700 rounded font-medium">0</span>
                        </div>
                        <div className="space-y-0.5 ml-4">
                          <div className="text-[14px] text-slate-700">Кредиторская задолженность</div>
                          <div className="text-[14px] text-slate-700">Другие краткосрочные</div>
                          <div className="text-[14px] text-slate-700 ml-4">Платежи третьим лицам</div>
                          <div className="text-[14px] text-slate-700 ml-4">Полученные займы (до 1 года)</div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="text-[15px] font-semibold text-slate-900 flex items-center gap-2">
                            Долгосрочные обязательства
                            <span className="px-2 py-0.5 text-[11px] bg-[#17a2b8] text-white rounded font-medium">Ф</span>
                          </div>
                        </div>
                        <div className="space-y-0.5 ml-4">
                          <div className="text-[14px] text-slate-700">Кредиты</div>
                          <div className="text-[14px] text-slate-700">Другие долгосрочные</div>
                          <div className="text-[14px] text-slate-700 ml-4">Полученные займы (от 1 года)</div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-300">
                        <div className="text-[15px] font-bold text-slate-900">ИТОГО ОБЯЗАТЕЛЬСТВА</div>
                      </div>
                    </div>
                  </div>

                  {/* Капитал */}
                  <div className="bg-white rounded-lg border-2 border-[#7dd3de] p-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="text-[15px] font-semibold text-slate-900 flex items-center gap-2">
                            Капитал
                            <span className="px-2 py-0.5 text-[11px] bg-[#17a2b8] text-white rounded font-medium">Ф</span>
                          </div>
                        </div>
                        <div className="space-y-0.5 ml-4">
                          <div className="text-[14px] text-slate-700">Вложения учредителей</div>
                          <div className="text-[14px] text-slate-700 flex items-center gap-2">
                            <span className="text-green-500 text-[12px]">плюс</span>
                            Нераспределенная прибыль
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-300">
                        <div className="text-[15px] font-bold text-slate-900">ИТОГО КАПИТАЛ</div>
                      </div>

                      <div className="pt-3 border-t-2 border-slate-900">
                        <div className="text-[15px] font-bold text-slate-900">АКТИВЫ = ОБЯЗАТЕЛЬСТВА + КАПИТАЛ</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
