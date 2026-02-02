// Мок-данные для отчета о движении денежных средств

export const generateMockOperations = () => {
  const operations = []
  const months = [
    { year: 2025, month: 9, label: 'окт \'25' }, // октябрь
    { year: 2025, month: 10, label: 'ноя \'25' }, // ноябрь
    { year: 2025, month: 11, label: 'дек \'25' }, // декабрь
    { year: 2026, month: 0, label: 'янв \'26' }, // январь
    { year: 2026, month: 1, label: 'фев \'26' }, // февраль
  ]

  // Операционный поток - Поступления
  const receipts = [
    { name: 'Продажа товаров', amount: 1500000 },
    { name: 'Оказание услуг', amount: 800000 },
    { name: 'Прочие доходы', amount: 200000 },
  ]

  // Операционный поток - Выплаты
  const payments = [
    { name: 'Зарплата сотрудников', amount: 500000 },
    { name: 'Аренда офиса', amount: 150000 },
    { name: 'Коммунальные услуги', amount: 50000 },
    { name: 'Закупка товаров', amount: 800000 },
    { name: 'Налоги', amount: 300000 },
  ]

  // Инвестиционный поток
  const investments = [
    { name: 'Покупка оборудования', amount: 1200000 },
    { name: 'Продажа старого оборудования', amount: 200000 },
  ]

  // Финансовый поток
  const financial = [
    { name: 'Получение кредита', amount: 2000000 },
    { name: 'Погашение кредита', amount: 500000 },
    { name: 'Проценты по кредиту', amount: 100000 },
  ]

  months.forEach((monthData, monthIndex) => {
    const baseDate = new Date(monthData.year, monthData.month, 15)

    // Поступления
    receipts.forEach((receipt, index) => {
      const variation = (Math.random() - 0.5) * 0.3 // ±15% вариация
      const amount = Math.round(receipt.amount * (1 + variation))
      
      operations.push({
        guid: `receipt-${monthIndex}-${index}`,
        data_operatsii: new Date(baseDate.getTime() + index * 86400000).toISOString(),
        tip: ['Поступление'],
        summa: amount,
        chart_of_accounts_id_data: { nazvanie: receipt.name },
        counterparties_id_data: { nazvanie: `Контрагент ${index + 1}` },
        bank_accounts_id_data: { nazvanie: 'Основной счет' },
        opisanie: `Поступление: ${receipt.name}`,
      })
    })

    // Выплаты
    payments.forEach((payment, index) => {
      const variation = (Math.random() - 0.5) * 0.2 // ±10% вариация
      const amount = Math.round(payment.amount * (1 + variation))
      
      operations.push({
        guid: `payment-${monthIndex}-${index}`,
        data_operatsii: new Date(baseDate.getTime() + (index + 10) * 86400000).toISOString(),
        tip: ['Выплата'],
        summa: amount,
        chart_of_accounts_id_data: { nazvanie: payment.name },
        counterparties_id_data: { nazvanie: `Поставщик ${index + 1}` },
        bank_accounts_id_data: { nazvanie: 'Основной счет' },
        opisanie: `Выплата: ${payment.name}`,
      })
    })

    // Инвестиционные операции (реже)
    if (monthIndex % 2 === 0) {
      investments.forEach((investment, index) => {
        operations.push({
          guid: `investment-${monthIndex}-${index}`,
          data_operatsii: new Date(baseDate.getTime() + (index + 20) * 86400000).toISOString(),
          tip: ['Перемещение'], // Инвестиционный поток
          summa: Math.abs(investment.amount),
          chart_of_accounts_id_data: { nazvanie: investment.name },
          counterparties_id_data: { nazvanie: 'Инвестиционный партнер' },
          bank_accounts_id_data: { nazvanie: 'Инвестиционный счет' },
          opisanie: `Инвестиция: ${investment.name}`,
          isInvestment: true,
          isReceipt: investment.amount > 0
        })
      })
    }

    // Финансовые операции (еще реже)
    if (monthIndex % 3 === 0) {
      financial.forEach((fin, index) => {
        operations.push({
          guid: `financial-${monthIndex}-${index}`,
          data_operatsii: new Date(baseDate.getTime() + (index + 25) * 86400000).toISOString(),
          tip: ['Перемещение'], // Финансовый поток
          summa: Math.abs(fin.amount),
          chart_of_accounts_id_data: { nazvanie: fin.name },
          counterparties_id_data: { nazvanie: 'Банк' },
          bank_accounts_id_data: { nazvanie: 'Кредитный счет' },
          opisanie: `Финансовая операция: ${fin.name}`,
          isFinancial: true,
          isReceipt: fin.amount > 0
        })
      })
    }
  })

  return operations
}
