"use client"

import { useState, useEffect } from 'react'
import { cn } from '@/app/lib/utils'
import { useFinancialAccounts } from '@/hooks/useDashboard'

export default function TransactionCategoriesPage() {
  // Fetch financial accounts from API
  const { data: financialAccountsData, isLoading } = useFinancialAccounts()
  const financialAccounts = financialAccountsData?.data?.data?.data || []
  
  const [activeTab, setActiveTab] = useState('income')
  const [expandedCategories, setExpandedCategories] = useState([1, 2, 3])
  const [closingCategories, setClosingCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  const toggleCategory = (id) => {
    if (expandedCategories.includes(id)) {
      // Find all children that are also expanded
      const findAllChildren = (parentId) => {
        const children = []
        const parent = categories.find(c => c.id === parentId)
        if (parent?.children) {
          parent.children.forEach(child => {
            if (expandedCategories.includes(child.id)) {
              children.push(child.id)
              if (child.children) {
                children.push(...findAllChildren(child.id))
              }
            }
          })
        }
        return children
      }
      
      const allToClose = [id, ...findAllChildren(id)]
      
      // Start closing animation for parent and all children
      setClosingCategories(prev => [...prev, ...allToClose])
      setTimeout(() => {
        setExpandedCategories(prev => prev.filter(cid => !allToClose.includes(cid)))
        setClosingCategories(prev => prev.filter(cid => !allToClose.includes(cid)))
      }, 250) // Match animation duration (0.25s)
    } else {
      setExpandedCategories(prev => [...prev, id])
    }
  }

  // Convert API tree data to tab structure
  const categoriesByTab = {}
  
  financialAccounts.forEach(rootNode => {
    let tabKey = 'income'
    
    // Map root types to tabs
    if (rootNode.type === 'Доходы' || rootNode.value === 'root_income') {
      tabKey = 'income'
    } else if (rootNode.type === 'Расходы' || rootNode.value === 'root_expenses') {
      tabKey = 'expense'
    } else if (rootNode.type === 'Активы' || rootNode.value === 'root_assets') {
      tabKey = 'assets'
    } else if (rootNode.type === 'Обязательства' || rootNode.value === 'root_obligations') {
      tabKey = 'liabilities'
    } else if (rootNode.type === 'Капитал' || rootNode.value === 'root_capital') {
      tabKey = 'capital'
    }
    
    // Convert tree structure to flat structure with children
    const convertNode = (node, parentId = null) => {
      const converted = {
        id: node.value,
        name: node.title,
        hasMenu: node.selectable,
        hasLock: !node.selectable,
        children: node.children && node.children.length > 0 
          ? node.children.map(child => convertNode(child, node.value))
          : undefined
      }
      return converted
    }
    
    if (rootNode.children) {
      categoriesByTab[tabKey] = rootNode.children.map(child => convertNode(child))
    }
  })

  const categories = categoriesByTab[activeTab] || []

  const tabs = [
    { key: 'income', label: 'Доходы' },
    { key: 'expense', label: 'Расходы' },
    { key: 'assets', label: 'Активы' },
    { key: 'liabilities', label: 'Обязательства' },
    { key: 'capital', label: 'Капитал' }
  ]

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey)
    setExpandedCategories([])
    setClosingCategories([])
    setSelectedCategory(null)
  }

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

          <div className="flex items-center">
            {tabs.map((tab, index) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={cn(
                  "px-4 py-2 text-[13px] transition-colors border",
                  index === 0 && "rounded-l",
                  index === tabs.length - 1 && "rounded-r",
                  index > 0 && "-ml-[1px]",
                  activeTab === tab.key
                    ? "text-[#17a2b8] border-[#17a2b8] bg-white z-10"
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
          <div className="w-[560px] bg-white border-r border-slate-200 overflow-y-auto">
            <div className="p-4 space-y-2" key={activeTab}>
              {categories.map((category, categoryIndex) => (
                <div 
                  key={`${activeTab}-${category.id}`}
                  style={{ 
                    animation: 'fadeSlideUp 0.3s ease-out',
                    animationDelay: `${categoryIndex * 0.06}s`,
                    animationFillMode: 'backwards'
                  }}
                >
                  <div 
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded border border-slate-200 bg-white cursor-pointer transition-colors group hover:border-slate-300",
                      selectedCategory === category.id && "border-[#17a2b8] bg-slate-50"
                    )}
                    onClick={() => {
                      if (category.children) {
                        toggleCategory(category.id)
                      } else {
                        setSelectedCategory(category.id)
                      }
                    }}
                  >
                    {category.children && (
                      <div className="text-slate-400 flex-shrink-0 w-4 h-4 flex items-center justify-center relative">
                        {/* Horizontal line (always visible) */}
                        <svg className="w-4 h-4 absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                        {/* Vertical line (rotates and fades) */}
                        <svg 
                          className={cn(
                            "w-4 h-4 absolute transition-all duration-300 ease-in-out",
                            expandedCategories.includes(category.id) ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                          )}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor" 
                          strokeWidth="2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V4" />
                        </svg>
                      </div>
                    )}
                    
                    <span className="text-[15px] flex-1 text-slate-800">{category.name}</span>
                    
                    {category.badge && (
                      <span className="px-2 py-0.5 text-[11px] text-slate-400 font-normal">
                        {category.badge}
                      </span>
                    )}
                    
                    {category.hasLock && (
                      <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                    
                    {category.hasMenu && (
                      <button 
                        className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="5" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="19" r="2" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Children - directly under parent */}
                  {category.children && (expandedCategories.includes(category.id) || closingCategories.includes(category.id)) && (
                    <div 
                      className="grid overflow-hidden"
                      style={{ 
                        animation: closingCategories.includes(category.id) 
                          ? 'collapseUp 0.25s ease-in-out' 
                          : 'expandDown 0.3s ease-out'
                      }}
                    >
                      <div className="ml-8 mt-2 space-y-2 min-h-0">
                        {category.children.map((child, childIndex) => (
                        <div key={child.id}>
                          <div
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded border border-slate-200 bg-white cursor-pointer transition-colors group hover:border-slate-300",
                              selectedCategory === child.id && "border-[#17a2b8] bg-slate-50"
                            )}
                            onClick={() => {
                              if (child.children) {
                                toggleCategory(child.id)
                              } else {
                                setSelectedCategory(child.id)
                              }
                            }}
                            style={{ 
                              animation: closingCategories.includes(category.id)
                                ? `fadeSlideOut 0.15s ease-in ${childIndex * 0.03}s backwards`
                                : `fadeSlideUp 0.2s ease-out ${childIndex * 0.05}s backwards`
                            }}
                          >
                            {child.children && (
                              <div className="text-slate-400 flex-shrink-0 w-4 h-4 flex items-center justify-center relative">
                                {/* Horizontal line (always visible) */}
                                <svg className="w-4 h-4 absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                </svg>
                                {/* Vertical line (rotates and fades) */}
                                <svg 
                                  className={cn(
                                    "w-4 h-4 absolute transition-all duration-300 ease-in-out",
                                    expandedCategories.includes(child.id) ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                                  )}
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor" 
                                  strokeWidth="2.5"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V4" />
                                </svg>
                              </div>
                            )}
                            
                            <span className="text-[15px] flex-1 text-slate-800">{child.name}</span>
                            
                            {child.badge && (
                              <span className="px-2 py-0.5 text-[11px] bg-slate-400 text-white rounded font-medium">
                                {child.badge}
                              </span>
                            )}
                            
                            {child.hasLock && (
                              <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            )}
                            
                            {child.hasMenu && (
                              <button 
                                className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="5" r="2" />
                                  <circle cx="12" cy="12" r="2" />
                                  <circle cx="12" cy="19" r="2" />
                                </svg>
                              </button>
                            )}
                          </div>

                          {/* Nested children (third level) - directly under their parent */}
                          {child.children && (expandedCategories.includes(child.id) || closingCategories.includes(child.id)) && (
                            <div 
                              className="grid overflow-hidden"
                              style={{ 
                                animation: closingCategories.includes(child.id) 
                                  ? 'collapseUp 0.25s ease-in-out' 
                                  : 'expandDown 0.3s ease-out'
                              }}
                            >
                              <div className="ml-8 mt-2 space-y-2 min-h-0">
                                {child.children.map((nestedChild, nestedIndex) => (
                                <div
                                  key={nestedChild.id}
                                  className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded border border-slate-200 bg-white cursor-pointer transition-colors group hover:border-slate-300",
                                    selectedCategory === nestedChild.id && "border-[#17a2b8] bg-slate-50"
                                  )}
                                  onClick={() => setSelectedCategory(nestedChild.id)}
                                  style={{ 
                                    animation: closingCategories.includes(child.id)
                                      ? `fadeSlideOut 0.15s ease-in ${nestedIndex * 0.03}s backwards`
                                      : `fadeSlideUp 0.2s ease-out ${nestedIndex * 0.05}s backwards`
                                  }}
                                >
                                  <span className="text-[15px] flex-1 text-slate-800">{nestedChild.name}</span>
                                  
                                  {nestedChild.badge && (
                                    <span className="px-2 py-0.5 text-[11px] bg-slate-400 text-white rounded font-medium">
                                      {nestedChild.badge}
                                    </span>
                                  )}
                                  
                                  {nestedChild.hasLock && (
                                    <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                  )}
                                  
                                  {nestedChild.hasMenu && (
                                    <button 
                                      className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="5" r="2" />
                                        <circle cx="12" cy="12" r="2" />
                                        <circle cx="12" cy="19" r="2" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Cards */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              <p className="text-[14px] text-slate-600 mb-6 text-center">
                Эта схема наглядно показывает, как статьи участвуют в формировании отчета Баланс
              </p>

              <div className="flex gap-4">
                {/* Left Column - 2 cards vertically */}
                <div className="flex-1 space-y-4">
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
                </div>

                {/* Right Column - 1 big card */}
                <div className="flex-1">
                  {/* Баланс */}
                  <div className="bg-white rounded-lg border-2 border-[#7dd3de] p-4 h-full">
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

                      <div className="pt-2 border-t border-slate-200">
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

                      <div className="pt-2 border-t border-slate-200">
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
