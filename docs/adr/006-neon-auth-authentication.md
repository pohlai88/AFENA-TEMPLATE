# ADR-006: Neon Auth for Authentication

**Status**: Accepted  
**Date**: 2025-11-18  
**Deciders**: Engineering Team  
**Technical Story**: Authentication and authorization implementation

## Context

We needed an authentication solution that:
- Integrates seamlessly with Neon Postgres (our database)
- Supports Row-Level Security (RLS) for multi-tenancy
- Works with serverless/edge deployments
- Provides standard OAuth flows
- Minimizes custom auth code

Traditional auth solutions (Auth0, Clerk, NextAuth) require:
- Separate authentication service/database
- Custom integration with database RLS
- Complex session management
- Additional infrastructure

## Decision

We will use **Neon Auth** (`@neondatabase/auth`) as our primary authentication solution.

### Architecture

```
User Request
     ↓
Next.js Middleware
     ↓
Neon Auth (JWT validation)
     ↓
Database Query (with RLS)
     ↓
Row-Level Security Filters
```

### Key Features

1. **JWT-based Authentication**: Stateless tokens for serverless compatibility
2. **Integrated RLS**: JWTs automatically set `auth.user_id()` for RLS policies
3. **OAuth Providers**: GitHub, Google, etc. via Neon Auth
4. **Cookie Management**: Secure httpOnly cookies managed by `@neondatabase/auth`
5. **Edge Compatible**: Works in Vercel Edge Runtime

## Consequences

### Positive

✅ **Seamless RLS integration**: `auth.user_id()` automatically available in queries  
✅ **Zero session storage**: JWT-based, no session table needed  
✅ **Serverless-friendly**: Stateless, no session database  
✅ **Multi-tenancy ready**: RLS policies enforce tenant isolation  
✅ **Simple setup**: No separate auth service to deploy  
✅ **OAuth built-in**: GitHub, Google, etc. supported out-of-box  

### Negative

⚠️ **Beta software**: Neon Auth is in beta, may have breaking changes  
⚠️ **Vendor lock-in**: Tightly coupled to Neon Postgres  
⚠️ **Limited providers**: Fewer OAuth providers than Auth0/Clerk  
⚠️ **Learning curve**: Different from traditional session-based auth  
⚠️ **Migration complexity**: Moving away from Neon Auth would require rewrite  

### Neutral

ℹ️ **JWT expiration**: Tokens expire, refresh flow needed  
ℹ️ **Client-side auth**: `useAuth()` hook for React components  

## Implementation Details

### Environment Configuration

```bash
# Neon Auth
NEON_AUTH_BASE_URL=https://project.neonauth.region.aws.neon.tech/dbname/auth
NEON_AUTH_COOKIE_SECRET=your-32-character-secret
NEXT_PUBLIC_NEON_AUTH_URL=https://project.neonauth.region.aws.neon.tech/dbname/auth
JWKS_URL=https://project.neonauth.region.aws.neon.tech/dbname/auth/.well-known/jwks.json

# OAuth Providers
GITHUB_ID=your-github-oauth-client-id
GITHUB_SECRET=your-github-oauth-client-secret
```

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row-Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY user_isolation ON users
  FOR ALL
  USING (id = auth.user_id());
```

### Middleware

```typescript
// middleware.ts
import { neonAuthMiddleware } from '@neondatabase/auth';

export const middleware = neonAuthMiddleware({
  publicRoutes: ['/'],
  cookieSecret: process.env.NEON_AUTH_COOKIE_SECRET!,
});
```

### Client Usage

```typescript
// app/dashboard/page.tsx
import { useAuth } from '@neondatabase/auth/react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Database Queries with RLS

```typescript
// Automatically filtered by RLS based on JWT
const userOrders = await db.query.orders.findMany();
// Only returns orders for authenticated user
```

## Row-Level Security Patterns

### User Isolation

```sql
-- Each user sees only their own data
CREATE POLICY user_data ON <table>
  FOR ALL
  USING (user_id = auth.user_id());
```

### Multi-Tenancy

```sql
-- Users see data from their organization
CREATE POLICY org_data ON <table>
  FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM memberships 
      WHERE user_id = auth.user_id()
    )
  );
```

### Admin Access

```sql
-- Admins bypass RLS
ALTER TABLE <table> FORCE ROW LEVEL SECURITY;

CREATE POLICY admin_all_access ON <table>
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.user_id() 
      AND role = 'admin'
    )
  );
```

## Security Considerations

### JWT Validation
- JWTs validated via JWKS endpoint
- Signature verification on every request
- Automatic token refresh before expiration

### Cookie Security
- httpOnly cookies prevent XSS attacks
- SameSite=Lax prevents CSRF
- Secure flag in production (HTTPS only)

### RLS Best Practices
- Always use `FORCE ROW LEVEL SECURITY`
- Test RLS policies in staging
- Use `SET ROLE` for admin queries (bypass RLS)

## Alternatives Considered

### Auth0
- ✅ Mature, battle-tested
- ✅ Many OAuth providers
- ❌ Separate service ($25+/month)
- ❌ Manual RLS integration
- **Rejected**: Too expensive, complex integration

### Clerk
- ✅ Great DX, modern UI
- ✅ Built-in user management
- ❌ Expensive at scale ($25+/month)
- ❌ No built-in RLS support
- **Rejected**: Vendor lock-in, cost

### NextAuth.js
- ✅ Free, open source
- ✅ Many providers
- ❌ Session table required
- ❌ Manual RLS integration
- ❌ Not serverless-optimized
- **Rejected**: Requires session storage, more complex

### Custom JWT Auth
- ✅ Full control
- ❌ Security risk (easy to get wrong)
- ❌ Time-consuming to build
- ❌ Maintenance burden
- **Rejected**: Too risky, reinventing wheel

### Supabase Auth
- ✅ Similar RLS integration
- ✅ Mature
- ❌ Requires Supabase (not just Postgres)
- ❌ Vendor lock-in
- **Rejected**: Didn't want full Supabase stack

## Migration Path

If we need to migrate away from Neon Auth:

1. **Abstract auth layer**: Create `afenda-auth` package wrapping Neon Auth
2. **Standardize API**: Use common interface (e.g., `getUser()`, `requireAuth()`)
3. **Gradual replacement**: Swap implementation without changing API
4. **RLS compatibility**: Ensure new auth sets `auth.user_id()` in database

## References

- [Neon Auth Documentation](https://neon.tech/docs/guides/neon-auth)
- [Row-Level Security Guide](https://neon.tech/docs/guides/row-level-security)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
