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

    if (!data.nazvanie || !data.nazvanie.trim()) {
      return NextResponse.json(
        {
          status: 'ERROR',
          description: 'nazvanie is required',
          data: 'Missing nazvanie field'
        },
        { status: 400, headers: getCorsHeaders() }
      )
    }

    const requestData = {
      guid: data.guid,
      nazvanie: data.nazvanie.trim(),
      ...(data.polnoe_nazvanie && { polnoe_nazvanie: data.polnoe_nazvanie.trim() }),
      ...(data.inn && { inn: Number(data.inn) }),
      ...(data.kpp && { kpp: Number(data.kpp) }),
      ...(data.komentariy && { komentariy: data.komentariy.trim() }),
      ...(data.data_sozdaniya && { data_sozdaniya: data.data_sozdaniya }),
      attributes: data.attributes || {}
    }

    return makeUcodeV2Request({
      request,
      endpoint: 'legal_entity',
      method: 'PUT',
      data: requestData
    })
  } catch (error) {
    console.error('Update legal entity route error:', error)
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Failed to update legal entity',
        data: error.message || 'Internal server error'
      },
      { status: 500, headers: getCorsHeaders() }
    )
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { headers: getCorsHeaders() })
}
