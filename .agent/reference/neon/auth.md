# Neon Auth
@doc-version: 2026-02-11
@last-updated: 2026-02-11

## What is Neon Auth

Managed authentication built on Better Auth v1.4.6. Auth data lives in the `neon_auth` schema in your Neon database. Branches with your DB.

- **Beta** — check [roadmap](https://neon.com/docs/auth/roadmap)
- **AWS regions only** — no Azure support yet
- **Pricing** — Free: 60K MAU, Launch/Scale: 1M MAU

## Architecture

```
Client (browser)
├── @neondatabase/neon-js        ← auth + Data API client
│   ├── neon.auth.signIn/signUp/signOut
│   └── neon.from('table').select()
│
Server (Next.js)
├── @neondatabase/auth/next/server  ← session management
│   ├── auth.getSession()
│   ├── auth.handler()              ← API route handler
│   └── auth.middleware()           ← proxy validation
│
Database (Neon)
└── neon_auth schema               ← users, sessions, accounts (managed)
```

## File Layout

```
apps/web/
├── src/lib/auth/
│   ├── server.ts          ← createNeonAuth() instance
│   └── client.ts          ← re-exports neon client for auth
├── src/lib/neon.ts        ← createClient<Database>() with auth + data API
├── proxy.ts               ← auth.middleware() + logging
└── app/api/auth/
    └── [...path]/
        └── route.ts       ← auth.handler() catch-all
```

## Server SDK (`@neondatabase/auth/next/server`)

### Setup

```typescript
import { createNeonAuth } from '@neondatabase/auth/next/server';

const cookieConfig = process.env.NODE_ENV === 'production'
  ? { secret: process.env.NEON_AUTH_COOKIE_SECRET!, domain: '.nexuscanon.com' }
  : { secret: process.env.NEON_AUTH_COOKIE_SECRET! };

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: cookieConfig,
});
```

### API Route Handler

```typescript
// app/api/auth/[...path]/route.ts
import { auth } from '@/lib/auth/server';
export const { GET, POST } = auth.handler();
```

### Proxy (Middleware)

```typescript
// proxy.ts
export async function proxy(request: NextRequest) {
  const authResponse = await auth.middleware()(request);
  return authResponse ?? NextResponse.next();
}
```

### Server Methods

```typescript
// In Server Components / API routes
const session = await auth.getSession();

// Admin
await auth.admin.listUsers();
await auth.admin.banUser({ userId });
await auth.admin.setRole({ userId, role });

// Organization
await auth.organization.create({ name, slug });
await auth.organization.inviteMember({ orgId, email, role });

// Auth
await auth.signIn.email({ email, password });
await auth.signUp.email({ email, password, name });
await auth.signOut();
```

## Client SDK (`@neondatabase/neon-js`)

### Setup

```typescript
import { createClient } from '@neondatabase/neon-js';
import type { Database } from '@/types/database';

export const neon = createClient<Database>({
  auth: { url: process.env.NEXT_PUBLIC_NEON_AUTH_URL! },
  dataApi: { url: process.env.NEON_DATA_API_URL! },
});
```

### Client Methods

```typescript
// Auth
await neon.auth.signIn.email({ email, password });
await neon.auth.signUp.email({ email, password, name });
await neon.auth.signIn.social({ provider: 'github' });
await neon.auth.signOut();
await neon.auth.getSession();
await neon.auth.emailOtp.sendVerificationOtp();

// Data API (type-safe, RLS-gated)
const { data } = await neon.from('users').select('id, name, email');
```

## Environment Variables

```
NEON_AUTH_BASE_URL           ← Neon Auth server URL (from Console)
NEON_AUTH_COOKIE_SECRET      ← 32+ chars for HMAC-SHA256 session signing
NEXT_PUBLIC_NEON_AUTH_URL    ← Public auth URL for client SDK
NEON_DATA_API_URL            ← Data API endpoint for client queries
NEON_JWT_SECRET              ← JWT signing secret
JWKS_URL                     ← JSON Web Key Set URL for token verification
```

## OAuth

Configured in Neon Console. Env vars in `.env`:

```
GITHUB_ID / GITHUB_SECRET
GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
```

## Production Domain

Cookie domain set to `.nexuscanon.com` in production (allows subdomain sharing). Dev uses localhost.

## Email

Using Neon's default email provider. No additional configuration needed.
