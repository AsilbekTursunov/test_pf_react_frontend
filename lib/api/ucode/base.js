import { NextResponse } from 'next/server'
import { apiConfig } from '../../config/api'

/**
 * Base U-code API client
 * Handles common request logic for u-code views endpoints
 */

/**
 * Make a request to u-code views API
 * @param {Object} params - Request parameters
 * @param {string} params.menuId - Menu ID
 * @param {string} params.viewId - View ID
 * @param {string} params.tableSlug - Table slug (e.g., 'chart_of_accounts', 'bank_accounts')
 * @param {string} params.projectId - Project ID (optional, uses default from config)
 * @param {Object} params.bodyData - Data to send in request body
 * @param {Object} params.headers - Additional headers (optional)
 * @returns {Promise<Response>} Fetch response
 */
export async function makeUcodeViewsRequest({
  menuId,
  viewId,
  tableSlug,
  projectId,
  bodyData = {},
  headers: additionalHeaders = {}
}) {
  const baseURL = apiConfig.ucode.baseURL
  // Try to get token from localStorage first, fallback to config
  const authToken = typeof window !== 'undefined' 
    ? (localStorage.getItem('authToken') || apiConfig.ucode.authToken)
    : apiConfig.ucode.authToken
  const finalProjectId = projectId || apiConfig.ucode.projectId

  // Build URL
  const url = `${baseURL}/v3/menus/${menuId}/views/${viewId}/tables/${tableSlug}/items/list?project-id=${finalProjectId}`

  // Prepare base headers
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    'Authorization': `Bearer ${authToken}`,
    'origin': 'https://app.u-code.io',
    'referer': 'https://app.u-code.io/',
    ...additionalHeaders
  }

  // Prepare body - matching u-code API structure
  const requestBody = {
    data: {
      row_view_id: viewId,
      offset: bodyData.offset || 0,
      order: bodyData.order || {},
      view_fields: bodyData.view_fields || [],
      limit: bodyData.limit || 20,
      search: bodyData.search || '',
      ...(bodyData.tip && { tip: bodyData.tip }),
      ...bodyData.extraFields // Allow additional fields
    }
  }

  console.log('U-code API request:', {
    url,
    headers: { ...headers, Authorization: 'Bearer ***' },
    body: requestBody
  })

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    })

    return response
  } catch (networkError) {
    console.error('U-code API network error:', networkError)
    // Re-throw as a structured error that will be caught by API route
    throw {
      status: 500,
      statusText: 'Network Error',
      details: {
        status: 'ERROR',
        description: 'Network error occurred',
        data: networkError.message || 'Failed to connect to server'
      },
      url,
      isNetworkError: true
    }
  }
}

/**
 * Handle u-code API response
 * @param {Response} response - Fetch response
 * @param {string} endpointName - Name of endpoint for logging
 * @returns {Promise<Object>} Parsed response data
 */
export async function handleUcodeResponse(response, endpointName = 'U-code API') {
  // Check if response is ok
  if (!response.ok) {
    let errorText = ''
    try {
      errorText = await response.text()
    } catch (e) {
      errorText = `Failed to read error response: ${e.message}`
    }

    console.error(`${endpointName} error response:`, {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      headers: Object.fromEntries(response.headers.entries())
    })

    // Try to parse error as JSON
    let errorDetails = errorText || 'Empty response body'
    try {
      if (errorText) {
        const errorJson = JSON.parse(errorText)
        errorDetails = errorJson
      }
    } catch (e) {
      errorDetails = errorText || `Failed to parse error: ${e.message}`
    }

    throw {
      status: response.status,
      statusText: response.statusText,
      details: errorDetails,
      url: response.url
    }
  }

  // Parse JSON response
  const responseText = await response.text()
  let data
  try {
    data = responseText ? JSON.parse(responseText) : {}
  } catch (parseError) {
    console.error(`Failed to parse ${endpointName} JSON response:`, parseError)
    console.error('Response text:', responseText)
    throw {
      status: 500,
      details: responseText,
      parseError: parseError.message
    }
  }

  console.log(`${endpointName} response status:`, response.status)
  return data
}

/**
 * Get CORS headers for responses
 */
export function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

/**
 * Create OPTIONS handler response
 * @returns {NextResponse} OPTIONS response
 */
export function createOptionsResponse() {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(),
  })
}

/**
 * Make a POST request to u-code API for table structure
 * @param {Object} params - Request parameters
 * @param {string} params.menuId - Menu ID
 * @param {string} params.viewId - View ID
 * @param {string} params.tableSlug - Table slug
 * @param {string} params.projectId - Project ID (optional, uses default from config)
 * @param {Object} params.headers - Additional headers (optional)
 * @returns {Promise<Response>} Fetch response
 */
export async function makeUcodeGetRequest({
  menuId,
  viewId,
  tableSlug,
  projectId,
  headers: additionalHeaders = {}
}) {
  const baseURL = apiConfig.ucode.baseURL
  // Try to get token from localStorage first, fallback to config
  const authToken = typeof window !== 'undefined' 
    ? (localStorage.getItem('authToken') || apiConfig.ucode.authToken)
    : apiConfig.ucode.authToken
  const finalProjectId = projectId || apiConfig.ucode.projectId

  // Build URL - POST to items/list endpoint for table structure
  const url = `${baseURL}/v3/menus/${menuId}/views/${viewId}/tables/${tableSlug}/items/list?project-id=${finalProjectId}`

  // Prepare base headers
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    'Authorization': `Bearer ${authToken}`,
    'origin': 'https://app.u-code.io',
    'referer': 'https://app.u-code.io/',
    ...additionalHeaders
  }

  // Prepare body with empty data object
  const requestBody = {
    data: {}
  }

  console.log('U-code POST API request (table structure):', {
    url,
    headers: { ...headers, Authorization: 'Bearer ***' },
    body: requestBody
  })

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    })

    return response
  } catch (networkError) {
    console.error('U-code POST API network error (table structure):', networkError)
    // Re-throw as a structured error that will be caught by API route
    throw {
      status: 500,
      statusText: 'Network Error',
      details: {
        status: 'ERROR',
        description: 'Network error occurred',
        data: networkError.message || 'Failed to connect to server'
      },
      url,
      isNetworkError: true
    }
  }
}
