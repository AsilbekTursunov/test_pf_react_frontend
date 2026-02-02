import { NextResponse } from 'next/server'
import { apiConfig } from '@/lib/config/api'

/**
 * DELETE /api/operations/delete
 * Delete operations using v2/items/operations endpoint
 */
export async function DELETE(request) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          status: 'ERROR',
          description: 'Ids is required and must be a non-empty array',
          data: 'Missing or invalid ids field in request body'
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

    console.log('Delete operations request:', {
      url,
      ids
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
      method: 'DELETE',
      headers,
      body: JSON.stringify({ ids }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Delete operations error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      
      return NextResponse.json(
        {
          status: 'ERROR',
          description: `Request failed: ${response.statusText}`,
          data: errorText || 'Failed to delete operations'
        },
        { status: response.status }
      )
    }

    const responseData = await response.json()

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Delete operations error:', error)
    
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Failed to delete operations',
        data: error.message || 'Internal server error'
      },
      { status: 500 }
    )
  }
}
