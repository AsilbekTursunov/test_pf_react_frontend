import { NextResponse } from 'next/server'
import { makeUcodeViewsRequest, handleUcodeResponse, getCorsHeaders, createOptionsResponse } from '@/lib/api/ucode/base'
import { apiConfig } from '@/lib/config/api'

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Counterparties request body:', JSON.stringify(body, null, 2))

    const { projectId, menuId, viewId, tableSlug, ...bodyData } = body

    const response = await makeUcodeViewsRequest({
      menuId: menuId || apiConfig.ucode.counterparties.menuId,
      viewId: viewId || apiConfig.ucode.counterparties.viewId,
      tableSlug: tableSlug || apiConfig.ucode.counterparties.tableSlug,
      projectId,
      bodyData,
    })

    const data = await handleUcodeResponse(response, 'Counterparties API')
    return NextResponse.json(data, { 
      status: response.status,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error('Counterparties API route error:', error)
    // Handle network errors or API errors
    const statusCode = error.status || 500
    const errorDetails = error.isNetworkError 
      ? error.details 
      : (error.details || error.message || String(error))
    
    return NextResponse.json(
      { 
        error: error.error || 'Failed to fetch data', 
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

export function OPTIONS() {
  return createOptionsResponse()
}
