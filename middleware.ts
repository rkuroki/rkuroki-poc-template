import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Extremely basic in-memory rate-limiter for POC usage.
// Note: In an edge runtime or serverless environment, this resets often.
// For a Dockerized monolith single-instance, it persists between requests gracefully.
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const now = Date.now();

  // Rate Limiting Logic (10 requests per minute per IP)
  const windowMs = 60 * 1000;
  const limits = 10;
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
  } else {
    const data = rateLimitMap.get(ip)!;
    if (now - data.timestamp > windowMs) {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    } else {
      data.count++;
      if (data.count > limits) {
        return new NextResponse('Too Many Requests', { status: 429 });
      }
    }
  }

  // Session Protection (Simple redirect to /login if unauthenticated trying to access protected route)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const session = request.cookies.get('session_id');
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  const res = NextResponse.next();
  // Security Headers
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
