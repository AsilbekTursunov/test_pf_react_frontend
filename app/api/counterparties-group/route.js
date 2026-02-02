import { getCorsHeaders } from '@/lib/api/ucode/base'
import { makeUcodeV2Request, parseDataParam } from '@/app/api/utils/ucode-v2'

export async function GET(request) {
  const dataParams = parseDataParam(request)
  return makeUcodeV2Request({
    request,
    endpoint: 'counterparties_group',
    method: 'GET',
    queryParams: {
      data: JSON.stringify(dataParams)
    }
  })
}

export async function DELETE(request) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          status: 'ERROR',
          description: 'ids is required',
          data: 'Missing ids array in request body'
        },
        { status: 400, headers: getCorsHeaders() }
      )
    }

    return makeUcodeV2Request({
      request,
      endpoint: 'counterparties_group',
      method: 'DELETE',
      data: { ids }
    })
  } catch (error) {
    console.error('Delete counterparties groups route error:', error)
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Failed to delete counterparties groups',
        data: error.message || 'Internal server error'
      },
      { status: 500, headers: getCorsHeaders() }
    )
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, environment-id',
    }
  })
}
