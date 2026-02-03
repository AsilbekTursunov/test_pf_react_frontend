import { NextResponse } from 'next/server'
import { apiConfig } from '@/lib/config/api'
import { getCorsHeaders } from '@/lib/api/ucode/base'

/**
 * Make a request to u-code v2/items API
 * @param {Object} params - Request parameters
 * @param {Request} params.request - Next.js request object
 * @param {string} params.endpoint - API endpoint (e.g., 'legal_entity', 'counterparties')
 * @param {string} params.method - HTTP method ('GET', 'POST', 'PUT', 'DELETE')
 * @param {Object} params.data - Data to send in request body (for POST/PUT)
 * @param {Object} params.queryParams - Query parameters for GET requests
 * @returns {Promise<NextResponse>} Next.js response
 */
export async function makeUcodeV2Request({
  request,
  endpoint,
  method = 'GET',
  data = null,
  queryParams = {}
}) {
  try {
    const baseURL = apiConfig.ucode.baseURL
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization')
    const authToken = authHeader?.replace('Bearer ', '') || apiConfig.ucode.authToken
    const projectId = apiConfig.ucode.projectId
    const environmentId = apiConfig.ucode['environment-id']

    // Build query parameters
    const urlQueryParams = new URLSearchParams()
    urlQueryParams.append('project-id', projectId)
    urlQueryParams.append('environment-id', environmentId)
    
    // Add custom query params
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlQueryParams.append(key, typeof value === 'string' ? value : JSON.stringify(value))
      }
    })
    
    // For GET requests, always add data parameter (empty object if not provided)
    if (method === 'GET' && !urlQueryParams.has('data')) {
      urlQueryParams.append('data', JSON.stringify({}))
    }

    const url = `${baseURL}/v2/items/${endpoint}?${urlQueryParams.toString()}`

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'environment-id': environmentId,
    }

    // Prepare request options
    const requestOptions = {
      method,
      headers,
    }

    // Add body for POST/PUT requests
    if ((method === 'POST' || method === 'PUT') && data) {
      requestOptions.body = JSON.stringify({ data })
    }

    // Add body for DELETE requests
    if (method === 'DELETE' && data) {
      requestOptions.body = JSON.stringify(data)
    }

    console.log(`U-code v2 API ${method} request:`, {
      url,
      endpoint,
      method,
      hasData: !!data
    })

    const response = await fetch(url, requestOptions)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`U-code v2 API ${method} error:`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      return NextResponse.json(
        {
          status: 'ERROR',
          description: `Request failed: ${response.statusText}`,
          data: errorText || `Failed to ${method.toLowerCase()} ${endpoint}`
        },
        { status: response.status, headers: getCorsHeaders() }
      )
    }

    // Check if response has content
    const contentType = response.headers.get('content-type')
    const hasContent = response.headers.get('content-length') !== '0'
    
    let responseData
    if (contentType?.includes('application/json') && hasContent) {
      const text = await response.text()
      if (text) {
        try {
          responseData = JSON.parse(text)
        } catch (e) {
          console.warn('Failed to parse response as JSON:', text)
          responseData = { status: 'SUCCESS', description: 'Operation completed successfully' }
        }
      } else {
        responseData = { status: 'SUCCESS', description: 'Operation completed successfully' }
      }
    } else {
      // No content or not JSON - treat as success
      responseData = { status: 'SUCCESS', description: 'Operation completed successfully' }
    }

    return NextResponse.json(responseData, { headers: getCorsHeaders() })
  } catch (error) {
    console.error(`U-code v2 API ${method} route error:`, error)
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || `Failed to ${method.toLowerCase()} ${endpoint}`,
        data: error.message || 'Internal server error'
      },
      { status: 500, headers: getCorsHeaders() }
    )
  }
}

/**
 * Parse data parameter from query string
 * @param {Request} request - Next.js request object
 * @returns {Object} Parsed data object
 */
export function parseDataParam(request) {
  const { searchParams } = new URL(request.url)
  const dataParam = searchParams.get('data')
  
  let dataParams = {}
  if (dataParam) {
    try {
      dataParams = JSON.parse(dataParam)
    } catch (e) {
      console.error('Failed to parse data parameter:', e)
    }
  }
  
  return dataParams
}
