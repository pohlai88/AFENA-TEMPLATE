import { NextRequest, NextResponse } from 'next/server';

import { createLoggingMiddleware } from 'afenda-logger';

import { auth } from './src/lib/auth/server';
import logger from './src/lib/logger';

const loggingMiddleware = createLoggingMiddleware(logger);

/**
 * Public routes that bypass auth middleware entirely.
 * These routes are accessible without authentication.
 */
const PUBLIC_ROUTES = [
  '/',              // Marketing landing page
  '/auth',          // Auth pages (sign-in, sign-up, forgot-password, etc.)
  '/api/auth',      // Auth API endpoints
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function proxy(request: NextRequest) {
  const context = loggingMiddleware.onRequest(request);

  // Extract org slug from path-based routing: /org/[slug]/...
  const orgSlug = extractOrgSlug(request.nextUrl.pathname);
  if (orgSlug) {
    context.alsContext.org_id = orgSlug;
  }

  // Skip auth middleware for public routes
  // Auth middleware still runs on protected routes to validate sessions & refresh tokens
  const authResponse = isPublicRoute(request.nextUrl.pathname)
    ? null
    : await auth.middleware({ loginUrl: '/auth/sign-in' })(request);

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

/**
 * Extract org slug from path-based routing.
 * Pattern: /org/[slug]/... → returns slug
 * Returns undefined for non-org routes (personal workspace).
 */
function extractOrgSlug(pathname: string): string | undefined {
  const match = pathname.match(/^\/org\/([^/]+)/);
  return match?.[1];
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
