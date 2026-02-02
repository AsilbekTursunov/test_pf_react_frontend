import { NextResponse } from 'next/server'
import { apiConfig } from '@/lib/config/api'

/**
 * POST /api/operations/create
 * Create a new operation using v2/items/operations endpoint
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { data } = body

    if (!data) {
      return NextResponse.json(
        {
          status: 'ERROR',
          description: 'Data is required',
          data: 'Missing data field in request body'
        },
        { status: 400 }
      )
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

    const url = `${baseURL}/v2/items/operations?${queryParams.toString()}`

    console.log('Create operation request:', {
      url,
      data: JSON.stringify(data, null, 2)
    })
    
    // Validate required fields
    if (!data.tip || !Array.isArray(data.tip) || data.tip.length === 0) {
      return NextResponse.json(
        {
          status: 'ERROR',
          description: 'Tip is required and must be an array',
          data: 'Missing or invalid tip field'
        },
        { status: 400 }
      )
    }
    
    if (!data.data_operatsii) {
      return NextResponse.json(
        {
          status: 'ERROR',
          description: 'data_operatsii is required',
          data: 'Missing data_operatsii field'
        },
        { status: 400 }
      )
    }

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'API-KEY',
      'environment-id': environmentId,
      'X-API-KEY': 'P-7LpJciQKbkwuC2ecwefamfEQhoe5F8Bc',
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Create operation error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      
      return NextResponse.json(
        {
          status: 'ERROR',
          description: `Request failed: ${response.statusText}`,
          data: errorText || 'Failed to create operation'
        },
        { status: response.status }
      )
    }

    const responseData = await response.json()

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Create operation error:', error)
    
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Failed to create operation',
        data: error.message || 'Internal server error'
      },
      { status: 500 }
    )
  }
}
