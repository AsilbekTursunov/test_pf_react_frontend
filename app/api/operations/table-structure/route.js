import { NextResponse } from 'next/server'
import { makeUcodeGetRequest, handleUcodeResponse, getCorsHeaders, createOptionsResponse } from '@/lib/api/ucode/base'
import { apiConfig } from '@/lib/config/api'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const menuId = searchParams.get('menuId')
    const viewId = searchParams.get('viewId')
    const tableSlug = searchParams.get('tableSlug')

    console.log('Operations table structure request:', {
      projectId,
      menuId,
      viewId,
      tableSlug
    })

    const response = await makeUcodeGetRequest({
      menuId: menuId || apiConfig.ucode.operations.menuId,
      viewId: viewId || apiConfig.ucode.operations.viewId,
      tableSlug: tableSlug || apiConfig.ucode.operations.tableSlug,
      projectId: projectId || apiConfig.ucode.projectId,
    })

    const data = await handleUcodeResponse(response, 'Operations table structure')
    return NextResponse.json(data, { 
      status: response.status,
      headers: getCorsHeaders(),
    })
  } catch (error) {
    console.error('Operations table structure API route error:', error)
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
