import { NextResponse } from 'next/server'
import { apiConfig } from '@/lib/config/api'
import { makeUcodeViewsRequest, handleUcodeResponse, getCorsHeaders, createOptionsResponse } from '@/lib/api/ucode/base'

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Operations list request body:', JSON.stringify(body, null, 2))

    const { projectId, menuId, viewId, tableSlug, ...requestBody } = body
    
    // Get default values from config
    const finalMenuId = menuId || apiConfig.ucode.operations.menuId
    const finalViewId = viewId || apiConfig.ucode.operations.viewId
    const finalTableSlug = tableSlug || apiConfig.ucode.operations.tableSlug
    
    // Prepare additional headers if needed
    const additionalHeaders = {}
    if (requestBody['environment-id']) {
      additionalHeaders['environment-id'] = requestBody['environment-id']
    }
    if (requestBody['resource-id']) {
      additionalHeaders['resource-id'] = requestBody['resource-id']
    }
    
    // Make request using base utility
    const response = await makeUcodeViewsRequest({
      menuId: finalMenuId,
      viewId: finalViewId,
      tableSlug: finalTableSlug,
      projectId,
      bodyData: {
        offset: requestBody.offset || 0,
        order: requestBody.order || {},
        view_fields: requestBody.view_fields || [],
        limit: requestBody.limit || 20,
        search: requestBody.search || ''
      },
      headers: additionalHeaders
    })

    // Handle response
    const data = await handleUcodeResponse(response, 'Operations list')
    
    return NextResponse.json(data, {
      status: response.status,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error('Operations list error:', error)
    // Handle network errors or API errors
    const statusCode = error.status || 500
    const errorDetails = error.isNetworkError 
      ? error.details 
      : (error.details || error.message || String(error))
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch data', 
        details: errorDetails,
        status: statusCode,
        url: error.url
      },
      { 
        status: statusCode,
        headers: getCorsHeaders()
      }
    )
  }
}

export async function OPTIONS() {
  return createOptionsResponse()
}
