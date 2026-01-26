"use client"

import { useState, useMemo } from 'react'
import { cn } from '@/app/lib/utils'
import { GroupedSelect } from '@/components/common/GroupedSelect/GroupedSelect'
import { useCounterparties, useChartOfAccounts, useBankAccounts } from '@/hooks/useDashboard'
import styles from './OperationModal.module.scss'

export function OperationModal({ operation, modalType, isClosing, isOpening, onClose }) {
  // Current active tab
  const [activeTab, setActiveTab] = useState(modalType || 'income')
  
  // Form state
  const [formData, setFormData] = useState({
    paymentDate: operation?.operationDate || '',
    confirmPayment: operation?.paymentConfirmed || false,
    accountAndLegalEntity: operation?.bankAccountId || null,
    amount: operation?.amountRaw ? Math.abs(operation.amountRaw) : '',
    counterparty: operation?.counterpartyId || null,
    chartOfAccount: operation?.chartOfAccountsId || null,
    project: null,
    purchaseDeal: null,
    salesDeal: null,
    purpose: operation?.description || '',
    // For transfer
    fromDate: operation?.operationDate || '',
    fromAccount: operation?.bankAccountId || null,
    fromAmount: operation?.amountRaw ? Math.abs(operation.amountRaw) : '',
    toDate: operation?.operationDate || '',
    toAccount: null,
    toAmount: '0',
    // For accrual
    accrualDate: operation?.accrualDate || '',
    confirmAccrual: false,
    legalEntity: null,
    expenseItem: operation?.chartOfAccountsId || null,
    cashMethod: true,
    creditItem: null,
  })
  // Fetch data from API
  const { data: counterpartiesData, isLoading: loadingCounterparties } = useCounterparties({ limit: 500 })
  const { data: chartOfAccountsData, isLoading: loadingChartOfAccounts } = useChartOfAccounts({ limit: 500 })
  const { data: bankAccountsData, isLoading: loadingBankAccounts } = useBankAccounts({ limit: 500 })

  // Extract and transform data from API responses
  const counterAgents = (counterpartiesData?.data?.data?.response || []).map(item => ({
    guid: item.guid,
    label: item.nazvanie || '',
    group: (Array.isArray(item.gruppa) && item.gruppa.length > 0) ? item.gruppa[0] : 'Без группы'
  }))
  
  // Legal entities removed - using empty array as fallback
  const legalEntities = []
  
  // Transform chart of accounts data
  const chartOfAccounts = useMemo(() => {
    const items = chartOfAccountsData?.data?.data?.response || []
    return items.map(item => ({
      guid: item.guid,
      label: item.nazvanie || '',
      group: (Array.isArray(item.tip) && item.tip.length > 0) ? item.tip[0] : 'Без группы'
    }))
  }, [chartOfAccountsData])

  const bankAccounts = (bankAccountsData?.data?.data?.response || []).map(item => ({
    guid: item.guid,
    label: item.nazvanie || '',
    group: item.legal_entity_id_data?.nazvanie || 'Без группы'
  }))

  if (!operation) return null

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={onClose}
        className={cn(
          styles.overlay,
          isClosing ? styles.closing : styles.opening
        )}
      />

      {/* Modal */}
      <div 
        className={cn(
          styles.modal,
          isOpening ? styles.opening : isClosing ? styles.closing : styles.open
        )}
      >
        <div className={styles.modalContent}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <div className={styles.headerLeft}>
              <h2 className={styles.title}>Редактирование операции</h2>
                <div className={styles.headerDate}>
                  <svg className={styles.headerIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Создана {operation.createdAt || '—'}</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>
            {/* Tabs */}
            {activeTab === 'accrual' ? (
              <div className={styles.tabs}>
                <button 
                  className={cn(
                    styles.tab,
                    styles.tabAccrual,
                    styles.active
                  )}
                >
                  Начисление
                </button>
              </div>
            ) : (
            <div className={styles.tabs}>
                <button 
                  className={cn(
                styles.tab,
                    activeTab === 'income' ? cn(styles.tabIncome, styles.active) : styles.inactive
                  )}
                  onClick={() => setActiveTab('income')}
                >
                Поступление
              </button>
                <button 
                  className={cn(
                styles.tab,
                    activeTab === 'payment' ? cn(styles.tabPayment, styles.active) : styles.inactive
                  )}
                  onClick={() => setActiveTab('payment')}
                >
                Выплата
              </button>
                <button 
                  className={cn(
                styles.tab,
                    activeTab === 'transfer' ? cn(styles.tabTransfer, styles.active) : styles.inactive
                  )}
                  onClick={() => setActiveTab('transfer')}
                >
                Перемещение
              </button>
            </div>
            )}

            </div>

            {/* Form */}
            <div className={styles.body}>
              <div className={styles.form}>
              {/* Поступление */}
              {activeTab === 'income' && (
                <>
              {/* Дата оплаты */}
              <div className={styles.formRow}>
                <label className={styles.label}>Дата оплаты</label>
                <div className={styles.inputGroup}>
                  <input 
                        type="date" 
                        value={formData.paymentDate}
                        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                        className={styles.input}
                      />
                      <button className={styles.calendarButton}>
                        <svg className={styles.calendarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                  </button>
                      <label className={styles.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          className={styles.checkbox}
                          checked={formData.confirmPayment}
                          onChange={(e) => setFormData({ ...formData, confirmPayment: e.target.checked })}
                        />
                        <span>Подтвердить оплату</span>
                      </label>
                </div>
              </div>

              {/* Счет и юрлицо */}
              <div className={styles.formRow}>
                <label className={styles.label}>Счет и юрлицо</label>
                <GroupedSelect
                      data={bankAccounts}
                      value={formData.accountAndLegalEntity}
                      onChange={(value) => setFormData({ ...formData, accountAndLegalEntity: value })}
                  placeholder="Выберите счет..."
                  groupBy={true}
                  labelKey="label"
                  valueKey="guid"
                  groupKey="group"
                      loading={loadingBankAccounts}
                  className="flex-1"
                />
              </div>

              {/* Сумма */}
              <div className={styles.formRow}>
                <label className={styles.label}>Сумма</label>
                <div className={styles.inputGroup}>
                  <input 
                        type="number" 
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0"
                        className={styles.input}
                      />
                      <span className={styles.inputText}>{operation.currency || 'RUB (Российский рубль)'}</span>
                </div>
              </div>

                  {/* Разбить сумму / Добавить начисление */}
              <div className={styles.formRow}>
                <div className={styles.labelSpacer}></div>
                    <div className={styles.buttonGroup}>
                <button className={styles.button}>Разбить сумму</button>
                <button className={styles.button}>Добавить начисление</button>
                    </div>
              </div>

              {/* Контрагент */}
              <div className={styles.formRow}>
                <label className={styles.label}>Контрагент</label>
                <GroupedSelect
                  data={counterAgents}
                      value={formData.counterparty}
                      onChange={(value) => setFormData({ ...formData, counterparty: value })}
                  placeholder="Выберите контрагента..."
                  groupBy={true}
                  labelKey="label"
                  valueKey="guid"
                  groupKey="group"
                      loading={loadingCounterparties}
                  className="flex-1"
                />
              </div>

              {/* Статья */}
              <div className={styles.formRow}>
                <label className={styles.label}>Статья</label>
                    <GroupedSelect
                      data={chartOfAccounts}
                      value={formData.chartOfAccount}
                      onChange={(value) => setFormData({ ...formData, chartOfAccount: value })}
                  placeholder="Выберите статью..."
                      groupBy={true}
                      labelKey="label"
                      valueKey="guid"
                      groupKey="group"
                      loading={loadingChartOfAccounts}
                  className="flex-1"
                />
              </div>

              {/* Проект */}
              <div className={styles.formRow}>
                <label className={styles.label}>Проект</label>
                <GroupedSelect
                      data={[]}
                      value={formData.project}
                      onChange={(value) => setFormData({ ...formData, project: value })}
                      placeholder="Выберите проект..."
                      groupBy={false}
                      labelKey="label"
                      valueKey="guid"
                      className="flex-1"
                    />
                  </div>

                  {/* Сделка продажи */}
                  <div className={styles.formRow}>
                    <label className={cn(styles.label, styles.labelWithIcon)}>
                      Сделка продажи
                      <svg className={styles.labelIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </label>
                    <GroupedSelect
                      data={[]}
                      value={formData.salesDeal}
                      onChange={(value) => setFormData({ ...formData, salesDeal: value })}
                  placeholder="Не выбран"
                  groupBy={false}
                  labelKey="label"
                  valueKey="guid"
                      className="flex-1"
                    />
                  </div>

                  {/* Назначение платежа */}
                  <div className={styles.formRowStart}>
                    <label className={styles.label} style={{ paddingTop: '0.5rem' }}>Назначение платежа</label>
                    <textarea 
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      placeholder="Назначение платежа"
                      rows={3}
                      className={styles.textarea}
                    />
                  </div>
                </>
              )}

              {/* Выплата */}
              {activeTab === 'payment' && (
                <>
                  {/* Дата оплаты */}
                  <div className={styles.formRow}>
                    <label className={styles.label}>Дата оплаты</label>
                    <div className={styles.inputGroup}>
                      <input 
                        type="date" 
                        value={formData.paymentDate}
                        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                        className={styles.input}
                      />
                      <button className={styles.calendarButton}>
                        <svg className={styles.calendarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <label className={styles.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          className={styles.checkbox}
                          checked={formData.confirmPayment}
                          onChange={(e) => setFormData({ ...formData, confirmPayment: e.target.checked })}
                        />
                        <span>Подтвердить оплату</span>
                      </label>
                    </div>
                  </div>

                  {/* Счет и юрлицо */}
                  <div className={styles.formRow}>
                    <label className={styles.label}>Счет и юрлицо</label>
                    <GroupedSelect
                      data={bankAccounts}
                      value={formData.accountAndLegalEntity}
                      onChange={(value) => setFormData({ ...formData, accountAndLegalEntity: value })}
                      placeholder="Выберите счет..."
                      groupBy={true}
                      labelKey="label"
                      valueKey="guid"
                      groupKey="group"
                      loading={loadingBankAccounts}
                      className="flex-1"
                    />
                  </div>

                  {/* Сумма */}
                  <div className={styles.formRow}>
                    <label className={styles.label}>Сумма</label>
                    <div className={styles.inputGroup}>
                      <input 
                        type="number" 
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0"
                        className={styles.input}
                      />
                      <span className={styles.inputText}>{operation.currency || 'RUB (Российский рубль)'}</span>
                    </div>
                  </div>

                  {/* Разбить сумму / Добавить начисление */}
                  <div className={styles.formRow}>
                    <div className={styles.labelSpacer}></div>
                    <div className={styles.buttonGroup}>
                      <button className={styles.button}>Разбить сумму</button>
                      <button className={styles.button}>Добавить начисление</button>
                    </div>
                  </div>

                  {/* Контрагент */}
                  <div className={styles.formRow}>
                    <label className={styles.label}>Контрагент</label>
                    <GroupedSelect
                      data={counterAgents}
                      value={formData.counterparty}
                      onChange={(value) => setFormData({ ...formData, counterparty: value })}
                      placeholder="Выберите контрагента..."
                      groupBy={true}
                      labelKey="label"
                      valueKey="guid"
                      groupKey="group"
                      loading={loadingCounterparties}
                      className="flex-1"
                    />
                  </div>

                  {/* Статья */}
                  <div className={styles.formRow}>
                    <label className={styles.label}>Статья</label>
                    <GroupedSelect
                      data={chartOfAccounts}
                      value={formData.chartOfAccount}
                      onChange={(value) => setFormData({ ...formData, chartOfAccount: value })}
                      placeholder="Выберите статью..."
                      groupBy={true}
                      labelKey="label"
                      valueKey="guid"
                      groupKey="group"
                      loading={loadingChartOfAccounts}
                  className="flex-1"
                />
              </div>

                  {/* Проект */}
                  <div className={styles.formRow}>
                    <label className={styles.label}>Проект</label>
                    <GroupedSelect
                      data={[]}
                      value={formData.project}
                      onChange={(value) => setFormData({ ...formData, project: value })}
                      placeholder="Выберите проект..."
                      groupBy={false}
                      labelKey="label"
                      valueKey="guid"
                  className="flex-1"
                />
              </div>

              {/* Сделка закупки */}
              <div className={styles.formRow}>
                <label className={cn(styles.label, styles.labelWithIcon)}>
                  Сделка закупки
                  <svg className={styles.labelIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </label>
                <GroupedSelect
                  data={[]}
                  value={formData.purchaseDeal}
                  onChange={(value) => setFormData({ ...formData, purchaseDeal: value })}
                  placeholder="Не выбран"
                  groupBy={false}
                  labelKey="label"
                  valueKey="guid"
                  className="flex-1"
                />
              </div>

                  {/* Сделка продажи */}
                  <div className={styles.formRow}>
                    <label className={cn(styles.label, styles.labelWithIcon)}>
                      Сделка продажи
                      <svg className={styles.labelIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </label>
                    <GroupedSelect
                      data={[]}
                      value={formData.salesDeal}
                      onChange={(value) => setFormData({ ...formData, salesDeal: value })}
                      placeholder="Не выбран"
                      groupBy={false}
                      labelKey="label"
                      valueKey="guid"
                      className="flex-1"
                    />
              </div>

              {/* Назначение платежа */}
              <div className={styles.formRowStart}>
                <label className={styles.label} style={{ paddingTop: '0.5rem' }}>Назначение платежа</label>
                <textarea 
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      placeholder="Назначение платежа"
                      rows={3}
                      className={styles.textarea}
                    />
                  </div>
                </>
              )}

              {/* Перемещение */}
              {activeTab === 'transfer' && (
                <>
                  {/* Секция ОТКУДА */}
                  <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                      <div className={styles.sectionLine}></div>
                      <h3 className={styles.sectionTitle}>ОТКУДА</h3>
                      <div className={styles.sectionLine}></div>
                    </div>

                    {/* Дата оплаты */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Дата оплаты</label>
                      <div className={styles.inputGroup}>
                        <input 
                          type="date" 
                          value={formData.fromDate}
                          onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                          className={styles.input}
                        />
                        <button className={styles.calendarButton}>
                          <svg className={styles.calendarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <label className={styles.checkboxLabel}>
                          <input 
                            type="checkbox" 
                            className={styles.checkbox}
                            checked={formData.confirmPayment}
                            onChange={(e) => setFormData({ ...formData, confirmPayment: e.target.checked })}
                          />
                          <span>Подтвердить оплату</span>
                        </label>
                      </div>
                    </div>

                    {/* Счет и юрлицо */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Счет и юрлицо</label>
                      <GroupedSelect
                        data={bankAccounts}
                        value={formData.fromAccount}
                        onChange={(value) => setFormData({ ...formData, fromAccount: value })}
                        placeholder="Выберите счет..."
                        groupBy={true}
                        labelKey="label"
                        valueKey="guid"
                        groupKey="group"
                        loading={loadingBankAccounts}
                        className="flex-1"
                      />
                    </div>

                    {/* Сумма списания */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Сумма списания</label>
                      <div className={styles.inputGroup}>
                        <input 
                          type="number" 
                          value={formData.fromAmount}
                          onChange={(e) => setFormData({ ...formData, fromAmount: e.target.value })}
                          placeholder="0"
                          className={styles.input}
                        />
                        <span className={styles.inputText}>{operation.currency || 'RUB (Российский рубль)'}</span>
                      </div>
                    </div>

                    {/* Привязать к проекту */}
                    <div className={styles.formRow}>
                      <div className={styles.labelSpacer}></div>
                      <button className={styles.button}>Привязать к проекту</button>
                    </div>

                    {/* Проект */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Проект</label>
                      <GroupedSelect
                        data={[]}
                        value={formData.project}
                        onChange={(value) => setFormData({ ...formData, project: value })}
                        placeholder="Выберите проект..."
                        groupBy={false}
                        labelKey="label"
                        valueKey="guid"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Секция КУДА */}
                  <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                      <div className={styles.sectionLine}></div>
                      <h3 className={styles.sectionTitle}>КУДА</h3>
                      <div className={styles.sectionLine}></div>
                    </div>

                    {/* Дата */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Дата</label>
                      <div className={styles.inputGroup}>
                        <input 
                          type="date" 
                          value={formData.toDate}
                          onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                          className={styles.input}
                        />
                        <button className={styles.calendarButton}>
                          <svg className={styles.calendarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Счет и юрлицо */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Счет и юрлицо</label>
                      <GroupedSelect
                        data={bankAccounts}
                        value={formData.toAccount}
                        onChange={(value) => setFormData({ ...formData, toAccount: value })}
                        placeholder="Выберите счет..."
                        groupBy={true}
                        labelKey="label"
                        valueKey="guid"
                        groupKey="group"
                        loading={loadingBankAccounts}
                        className="flex-1"
                      />
                    </div>

                    {/* Сумма зачисления */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Сумма зачисления</label>
                      <input 
                        type="number" 
                        value={formData.toAmount}
                        onChange={(e) => setFormData({ ...formData, toAmount: e.target.value })}
                        placeholder="0"
                        className={styles.input}
                      />
                    </div>

                    {/* Назначение платежа */}
                    <div className={styles.formRowStart}>
                      <label className={styles.label} style={{ paddingTop: '0.5rem' }}>Назначение платежа</label>
                      <textarea 
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        placeholder="Назначение платежа"
                        rows={3}
                        className={styles.textarea}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Начисление */}
              {activeTab === 'accrual' && (
                <>
                  {/* Секция ОТКУДА */}
                  <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                      <div className={styles.sectionLine}></div>
                      <h3 className={styles.sectionTitle}>ОТКУДА</h3>
                      <div className={styles.sectionLine}></div>
                    </div>

                    {/* Дата начисления */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Дата начисления</label>
                      <div className={styles.inputGroup}>
                        <input 
                          type="date" 
                          value={formData.accrualDate}
                          onChange={(e) => setFormData({ ...formData, accrualDate: e.target.value })}
                          className={styles.input}
                        />
                        <button className={styles.calendarButton}>
                          <svg className={styles.calendarIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Подтвердить начисление */}
                    <div className={styles.formRow}>
                      <div className={styles.labelSpacer}></div>
                      <label className={styles.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          className={styles.checkbox}
                          checked={formData.confirmAccrual}
                          onChange={(e) => setFormData({ ...formData, confirmAccrual: e.target.checked })}
                        />
                        <span>Подтвердить начисление</span>
                      </label>
                    </div>

                    {/* Юрлицо */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Юрлицо</label>
                      <GroupedSelect
                        data={legalEntities}
                        value={formData.legalEntity}
                        onChange={(value) => setFormData({ ...formData, legalEntity: value })}
                        placeholder="Выберите юрлицо..."
                        groupBy={true}
                        labelKey="label"
                        valueKey="guid"
                        groupKey="group"
                        loading={false}
                        className="flex-1"
                      />
                    </div>

                    {/* Статья списания */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Статья списания</label>
                      <GroupedSelect
                        data={chartOfAccounts}
                        value={formData.expenseItem}
                        onChange={(value) => setFormData({ ...formData, expenseItem: value })}
                        placeholder="Выберите статью списания..."
                        groupBy={true}
                        labelKey="label"
                        valueKey="guid"
                        groupKey="group"
                        loading={loadingChartOfAccounts}
                        className="flex-1"
                      />
                    </div>

                    {/* Сумма */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Сумма</label>
                      <div className={styles.inputGroup}>
                        <input 
                          type="number" 
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          placeholder="0"
                          className={styles.input}
                        />
                        <span className={styles.inputText}>{operation.currency || 'RUB (Российский рубль)'}</span>
                      </div>
                    </div>

                    {/* Учитывать в ОПиУ кассовым методом */}
                    <div className={styles.formRow}>
                      <div className={styles.labelSpacer}></div>
                      <label className={styles.checkboxLabel}>
                        <input 
                          type="checkbox" 
                          className={styles.checkbox}
                          checked={formData.cashMethod}
                          onChange={(e) => setFormData({ ...formData, cashMethod: e.target.checked })}
                        />
                        <span>Учитывать в ОПиУ кассовым методом</span>
                      </label>
                    </div>
                  </div>

                  {/* Секция КУДА */}
                  <div className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                      <div className={styles.sectionLine}></div>
                      <h3 className={styles.sectionTitle}>КУДА</h3>
                      <div className={styles.sectionLine}></div>
                    </div>

                    {/* Статья зачисления */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Статья зачисления</label>
                      <GroupedSelect
                        data={chartOfAccounts}
                        value={formData.creditItem}
                        onChange={(value) => setFormData({ ...formData, creditItem: value })}
                        placeholder="Выберите статью зачисления..."
                        groupBy={true}
                        labelKey="label"
                        valueKey="guid"
                        groupKey="group"
                        loading={loadingChartOfAccounts}
                        className="flex-1"
                      />
                    </div>

                    {/* Контрагент */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Контрагент</label>
                      <GroupedSelect
                        data={counterAgents}
                        value={formData.counterparty}
                        onChange={(value) => setFormData({ ...formData, counterparty: value })}
                        placeholder="Не выбран"
                        groupBy={true}
                        labelKey="label"
                        valueKey="guid"
                        groupKey="group"
                        loading={loadingCounterparties}
                        className="flex-1"
                      />
                    </div>

                    {/* Проект */}
                    <div className={styles.formRow}>
                      <label className={styles.label}>Проект</label>
                      <GroupedSelect
                        data={[]}
                        value={formData.project}
                        onChange={(value) => setFormData({ ...formData, project: value })}
                        placeholder="Не выбран"
                        groupBy={false}
                        labelKey="label"
                        valueKey="guid"
                        className="flex-1"
                      />
                    </div>

                    {/* Сделка продажи */}
                    <div className={styles.formRow}>
                      <label className={cn(styles.label, styles.labelWithIcon)}>
                        Сделка продажи
                        <svg className={styles.labelIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </label>
                      <GroupedSelect
                        data={[]}
                        value={formData.salesDeal}
                        onChange={(value) => setFormData({ ...formData, salesDeal: value })}
                        placeholder="Не выбран"
                        groupBy={false}
                        labelKey="label"
                        valueKey="guid"
                        className="flex-1"
                      />
                    </div>

                    {/* Назначение */}
                    <div className={styles.formRowStart}>
                      <label className={styles.label} style={{ paddingTop: '0.5rem' }}>Назначение</label>
                      <textarea 
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Назначение платежа"
                  rows={3}
                  className={styles.textarea}
                />
              </div>
                  </div>
                </>
              )}
              </div>
            </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button className={styles.saveButton}>
              Сохранить
            </button>
            <button className={styles.cancelButton} onClick={onClose}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
