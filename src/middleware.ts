import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const cookieStroke = cookies()
  const cookie = cookieStroke.get('user')
  const hasCookie = cookieStroke.has('user')
  if(request.nextUrl.pathname.startsWith('/profile') && Number(cookie?.value) !== 1){
    return NextResponse.redirect(new URL('/', request.url))
  }
  if(request.nextUrl.pathname.startsWith('/login') && hasCookie==true){
    return NextResponse.redirect(new URL('/', request.url))
  }
}