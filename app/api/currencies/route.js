import { NextResponse } from 'next/server'
import { apiConfig } from '@/lib/config/api'

/**
 * GET /api/currencies
 * Get currencies list using v2/items/currenies endpoint
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const dataParam = searchParams.get('data')
    
    // Parse data parameter if provided
    let dataParams = {}
    if (dataParam) {
      try {
        dataParams = JSON.parse(dataParam)
      } catch (e) {
        console.error('Failed to parse data parameter:', e)
      }
    }

    const baseURL = apiConfig.ucode.baseURL
    const authToken = apiConfig.ucode.authToken
    const projectId = apiConfig.ucode.projectId
    const environmentId = apiConfig.ucode['environment-id']

    // Build URL with query parameters
    const queryParams = new URLSearchParams()
    queryParams.append('project-id', projectId)
    queryParams.append('environment-id', environmentId)
    
    // Add data parameter as JSON string
    if (Object.keys(dataParams).length > 0) {
      queryParams.append('data', JSON.stringify(dataParams))
    } else {
      queryParams.append('data', JSON.stringify({ limit: 100, offset: 0 }))
    }

    const url = `${baseURL}/v2/items/currenies?${queryParams.toString()}`

    console.log('Currencies request:', {
      url,
      dataParams
    })

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'API-KEY',
      'X-API-KEY': 'P-7LpJciQKbkwuC2ecwefamfEQhoe5F8Bc',
      'environment-id': environmentId,
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Currencies error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      
      return NextResponse.json(
        {
          status: 'ERROR',
          description: `Request failed: ${response.statusText}`,
          data: errorText || 'Failed to fetch currencies'
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Currencies error:', error)
    
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Failed to fetch currencies',
        data: error.message || 'Internal server error'
      },
      { status: 500 }
    )
  }
}
