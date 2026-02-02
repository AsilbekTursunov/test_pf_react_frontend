import { NextResponse } from 'next/server'
import { apiConfig } from '@/lib/config/api'

/**
 * PUT /api/operations/update
 * Update an existing operation using v2/items/operations endpoint
 */
export async function PUT(request) {
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

    if (!data.guid) {
      return NextResponse.json(
        {
          status: 'ERROR',
          description: 'Guid is required for update',
          data: 'Missing guid field in data'
        },
        { status: 400 }
      )
    }

    const baseURL = apiConfig.ucode.baseURL
    const projectId = apiConfig.ucode.projectId
    const environmentId = apiConfig.ucode['environment-id']

    // Build URL with query parameters
    const queryParams = new URLSearchParams()
    queryParams.append('project-id', projectId)
    queryParams.append('environment-id', environmentId)

    const url = `${baseURL}/v2/items/operations?${queryParams.toString()}`

    console.log('Update operation request:', {
      url,
      data: JSON.stringify(data, null, 2)
    })

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'API-KEY',
      'environment-id': environmentId,
      'X-API-KEY': 'P-7LpJciQKbkwuC2ecwefamfEQhoe5F8Bc',
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ data }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Update operation error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      
      return NextResponse.json(
        {
          status: 'ERROR',
          description: `Request failed: ${response.statusText}`,
          data: errorText || 'Failed to update operation'
        },
        { status: response.status }
      )
    }

    const responseData = await response.json()

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Update operation error:', error)
    
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Failed to update operation',
        data: error.message || 'Internal server error'
      },
      { status: 500 }
    )
  }
}
