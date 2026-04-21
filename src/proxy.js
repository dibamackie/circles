import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function proxy(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/admin/login' || path === '/admin/register';
  
  if (path.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token && !isPublicPath) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    if (token) {
      // Very basic structural check to redirect logged-in users away from auth pages
      if (isPublicPath) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
