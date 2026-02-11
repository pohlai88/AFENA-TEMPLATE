import { NextRequest, NextResponse } from 'next/server';

import { createLoggingMiddleware } from 'afena-logger';

import { auth } from './src/lib/auth/server';
import logger from './src/lib/logger';

const loggingMiddleware = createLoggingMiddleware(logger);

export async function proxy(request: NextRequest) {
  const context = loggingMiddleware.onRequest(request);

  // Run Neon Auth middleware (validates sessions, refreshes tokens)
  const authResponse = await auth.middleware()(request);

  // Use the auth response if it returned one (e.g. redirect), otherwise continue
  const response = authResponse ?? NextResponse.next({
    headers: {
      ...request.headers,
      'x-request-id': context.requestId,
    },
  });

  // Ensure request ID header is present on auth responses too
  response.headers.set('x-request-id', context.requestId);

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
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
