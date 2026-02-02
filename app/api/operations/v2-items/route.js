import { getCorsHeaders } from '@/lib/api/ucode/base'
import { makeUcodeV2Request, parseDataParam } from '@/app/api/utils/ucode-v2'

/**
 * GET /api/operations/v2-items
 * Get operations list using v2/items/operations endpoint
 */
export async function GET(request) {
  const dataParams = parseDataParam(request)
  return makeUcodeV2Request({
    request,
    endpoint: 'operations',
    method: 'GET',
    queryParams: {
      data: Object.keys(dataParams).length > 0 ? JSON.stringify(dataParams) : undefined
    }
  })
}
