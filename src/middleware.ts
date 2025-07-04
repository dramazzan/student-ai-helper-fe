import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // Пример: если пользователь идёт в /main, но не авторизован — редирект на /login
  if (request.nextUrl.pathname.startsWith('/main') && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

// Указываем, на какие маршруты применять middleware
export const config = {
  matcher: ['/main/:path*'], // можно добавить и другие: ['/main/:path*', '/dashboard/:path*']
}
