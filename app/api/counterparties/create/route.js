import { NextResponse } from 'next/server'
import { getCorsHeaders } from '@/lib/api/ucode/base'
import { makeUcodeV2Request } from '@/app/api/utils/ucode-v2'

/**
 * POST /api/counterparties/create
 * Create a new counterparty using v2/items/counterparties endpoint
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

    // Prepare data object with all fields
    const requestData = {
      nazvanie: data.nazvanie.trim(),
      ...(data.gruppa && Array.isArray(data.gruppa) && data.gruppa.length > 0 && { gruppa: data.gruppa }),
      ...(data.inn !== undefined && data.inn !== null && { inn: data.inn }),
      ...(data.polnoe_imya && { polnoe_imya: data.polnoe_imya }),
      ...(data.kpp !== undefined && data.kpp !== null && { kpp: data.kpp }),
      ...(data.nomer_scheta !== undefined && data.nomer_scheta !== null && { nomer_scheta: data.nomer_scheta }),
      ...(data.primenyat_stat_i_po_umolchaniyu !== undefined && { primenyat_stat_i_po_umolchaniyu: data.primenyat_stat_i_po_umolchaniyu }),
      ...(data.komentariy && { komentariy: data.komentariy }),
      ...(data.data_sozdaniya && { data_sozdaniya: data.data_sozdaniya }),
      ...(data.data_obnovleniya && { data_obnovleniya: data.data_obnovleniya }),
      ...(data.counterparties_group_id && { counterparties_group_id: data.counterparties_group_id }),
      ...(data.chart_of_accounts_id && { chart_of_accounts_id: data.chart_of_accounts_id }),
      ...(data.chart_of_accounts_id_2 && { chart_of_accounts_id_2: data.chart_of_accounts_id_2 }),
      attributes: data.attributes || {}
    }

    return makeUcodeV2Request({
      request,
      endpoint: 'counterparties',
      method: 'POST',
      data: requestData
    })
  } catch (error) {
    console.error('Create counterparty error:', error)
    
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Failed to create counterparty',
        data: error.message || 'Internal server error'
      },
      { status: 500, headers: getCorsHeaders() }
    )
  }
}
