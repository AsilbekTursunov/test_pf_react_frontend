import { getCorsHeaders } from '@/lib/api/ucode/base'
import { makeUcodeV2Request, parseDataParam } from '@/app/api/utils/ucode-v2'

export async function GET(request) {
  const dataParams = parseDataParam(request)
  return makeUcodeV2Request({
    request,
    endpoint: 'accounts_group',
    method: 'GET',
    queryParams: {
      data: JSON.stringify(dataParams)
    }
  })
}

export function OPTIONS() {
  return NextResponse.json({}, { headers: getCorsHeaders() })
}
