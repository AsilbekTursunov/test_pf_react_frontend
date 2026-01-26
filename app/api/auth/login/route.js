import { NextResponse } from 'next/server'
import { login } from '@/lib/api/auth'
import { apiConfig } from '@/lib/config/api'

/**
 * POST /api/auth/login
 * Handle login request
 */
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Accept either full object with login_strategy and data, or just username/password
    let username, password, clientTypeId, roleId
    
    if (body.login_strategy && body.data) {
      // Full object format
      username = body.data.username
      password = body.data.password
      clientTypeId = body.data.client_type_id
      roleId = body.data.role_id
    } else {
      // Legacy format (just username and password)
      username = body.username
      password = body.password
      clientTypeId = body.clientTypeId
      roleId = body.roleId
    }

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        {
          status: 'ERROR',
          description: 'Missing required fields',
          data: 'Необходимо указать логин и пароль'
        },
        { status: 400 }
      )
    }

    // Get default values from config if not provided
    const finalClientTypeId = clientTypeId || apiConfig.ucode.clientTypeId
    const finalRoleId = roleId || apiConfig.ucode.roleId

    console.log('API route - Login request:', {
      username,
      password: '***',
      clientTypeId: finalClientTypeId,
      roleId: finalRoleId,
      hasClientTypeId: !!finalClientTypeId,
      hasRoleId: !!finalRoleId,
      configClientTypeId: apiConfig.ucode.clientTypeId,
      configRoleId: apiConfig.ucode.roleId
    })

    // Call login function - client_type_id and role_id are passed in data, use config defaults if not provided
    const result = await login({
      username,
      password,
      clientTypeId: finalClientTypeId,
      roleId: finalRoleId
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    
    // Return error response
    return NextResponse.json(
      {
        status: 'ERROR',
        description: error.message || 'Login failed',
        data: error.message || 'Ошибка при входе'
      },
      { status: 401 }
    )
  }
}
