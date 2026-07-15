import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// JWT Base64URL parsing in Edge Runtime
function decodeJwtRole(token: string): string | null {
  try {
    const payloadBase64Url = token.split('.')[1];
    if (!payloadBase64Url) return null;
    
    // JWT Normalization: Base64URL to Base64
    let base64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Pad with = to make length a multiple of 4
    const pad = base64.length % 4;
    if (pad) {
      if (pad === 1) return null; // Invalid base64
      base64 += new Array(5 - pad).join('=');
    }
    
    const payloadString = atob(base64);
    const payload = JSON.parse(payloadString);
    
    // In .NET, Role claim might be represented with the full schema URL or just 'role'
    const role = payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return role || null;
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Apply strict tenant separation only for dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const tokenCookie = request.cookies.get('sa_auth_v2');
    console.log('[Middleware] tokenCookie:', tokenCookie);
    
    if (!tokenCookie || !tokenCookie.value) {
      console.log('[Middleware] Redirecting to /login because token is missing');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const role = decodeJwtRole(tokenCookie.value);
    console.log('[Middleware] decoded role:', role);
    
    if (!role) {
      // Invalid token format
      console.log('[Middleware] Redirecting to /login because role is invalid');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Strict Tenant Isolation
    const isPharmacyRoute = pathname.startsWith('/dashboard/pharmacy');
    const isPharmacistRoute = pathname.startsWith('/dashboard/pharmacist');
    
    if (role === 'admin') {
      // Admins have access to /dashboard but typically no pharmacy/pharmacist routes
      // If they try to access pharmacy routes, redirect to root admin
      if (isPharmacyRoute || isPharmacistRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return NextResponse.next();
    }

    if (role === 'Pharmacy') {
      if (!isPharmacyRoute) {
        return NextResponse.redirect(new URL('/dashboard/pharmacy', request.url));
      }
      return NextResponse.next();
    }

    if (role === 'Pharmacist') {
      if (!isPharmacistRoute) {
        return NextResponse.redirect(new URL('/dashboard/pharmacist', request.url));
      }
      return NextResponse.next();
    }

    // Unknown role
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

