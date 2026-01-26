import { NextResponse } from 'next/server'
import { apiConfig } from '@/lib/config/api'

/**
 * GET /api/operations/v2-items
 * Get operations list using v2/items/operations endpoint
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
    // Get token from Authorization header (set by axios interceptor)
    const authHeader = request.headers.get('authorization')
    const authToken = authHeader?.replace('Bearer ', '') || apiConfig.ucode.authToken
    const projectId = apiConfig.ucode.projectId
    const environmentId = apiConfig.ucode['environment-id']

    // Build URL with query parameters
    const queryParams = new URLSearchParams()
    queryParams.append('project-id', projectId)
    queryParams.append('environment-id', environmentId)
    
    // Add data parameter as JSON string
    if (Object.keys(dataParams).length > 0) {
      queryParams.append('data', JSON.stringify(dataParams))
    }

    const url = `${baseURL}/v2/items/operations?${queryParams.toString()}`

    console.log('V2 Operations request:', {
      url,
      dataParams
    })

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'environment-id': environmentId,
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('V2 Operations error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      
      return NextResponse.json(
        {
          status: 'ERROR',
          description: `Request failed: ${response.statusText}`,
          data: errorText || 'Failed to fetch operations'
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('V2 Operations error:', error)
    
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Failed to fetch operations',
        data: error.message || 'Internal server error'
      },
      { status: 500 }
    )
  }
}
