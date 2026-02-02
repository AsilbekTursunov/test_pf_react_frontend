"use client"

import Link from 'next/link'
import styles from './directories.module.scss'

export default function SpravochnikiPage() {
  const sections = [
    { 
      title: 'Контрагенты', 
      href: '/pages/directories/counterparties',
      description: 'Управление покупателями, поставщиками и сотрудниками',
      icon: '👥'
    },
    { 
      title: 'Учетные статьи', 
      href: '/pages/directories/transaction-categories',
      description: 'Категории доходов, расходов, активов и обязательств',
      icon: '📊'
    },
    { 
      title: 'Мои счета', 
      href: '/pages/directories/accounts',
      description: 'Наличные и безналичные счета',
      icon: '💳'
    },
    { 
      title: 'Мои юрлица', 
      href: '/pages/directories/legal-entities',
      description: 'Юридические лица и ИП',
      icon: '🏢'
    }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Справочники</h1>
          <p className={styles.subtitle}>Управление основными данными системы</p>
        </div>

        <div className={styles.contentArea}>
          <div className={styles.grid}>
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className={styles.card}
              >
                <div className={styles.cardIcon}>{section.icon}</div>
                <h2 className={styles.cardTitle}>
                  {section.title}
                </h2>
                <p className={styles.cardDescription}>
                  {section.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
