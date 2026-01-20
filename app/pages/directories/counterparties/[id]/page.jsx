"use client"

import { useState } from 'react'
import Link from 'next/link'
import { OperationsTable } from '@/components/operations/OperationsTable'
import { cn } from '@/app/lib/utils'
import styles from './counterparty-detail.module.scss'

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
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Breadcrumbs */}
        <div className={styles.breadcrumbs}>
          <div className={styles.breadcrumbsContent}>
            <Link href="/pages/directories/counterparties" className={styles.breadcrumbLink}>
              Список контрагентов
            </Link>
            <span className={styles.breadcrumbSeparator}>›</span>
            <span className={styles.breadcrumbCurrent}>Контрагент</span>
          </div>
        </div>

        {/* Header with kontragent info */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>{kontragent.name}</h1>
            <div className={styles.dateInfo}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span className={styles.dateText}>31.12.21 – 20.03.26</span>
            </div>
            <select
              value={accountingMethod}
              onChange={(e) => setAccountingMethod(e.target.value)}
              className={styles.methodSelect}
            >
              <option value="cash">Учет по денежному потоку</option>
              <option value="accrual">Учет по начислению</option>
            </select>
          </div>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            {/* Left Card - Financial Stats */}
            <div className={styles.financialCard}>
              <div className={styles.financialCardContent}>
                <div className={styles.financialItem}>
                  <div className={styles.financialItemHeader}>
                    <div className={cn(styles.financialItemDot)} style={{ backgroundColor: '#5dade2' }}></div>
                    <span className={styles.financialItemLabel}>Поступления</span>
                  </div>
                  <div className={styles.financialItemValue}>+5 000 000 <span className={styles.financialItemCurrency}>₽</span></div>
                </div>
                
                <div className={styles.financialItem}>
                  <div className={styles.financialItemHeader}>
                    <div className={cn(styles.financialItemDot)} style={{ backgroundColor: '#f39c6b' }}></div>
                    <span className={styles.financialItemLabel}>Выплаты</span>
                  </div>
                  <div className={styles.financialItemValue}>-1 210 000 <span className={styles.financialItemCurrency}>₽</span></div>
                </div>
                
                <div className={styles.financialItem}>
                  <div className={styles.financialItemHeader}>
                    <div className={cn(styles.financialItemDot)} style={{ backgroundColor: '#52c41a' }}></div>
                    <span className={styles.financialItemLabel}>Разница</span>
                  </div>
                  <div className={styles.financialItemValue}>+3 790 000 <span className={styles.financialItemCurrency}>₽</span></div>
                </div>
              </div>
            </div>

            {/* Middle Column - Debit and Credit stacked */}
            <div className={styles.debitCreditColumn}>
              {/* Debit Card */}
              <div className={styles.debitCreditCard}>
                <div className={styles.debitCreditTitle}>Дебиторка</div>
                <div className={styles.debitCreditValue}>Нет задолженности</div>
              </div>

              {/* Credit Card */}
              <div className={styles.debitCreditCard}>
                <div className={styles.debitCreditTitle}>Кредиторка</div>
                <div className={styles.debitCreditValue}>Нет задолженности</div>
              </div>
            </div>

            {/* Right Card - Additional Info (takes remaining space) */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardTop}>
                <div className={styles.infoCardText}>Полное название не указано</div>
                <div className={cn(styles.infoCardText, styles.infoCardTextRight)}>Тип: смешанный</div>
              </div>
              <div className={cn(styles.infoCardText, styles.infoCardTextCenter)}>Реквизиты контрагента отсутствуют</div>
            </div>
          </div>
        </div>

        {/* Operations Section */}
        <div className={styles.operationsSection}>
          <div className={styles.operationsContent}>
            <div className={styles.operationsHeader}>
              <h2 className={styles.operationsTitle}>Операции по контрагенту</h2>
              <button className={styles.filtersButton}>
                Фильтры
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Filters Row */}
            <div className={styles.filtersRow}>
              <select className={styles.filterSelect}>
                <option>Юрлица и счета</option>
              </select>
              <select className={styles.filterSelect}>
                <option>Статьи учета</option>
              </select>
              <select className={styles.filterSelect}>
                <option>Проекты</option>
              </select>
              <select className={styles.filterSelect}>
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
        <div className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerStats}>
              <span className={styles.footerText}>
                <span className={styles.footerTextBold}>{operations.length}</span> операций
              </span>
              <span className={styles.footerText}>
                1 поступление: <span className={styles.footerTextBold}>5 000 000 ₽</span>
              </span>
              <span className={styles.footerText}>
                19 выплат: <span className={styles.footerTextBold}>1 510 000 ₽</span>
              </span>
              <span className={styles.footerText}>
                Итого: <span className={styles.footerTextGreen}>+3 490 000 ₽</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
