import { NextResponse } from 'next/server'
import { getCorsHeaders } from '@/lib/api/ucode/base'
import { makeUcodeV2Request } from '@/app/api/utils/ucode-v2'

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
          description: 'guid is required',
          data: 'Missing guid field in data'
        },
        { status: 400, headers: getCorsHeaders() }
      )
    }

    if (!data.nazvanie_gruppy || !data.nazvanie_gruppy.trim()) {
      return NextResponse.json(
        {
          status: 'ERROR',
          description: 'nazvanie_gruppy is required',
          data: 'Missing nazvanie_gruppy field'
        },
        { status: 400, headers: getCorsHeaders() }
      )
    }

    const requestData = {
      guid: data.guid,
      nazvanie_gruppy: data.nazvanie_gruppy.trim(),
      ...(data.opisanie_gruppy && { opisanie_gruppy: data.opisanie_gruppy }),
      ...(data.data_sozdaniya && { data_sozdaniya: data.data_sozdaniya }),
      ...(data.data_obnovleniya && { data_obnovleniya: data.data_obnovleniya }),
      ...(data.plan_fakt_admins_id && { plan_fakt_admins_id: data.plan_fakt_admins_id }),
      attributes: data.attributes || {}
    }

    return makeUcodeV2Request({
      request,
      endpoint: 'counterparties_group',
      method: 'PUT',
      data: requestData
    })
  } catch (error) {
    console.error('Update counterparties group route error:', error)
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Failed to update counterparties group',
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
