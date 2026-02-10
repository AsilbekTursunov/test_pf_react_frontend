import axios from 'axios'

/**
 * Получить данные отчета о движении денежных средств
 * @param {Object} params - Параметры запроса
 * @param {string} params.periodStartDate - Дата начала периода (YYYY-MM-DD)
 * @param {string} params.periodEndDate - Дата окончания периода (YYYY-MM-DD)
 * @param {string} params.periodType - Тип периода (monthly, quarterly, yearly)
 * @param {string} params.currencyCode - Код валюты (RUB, USD, EUR)
 * @returns {Promise} Данные отчета
 */
export const getCashFlowReport = async (params) => {
  const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  
  const response = await axios.post('https://api.admin.u-code.io/v2/invoke_function/planfact-plan-fact', {
    data: {
      method: 'cash_flow',
      object_data: {
        periodStartDate: params.periodStartDate || '2025-01-01',
        periodEndDate: params.periodEndDate || '2026-12-31',
        periodType: params.periodType || 'monthly',
        currencyCode: params.currencyCode || 'RUB'
      }
    }
  }, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    }
  })
  
  return response.data
}
