import { NextResponse } from 'next/server'
import { apiConfig } from '@/lib/config/api'
import { makeUcodeViewsRequest, handleUcodeResponse, getCorsHeaders, createOptionsResponse } from '@/lib/api/ucode/base'
import { makeUcodeV2Request, parseDataParam } from '@/app/api/utils/ucode-v2'

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Chart of accounts request body:', JSON.stringify(body, null, 2))

    const { projectId, menuId, viewId, ...requestBody } = body
    
    // Get default values from config
    const finalMenuId = menuId || apiConfig.ucode.chartOfAccounts.menuId
    const finalViewId = viewId || apiConfig.ucode.chartOfAccounts.viewId
    
    // Prepare additional headers if needed
    const additionalHeaders = {}
    if (requestBody['environment-id']) {
      additionalHeaders['environment-id'] = requestBody['environment-id']
    }
    if (requestBody['resource-id']) {
      additionalHeaders['resource-id'] = requestBody['resource-id']
    }
    
    // Prepare bodyData - convert empty array tip to null
    const bodyData = {
      offset: requestBody.offset,
      order: requestBody.order,
      view_fields: requestBody.view_fields,
      limit: requestBody.limit,
      search: requestBody.search
    }

    // Handle tip parameter - convert empty array to null
    if (requestBody.tip !== undefined) {
      if (Array.isArray(requestBody.tip) && requestBody.tip.length === 0) {
        bodyData.tip = null
      } else {
        bodyData.tip = requestBody.tip
      }
    } else {
      bodyData.tip = null
    }

    // Make request using base utility
    const response = await makeUcodeViewsRequest({
      menuId: finalMenuId,
      viewId: finalViewId,
      tableSlug: 'chart_of_accounts',
      projectId,
      bodyData,
      headers: additionalHeaders
    })

    // Handle response
    const data = await handleUcodeResponse(response, 'Chart of accounts')
    
    return NextResponse.json(data, {
      status: response.status,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error('Chart of accounts error:', error)
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

/**
 * GET /api/chart-of-accounts
 * Get chart of accounts list using v2/items/chart_of_accounts endpoint
 */
export async function GET(request) {
  const dataParams = parseDataParam(request)
  return makeUcodeV2Request({
    request,
    endpoint: 'chart_of_accounts',
    method: 'GET',
    queryParams: {
      data: JSON.stringify(dataParams)
    }
  })
}

/**
 * DELETE /api/chart-of-accounts
 * Delete chart of accounts items using v2/items/chart_of_accounts endpoint
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
        { status: 400, headers: getCorsHeaders() }
      )
    }

    return makeUcodeV2Request({
      request,
      endpoint: 'chart_of_accounts',
      method: 'DELETE',
      data: { ids }
    })
  } catch (error) {
    console.error('Delete chart of accounts error:', error)
    
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Failed to delete chart of accounts items',
        data: error.message || 'Internal server error'
      },
      { status: 500, headers: getCorsHeaders() }
    )
  }
}

export async function OPTIONS() {
  return createOptionsResponse()
}
