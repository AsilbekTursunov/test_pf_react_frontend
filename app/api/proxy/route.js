import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    
    console.log('Proxy request body:', JSON.stringify(body, null, 2))
    
    const response = await fetch('https://api.admin.u-code.io/v2/invoke_function/udevs-finance-dashboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'API-KEY',
        'x-api-key': 'P-A5kxso62AB3Y4MI1m23BCVAeJ17JktYI',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    
    console.log('Proxy response status:', response.status)
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error.message },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
