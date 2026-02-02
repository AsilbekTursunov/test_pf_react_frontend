import { NextResponse } from 'next/server'
import { makeUcodeViewsRequest, handleUcodeResponse, getCorsHeaders, createOptionsResponse } from '@/lib/api/ucode/base'
import { apiConfig } from '@/lib/config/api'
import { makeUcodeV2Request, parseDataParam } from '@/app/api/utils/ucode-v2'

/**
 * GET /api/counterparties
 * Get counterparties list using v2/items/counterparties endpoint
 */
export async function GET(request) {
  const dataParams = parseDataParam(request)
  return makeUcodeV2Request({
    request,
    endpoint: 'counterparties',
    method: 'GET',
    queryParams: {
      data: JSON.stringify(dataParams)
    }
  })
}

/**
 * POST /api/counterparties
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
          data: 'Missing nazvanie field in data'
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
      ...(data.tip && Array.isArray(data.tip) && data.tip.length > 0 && { tip: data.tip }),
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

/**
 * PUT /api/counterparties
 * Update an existing counterparty using v2/items/counterparties endpoint
 */
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
          description: 'Guid is required for update',
          data: 'Missing guid field in data'
        },
        { status: 400, headers: getCorsHeaders() }
      )
    }

    const requestData = {
      guid: data.guid,
      nazvanie: data.nazvanie.trim(),
      ...(data.polnoe_imya && { polnoe_imya: data.polnoe_imya }),
      ...(data.gruppa && Array.isArray(data.gruppa) && data.gruppa.length > 0 && { gruppa: data.gruppa }),
      ...(data.inn !== undefined && data.inn !== null && { inn: data.inn }),
      ...(data.kpp !== undefined && data.kpp !== null && { kpp: data.kpp }),
      ...(data.nomer_scheta !== undefined && data.nomer_scheta !== null && { nomer_scheta: data.nomer_scheta }),
      ...(data.counterparties_group_id && { counterparties_group_id: data.counterparties_group_id }),
      ...(data.counterparties_group_id_2 && { counterparties_group_id_2: data.counterparties_group_id_2 }),
      ...(data.primenyat_stat_i_po_umolchaniyu !== undefined && { primenyat_stat_i_po_umolchaniyu: data.primenyat_stat_i_po_umolchaniyu }),
      ...(data.chart_of_accounts_id && { chart_of_accounts_id: data.chart_of_accounts_id }),
      ...(data.chart_of_accounts_id_2 && { chart_of_accounts_id_2: data.chart_of_accounts_id_2 }),
      ...(data.tip && Array.isArray(data.tip) && data.tip.length > 0 && { tip: data.tip }),
      ...(data.komentariy && { komentariy: data.komentariy }),
      ...(data.data_sozdaniya && { data_sozdaniya: data.data_sozdaniya }),
      ...(data.data_obnovleniya && { data_obnovleniya: data.data_obnovleniya }),
      attributes: data.attributes || {}
    }

    return makeUcodeV2Request({
      request,
      endpoint: 'counterparties',
      method: 'PUT',
      data: requestData
    })
  } catch (error) {
    console.error('Update counterparty error:', error)
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Failed to update counterparty',
        data: error.message || 'Internal server error'
      },
      { status: 500, headers: getCorsHeaders() }
    )
  }
}

/**
 * DELETE /api/counterparties
 * Delete counterparties items using v2/items/counterparties endpoint
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
      endpoint: 'counterparties',
      method: 'DELETE',
      data: { ids }
    })
  } catch (error) {
    console.error('Delete counterparties error:', error)
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Failed to delete counterparties',
        data: error.message || 'Internal server error'
      },
      { status: 500, headers: getCorsHeaders() }
    )
  }
}

export function OPTIONS() {
  return createOptionsResponse()
}
