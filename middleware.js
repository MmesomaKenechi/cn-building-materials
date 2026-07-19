import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const token = req.nextauth.token

    if (isAdminRoute && !token && !req.nextUrl.pathname.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    if (req.nextUrl.pathname === '/admin/login' && token) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return true
      }
    }
  }
)

export const config = {
  matcher: ['/admin/:path*']
}
