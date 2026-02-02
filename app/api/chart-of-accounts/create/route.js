import { NextResponse } from 'next/server'
import { getCorsHeaders } from '@/lib/api/ucode/base'
import { makeUcodeV2Request } from '@/app/api/utils/ucode-v2'

/**
 * POST /api/chart-of-accounts/create
 * Create a new chart of accounts item using v2/items/chart_of_accounts endpoint
 */
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

    // Validate required fields
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
    
    if (!data.tip || !Array.isArray(data.tip) || data.tip.length === 0) {
      return NextResponse.json(
        {
          status: 'ERROR',
          description: 'tip is required and must be an array',
          data: 'Missing or invalid tip field'
        },
        { status: 400, headers: getCorsHeaders() }
      )
    }

    // Prepare data object with all fields
    const requestData = {
      nazvanie: data.nazvanie.trim(),
      tip: data.tip,
      ...(data.tip_operatsii && Array.isArray(data.tip_operatsii) && data.tip_operatsii.length > 0 && { tip_operatsii: data.tip_operatsii }),
      ...(data.balans !== undefined && data.balans !== null && { balans: data.balans }),
      ...(data.data_sozdaniya_ && { data_sozdaniya_: data.data_sozdaniya_ }),
      ...(data.data_obnovleniya && { data_obnovleniya: data.data_obnovleniya }),
      ...(data.plan_fakt_admins_id && { plan_fakt_admins_id: data.plan_fakt_admins_id }),
      ...(data.komentariy && { komentariy: data.komentariy }),
      ...(data.chart_of_accounts_id_2 && { chart_of_accounts_id_2: data.chart_of_accounts_id_2 }),
      attributes: data.attributes || {}
    }

    return makeUcodeV2Request({
      request,
      endpoint: 'chart_of_accounts',
      method: 'POST',
      data: requestData
    })
  } catch (error) {
    console.error('Create chart of accounts error:', error)
    
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Failed to create chart of accounts item',
        data: error.message || 'Internal server error'
      },
      { status: 500, headers: getCorsHeaders() }
    )
  }
}
