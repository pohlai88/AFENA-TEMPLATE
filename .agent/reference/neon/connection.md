# Neon Connection Methods
@doc-version: 2026-02-11
@last-updated: 2026-02-11

## Connection Types

| Type | URL Pattern | Purpose |
|------|-------------|---------|
| **Pooled (PgBouncer)** | `...-pooler.region.aws.neon.tech` | Runtime queries — up to 10K concurrent |
| **Direct TCP** | `...region.aws.neon.tech` (no `-pooler`) | Migrations, DDL, advisory locks |
| **Data API (REST)** | `...apirest.region.aws.neon.tech/.../rest/v1` | Browser/edge queries via HTTP |

## Why Two Database URLs

PgBouncer (pooled) doesn't support:
- DDL operations (`CREATE TABLE`, `ALTER TABLE`)
- Advisory locks
- `CREATE INDEX CONCURRENTLY`
- Prepared statements in transaction mode

Migrations **must** use direct TCP.

## SSL / Security

All connection strings include:
- `sslmode=require` — encrypted in transit
- `channel_binding=require` — extra auth security (on pooled URL)

## Neon Serverless Driver Modes

| Mode | Import | Use Case |
|------|--------|----------|
| **HTTP** | `import { neon } from '@neondatabase/serverless'` | Single queries, serverless functions |
| **WebSocket** | `import { Pool } from '@neondatabase/serverless'` | Transactions, multiple queries in one connection |

Our setup uses **HTTP mode** via `drizzle-orm/neon-http` — stateless, no pool management.

## Environment Variables

```bash
# Runtime (pooled)
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require

# Migrations (direct TCP)
DATABASE_URL_MIGRATIONS=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# Data API
NEON_DATA_API_URL=https://ep-xxx.apirest.region.aws.neon.tech/neondb/rest/v1

# Auth
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.region.aws.neon.tech/neondb/auth
NEXT_PUBLIC_NEON_AUTH_URL=https://ep-xxx.neonauth.region.aws.neon.tech/neondb/auth

# API
NEON_API_KEY=napi_xxx
NEON_PROJECT_ID=dark-band-87285012
```

## Latency Optimization

- Region `aws-ap-southeast-1` matches deployment target
- HTTP driver = no cold-start overhead (no TCP handshake)
- PgBouncer = connection reuse across requests
