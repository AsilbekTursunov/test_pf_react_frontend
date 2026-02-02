import { NextResponse } from 'next/server'
import { getCorsHeaders } from '@/lib/api/ucode/base'
import { makeUcodeV2Request, parseDataParam } from '@/app/api/utils/ucode-v2'

export async function GET(request) {
  const dataParams = parseDataParam(request)
  return makeUcodeV2Request({
    request,
    endpoint: 'my_accounts',
    method: 'GET',
    queryParams: {
      data: JSON.stringify(dataParams)
    }
  })
}

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
        { status: 400, headers: getCorsHeaders() }
      )
    }

    return makeUcodeV2Request({
      request,
      endpoint: 'my_accounts',
      method: 'POST',
      data
    })
  } catch (error) {
    console.error('My Accounts POST error:', error)
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Failed to create my account',
        data: error.message || 'Internal server error'
      },
      { status: 500, headers: getCorsHeaders() }
    )
  }
}

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
        { status: 400, headers: getCorsHeaders() }
      )
    }

    if (!data.guid) {
      return NextResponse.json(
        {
          status: 'ERROR',
          description: 'GUID is required for update',
          data: 'Missing guid field in data'
        },
        { status: 400, headers: getCorsHeaders() }
      )
    }

    return makeUcodeV2Request({
      request,
      endpoint: 'my_accounts',
      method: 'PUT',
      data
    })
  } catch (error) {
    console.error('My Accounts PUT error:', error)
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Failed to update my account',
        data: error.message || 'Internal server error'
      },
      { status: 500, headers: getCorsHeaders() }
    )
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          status: 'ERROR',
          description: 'IDs array is required',
          data: 'Missing ids array in request body'
        },
        { status: 400, headers: getCorsHeaders() }
      )
    }

    return makeUcodeV2Request({
      request,
      endpoint: 'my_accounts',
      method: 'DELETE',
      data: { ids }
    })
  } catch (error) {
    console.error('My Accounts DELETE error:', error)
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Failed to delete my accounts',
        data: error.message || 'Internal server error'
      },
      { status: 500, headers: getCorsHeaders() }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders()
  })
}
