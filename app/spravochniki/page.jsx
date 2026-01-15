"use client"

import Link from 'next/link'

export default function SpravochnikiPage() {
  const sections = [
    { 
      title: 'Контрагенты', 
      href: '/spravochniki/kontragenty',
      description: 'Управление покупателями, поставщиками и сотрудниками',
      icon: '👥'
    },
    { 
      title: 'Учетные статьи', 
      href: '/spravochniki/transaction-categories',
      description: 'Категории доходов, расходов, активов и обязательств',
      icon: '📊'
    },
    { 
      title: 'Мои счета', 
      href: '/spravochniki/accounts',
      description: 'Наличные и безналичные счета',
      icon: '💳'
    },
    { 
      title: 'Мои юрлица', 
      href: '/spravochniki/legal-entities',
      description: 'Юридические лица и ИП',
      icon: '🏢'
    },
    { 
      title: 'Товары', 
      href: '/spravochniki/products',
      description: 'Каталог товаров и материалов',
      icon: '📦'
    },
    { 
      title: 'Услуги', 
      href: '/spravochniki/products/services',
      description: 'Каталог услуг',
      icon: '🛠️'
    }
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <h1 className="text-[20px] font-semibold text-slate-900">Справочники</h1>
          <p className="text-[14px] text-slate-600 mt-1">Управление основными данными системы</p>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:border-[#17a2b8] hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3">{section.icon}</div>
                <h2 className="text-[16px] font-semibold text-slate-900 mb-2 group-hover:text-[#17a2b8] transition-colors">
                  {section.title}
                </h2>
                <p className="text-[13px] text-slate-600">
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
