import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Allow login page
  if (pathname === '/login') {
    return NextResponse.next()
  }
  
  // Check authentication for all other pages
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true'
  
  if (!isAuthenticated && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
