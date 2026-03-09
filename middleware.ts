import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Extremely basic in-memory rate-limiter for POC usage.
// Note: In an edge runtime or serverless environment, this resets often.
// For a Dockerized monolith single-instance, it persists between requests gracefully.
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export function middleware(request: NextRequest) {
  // Simple rate limiting based on IP (using x-forwarded-for or fallback)
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const now = Date.now();

  // Rate Limiting Logic (1000 requests per minute for dev, 100 for prod)
  const windowMs = 60 * 1000;
  const limits = process.env.NODE_ENV === 'development' ? 1000 : 100;
  
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

  // Session Protection (Redirect to root if unauthenticated trying to access protected route)
  if (request.nextUrl.pathname.startsWith('/home')) {
    const session = request.cookies.get('session');
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url));
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
