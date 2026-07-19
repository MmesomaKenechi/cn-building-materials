import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const token = req.nextauth.token

    // Protect admin routes (except login)
    if (isAdminRoute && !token && !req.nextUrl.pathname.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // Redirect to dashboard if already logged in
    if (req.nextUrl.pathname === '/admin/login' && token) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    // Force admin routes to be dynamic
    if (isAdminRoute) {
      const response = NextResponse.next()
      response.headers.set('x-middleware-cache', 'no-cache')
      return response
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*'],
}
