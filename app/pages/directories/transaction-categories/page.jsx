"use client"

import { useState, useEffect, useMemo } from 'react'
import { cn } from '@/app/lib/utils'
import { useChartOfAccounts } from '@/hooks/useDashboard'
import { getProjectId } from '@/lib/config/api'
import styles from './transaction-categories.module.scss'

export default function TransactionCategoriesPage() {
  // Get project ID from global config
  const projectId = getProjectId()
  
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

  const tabs = [
    { key: 'income', label: 'Доходы' },
    { key: 'expense', label: 'Расходы' },
    { key: 'assets', label: 'Активы' },
    { key: 'liabilities', label: 'Обязательства' },
    { key: 'capital', label: 'Капитал' }
  ]

  // Map tab keys to API tip values
  const tabToTipMap = {
    'income': 'Доходы',
    'expense': 'Расходы',
    'assets': 'Актив',
    'liabilities': 'Обязательства',
    'capital': 'Капитал'
  }

  // Fetch chart of accounts data for active tab
  // projectId is now taken from global config automatically
  const { data: chartOfAccountsData, isLoading: isLoadingChartOfAccounts, error: chartOfAccountsError } = useChartOfAccounts({
    tip: tabToTipMap[activeTab] ? [tabToTipMap[activeTab]] : [],
    limit: 100,
    offset: 0
  })

  const chartOfAccountsItems = chartOfAccountsData?.data?.data?.response || []
  
  // Convert chart of accounts items to category format for display
  const chartOfAccountsCategories = useMemo(() => {
    return chartOfAccountsItems.map(item => ({
      id: item.guid,
      name: item.nazvanie,
      hasMenu: true,
      hasLock: false,
      children: undefined
    }))
  }, [chartOfAccountsItems])

  // Use chart of accounts data
  const categories = chartOfAccountsCategories

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey)
    setExpandedCategories([])
    setClosingCategories([])
    setSelectedCategory(null)
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>Учетные статьи</h1>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Поиск по названию"
                className={styles.searchInput}
              />
              <svg className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
          </div>

          <div className={styles.tabsContainer}>
            {tabs.map((tab, index) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={cn(
                  styles.tab,
                  index === 0 && styles.first,
                  index === tabs.length - 1 && styles.last,
                  index > 0 && styles.notFirst,
                  activeTab === tab.key ? styles.active : styles.inactive
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={styles.contentArea}>
          {/* Left Sidebar - Category Tree */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarContent} key={activeTab}>
              {categories.map((category, categoryIndex) => (
                <div 
                  key={`${activeTab}-${category.id}`}
                  className={styles.categoryItem}
                  style={{ 
                    '--category-animation': `fadeSlideUp 0.3s ease-out ${categoryIndex * 0.06}s backwards`
                  }}
                >
                  <div 
                    className={cn(
                      styles.categoryCard,
                      selectedCategory === category.id && styles.selected
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
                      <div className={styles.expandIcon}>
                        {/* Horizontal line (always visible) */}
                        <svg className={styles.expandIconHorizontal} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                        {/* Vertical line (rotates and fades) */}
                        <svg 
                          className={cn(
                            styles.expandIconVertical,
                            expandedCategories.includes(category.id) ? styles.expanded : styles.collapsed
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
                    
                    <span className={styles.categoryName}>{category.name}</span>
                    
                    {category.badge && (
                      <span className={styles.categoryBadge}>
                        {category.badge}
                      </span>
                    )}
                    
                    {category.hasLock && (
                      <svg className={styles.lockIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                    
                    {category.hasMenu && (
                      <button 
                        className={styles.menuButton}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className={styles.menuIcon} fill="currentColor" viewBox="0 0 24 24">
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
                      className={styles.childrenContainer}
                      style={{ 
                        '--children-animation': closingCategories.includes(category.id) 
                          ? 'collapseUp 0.25s ease-in-out' 
                          : 'expandDown 0.3s ease-out'
                      }}
                    >
                      <div className={styles.childrenInner}>
                        {category.children.map((child, childIndex) => (
                        <div key={child.id} className={styles.childItem}>
                          <div
                            className={cn(
                              styles.categoryCard,
                              selectedCategory === child.id && styles.selected
                            )}
                            onClick={() => {
                              if (child.children) {
                                toggleCategory(child.id)
                              } else {
                                setSelectedCategory(child.id)
                              }
                            }}
                            style={{ 
                              '--child-animation': closingCategories.includes(category.id)
                                ? `fadeSlideOut 0.15s ease-in ${childIndex * 0.03}s backwards`
                                : `fadeSlideUp 0.2s ease-out ${childIndex * 0.05}s backwards`
                            }}
                          >
                            {child.children && (
                              <div className={styles.expandIcon}>
                                {/* Horizontal line (always visible) */}
                                <svg className={styles.expandIconHorizontal} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                </svg>
                                {/* Vertical line (rotates and fades) */}
                                <svg 
                                  className={cn(
                                    styles.expandIconVertical,
                                    expandedCategories.includes(child.id) ? styles.expanded : styles.collapsed
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
                            
                            <span className={styles.categoryName}>{child.name}</span>
                            
                            {child.badge && (
                              <span className={styles.categoryBadgeColored}>
                                {child.badge}
                              </span>
                            )}
                            
                            {child.hasLock && (
                              <svg className={styles.lockIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            )}
                            
                            {child.hasMenu && (
                              <button 
                                className={styles.menuButton}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <svg className={styles.menuIcon} fill="currentColor" viewBox="0 0 24 24">
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
                              className={styles.childrenContainer}
                              style={{ 
                                '--children-animation': closingCategories.includes(child.id) 
                                  ? 'collapseUp 0.25s ease-in-out' 
                                  : 'expandDown 0.3s ease-out'
                              }}
                            >
                              <div className={styles.childrenInner}>
                                {child.children.map((nestedChild, nestedIndex) => (
                                <div
                                  key={nestedChild.id}
                                  className={cn(
                                    styles.categoryCard,
                                    selectedCategory === nestedChild.id && styles.selected
                                  )}
                                  onClick={() => setSelectedCategory(nestedChild.id)}
                                  style={{ 
                                    '--child-animation': closingCategories.includes(child.id)
                                      ? `fadeSlideOut 0.15s ease-in ${nestedIndex * 0.03}s backwards`
                                      : `fadeSlideUp 0.2s ease-out ${nestedIndex * 0.05}s backwards`
                                  }}
                                >
                                  <span className={styles.categoryName}>{nestedChild.name}</span>
                                  
                                  {nestedChild.badge && (
                                    <span className={styles.categoryBadgeColored}>
                                      {nestedChild.badge}
                                    </span>
                                  )}
                                  
                                  {nestedChild.hasLock && (
                                    <svg className={styles.lockIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                  )}
                                  
                                  {nestedChild.hasMenu && (
                                    <button 
                                      className={styles.menuButton}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <svg className={styles.menuIcon} fill="currentColor" viewBox="0 0 24 24">
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
          <div className={styles.rightContent}>
            <div className={styles.rightContentInner}>
              <p className={styles.description}>
                Эта схема наглядно показывает, как статьи участвуют в формировании отчета Баланс
              </p>

              <div className={styles.cardsGrid}>
                {/* Left Column - 2 cards vertically */}
                <div className={styles.leftColumn}>
                  <div className={styles.cardsSpacing}>
                  {/* Движение денег */}
                  <div className={styles.card}>
                    <h3 className={styles.cardHeader}>Движение денег</h3>
                    
                    <div className={styles.cardContent}>
                      <div className={styles.section}>
                        <div className={styles.sectionHeader}>Операционный поток</div>
                        <div className={styles.sectionItems}>
                          <div className={styles.sectionItem}>Поступления</div>
                          <div className={styles.sectionItem}>Выплаты</div>
                        </div>
                      </div>

                      <div className={cn(styles.section, styles.sectionDivider)}>
                        <div className={styles.sectionHeader}>Инвестиционный поток</div>
                        <div className={styles.sectionItems}>
                          <div className={styles.sectionItem}>Поступления</div>
                          <div className={styles.sectionItem}>Выплаты</div>
                        </div>
                      </div>

                      <div className={cn(styles.section, styles.sectionDivider)}>
                        <div className={styles.sectionHeader}>Финансовый поток</div>
                        <div className={styles.sectionItems}>
                          <div className={styles.sectionItem}>Поступления</div>
                          <div className={styles.sectionItem}>Выплаты</div>
                        </div>
                      </div>

                      <div className={cn(styles.section, styles.sectionDividerBold)}>
                        <div className={styles.sectionTotal}>ОБЩИЙ ДЕНЕЖНЫЙ ПОТОК</div>
                      </div>
                    </div>
                  </div>

                  {/* Прибыли и убытки */}
                  <div className={styles.card}>
                    <h3 className={styles.cardHeader}>Прибыли и убытки</h3>
                    
                    <div className={styles.cardContent}>
                      <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                          <span>Доходы</span>
                          <span className={styles.badge}>0</span>
                        </div>
                        <div className={styles.sectionItems}>
                          <div className={styles.sectionItem}>Продажа товаров</div>
                          <div className={styles.sectionItem}>Оказание услуг</div>
                          <div className={styles.sectionItem}>Прочие доходы</div>
                        </div>
                      </div>

                      <div className={cn(styles.section, styles.sectionDivider)}>
                        <div className={styles.sectionHeader}>
                          <div className={styles.sectionHeaderWithIcon}>
                            <span className={styles.sectionHeaderText}>минус</span>
                            <span>Расходы</span>
                          </div>
                          <span className={styles.badge}>0</span>
                        </div>
                        <div className={styles.sectionItems}>
                          <div className={styles.sectionItem}>Производственный персонал</div>
                          <div className={styles.sectionItem}>Покупка товаров</div>
                          <div className={styles.sectionItem}>Административный персонал</div>
                          <div className={styles.sectionItem}>Аренда</div>
                          <div className={styles.sectionItem}>Прочие расходы</div>
                          <div className={cn(styles.sectionItem, styles.sectionItemNested)}>Банковские услуги</div>
                          <div className={cn(styles.sectionItem, styles.sectionItemNested, styles.sectionItemWithBadge)}>
                            <span className={styles.badgeSoon}>скоро</span>
                            <span>Курсовая разница минус</span>
                          </div>
                          <div className={cn(styles.sectionItem, styles.sectionItemNested)}>Амортизация</div>
                          <div className={cn(styles.sectionItem, styles.sectionItemNested)}>Проценты</div>
                          <div className={cn(styles.sectionItem, styles.sectionItemNested)}>Налог на прибыль (доходы)</div>
                        </div>
                      </div>

                      <div className={cn(styles.section, styles.sectionDividerBold)}>
                        <div className={styles.sectionTotal}>НЕРАСПРЕДЕЛЕННАЯ ПРИБЫЛЬ</div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

                {/* Right Column - 1 big card */}
                <div className={styles.rightColumn}>
                  {/* Баланс */}
                  <div className={cn(styles.card, styles.cardFullHeight)}>
                    <h3 className={styles.cardHeader}>Баланс</h3>
                    
                    <div className={styles.cardContent}>
                      <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                          <span>Оборотные активы</span>
                          <span className={styles.badge}>0</span>
                        </div>
                        <div className={styles.sectionItems}>
                          <div className={styles.sectionItem}>Дебиторская задолженность</div>
                          <div className={styles.sectionItem}>Денежные средства</div>
                          <div className={styles.sectionItem}>Запасы</div>
                          <div className={styles.sectionItem}>Другие оборотные</div>
                          <div className={cn(styles.sectionItem, styles.sectionItemNested)}>Заготовые платежи</div>
                          <div className={cn(styles.sectionItem, styles.sectionItemNested)}>Выданные займы (до 1 года)</div>
                        </div>
                      </div>

                      <div className={cn(styles.section, styles.sectionDivider)}>
                        <div className={styles.sectionHeader}>
                          <div className={styles.sectionHeaderWithIcon}>
                            <span>Внеоборотные активы</span>
                            <span className={styles.badgeDark}>И</span>
                          </div>
                        </div>
                        <div className={styles.sectionItems}>
                          <div className={styles.sectionItem}>Основные средства</div>
                          <div className={styles.sectionItem}>Оборудование</div>
                          <div className={styles.sectionItem}>Транспорт</div>
                          <div className={styles.sectionItem}>Другие внеоборотные</div>
                          <div className={cn(styles.sectionItem, styles.sectionItemNested)}>Выданные займы (от 1 года)</div>
                          <div className={cn(styles.sectionItem, styles.sectionItemNested)}>Финансовые вложения</div>
                          <div className={cn(styles.sectionItem, styles.sectionItemNested)}>Нематериальные активы</div>
                        </div>
                      </div>

                      <div className={cn(styles.section, styles.sectionDividerBold)}>
                        <div className={styles.sectionTotal}>ИТОГО АКТИВЫ</div>
                      </div>

                      <div className={cn(styles.section, styles.sectionDivider)}>
                        <div className={styles.sectionHeader}>
                          <span>Краткосрочные обязательства</span>
                          <span className={styles.badge}>0</span>
                        </div>
                        <div className={styles.sectionItems}>
                          <div className={styles.sectionItem}>Кредиторская задолженность</div>
                          <div className={styles.sectionItem}>Другие краткосрочные</div>
                          <div className={cn(styles.sectionItem, styles.sectionItemNested)}>Платежи третьим лицам</div>
                          <div className={cn(styles.sectionItem, styles.sectionItemNested)}>Полученные займы (до 1 года)</div>
                        </div>
                      </div>

                      <div className={cn(styles.section, styles.sectionDivider)}>
                        <div className={styles.sectionHeader}>
                          <div className={styles.sectionHeaderWithIcon}>
                            <span>Долгосрочные обязательства</span>
                            <span className={styles.badgePrimary}>Ф</span>
                          </div>
                        </div>
                        <div className={styles.sectionItems}>
                          <div className={styles.sectionItem}>Кредиты</div>
                          <div className={styles.sectionItem}>Другие долгосрочные</div>
                          <div className={cn(styles.sectionItem, styles.sectionItemNested)}>Полученные займы (от 1 года)</div>
                        </div>
                      </div>

                      <div className={cn(styles.section, styles.sectionDividerBold)}>
                        <div className={styles.sectionTotal}>ИТОГО ОБЯЗАТЕЛЬСТВА</div>
                      </div>

                      <div className={cn(styles.section, styles.sectionDivider)}>
                        <div className={styles.sectionHeader}>
                          <div className={styles.sectionHeaderWithIcon}>
                            <span>Капитал</span>
                            <span className={styles.badgePrimary}>Ф</span>
                          </div>
                        </div>
                        <div className={styles.sectionItems}>
                          <div className={styles.sectionItem}>Вложения учредителей</div>
                          <div className={cn(styles.sectionItem, styles.sectionItemWithBadge)}>
                            <span className={styles.sectionTotalTextGreen}>плюс</span>
                            <span>Нераспределенная прибыль</span>
                          </div>
                        </div>
                      </div>

                      <div className={cn(styles.section, styles.sectionDividerBold)}>
                        <div className={styles.sectionTotal}>ИТОГО КАПИТАЛ</div>
                      </div>

                      <div className={cn(styles.section, styles.sectionDividerExtraBold)}>
                        <div className={styles.sectionTotal}>АКТИВЫ = ОБЯЗАТЕЛЬСТВА + КАПИТАЛ</div>
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
