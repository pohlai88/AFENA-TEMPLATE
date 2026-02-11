import { createLoggingMiddleware } from 'afena-logger';
import { NextRequest, NextResponse } from 'next/server';
import logger from './src/lib/logger';

const loggingMiddleware = createLoggingMiddleware(logger);

export function middleware(request: NextRequest) {
  const context = loggingMiddleware.onRequest(request);
  
  // Add request ID to headers for downstream use
  const response = NextResponse.next({
    headers: {
      ...request.headers,
      'x-request-id': context.requestId,
    },
  });

  // Log the request
  loggingMiddleware.onResponse(
    context,
    request.method,
    request.url,
    response.status,
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
