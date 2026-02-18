````skill
---
name: neon-postgres
description: Guides and best practices for working with Neon Serverless Postgres. Covers getting started, local development with Neon, choosing a connection method, Neon features, authentication (@neondatabase/auth), PostgREST-style data API (@neondatabase/neon-js), Neon CLI, and Neon's Platform API/SDKs. Use for any Neon-related questions.
---

# Neon Serverless Postgres

Neon is a serverless Postgres platform that separates compute and storage to offer autoscaling, branching, instant restore, and scale-to-zero. It's fully compatible with Postgres and works with any language, framework, or ORM that supports Postgres.

**Official Documentation:** [https://neon.com/docs/introduction](https://neon.com/docs/introduction)

---

## Quick Start

### Connection Pooling (PgBouncer)

**Critical:** Neon uses **PgBouncer in transaction mode** for pooled connections. This enables high concurrency but has important limitations.

```bash
# Pooled connection (recommended for most use cases)
postgresql://[user]:[password]@[endpoint]-pooler.us-east-2.aws.neon.tech/neondb

# Direct connection (use for session-level features)
postgresql://[user]:[password]@[endpoint].us-east-2.aws.neon.tech/neondb
```

**Connection Limits:**
- **Pooled**: 10,000 max concurrent client connections (`max_client_conn`)
- **Direct**: 100 max connections (varies by compute size)
- **Default pool size**: ~90% of Postgres `max_connections` (e.g., 377 for 1 CU with 421 max_connections)

**Transaction mode limitations:**
- ❌ Prepared statements (use protocol-level prepared statements instead)
- ❌ `SET` variables persist across queries
- ❌ Advisory locks
- ❌ `LISTEN`/`NOTIFY`
- ✅ Protocol-level prepared statements (supported)
- ✅ Transactions
- ✅ Most application queries

**When to use direct connections:**
- Session-level features (prepared statements, advisory locks)
- Long-running migrations
- `LISTEN`/`NOTIFY` pub/sub
- Development/debugging

**Source:** [Connection Pooling](https://neon.com/docs/connect/connection-pooling)

### Connection Timeouts

```bash
# Default query wait timeout (before connection from pool)
query_wait_timeout = 120  # seconds

# Idle connection in transaction timeout
idle_in_transaction_session_timeout = 300000  # ms (5 minutes)
```

**Pool configuration is automatic** — no manual pool tuning needed. Neon manages per-user-per-database pools transparently.

---

## Database Access Patterns

### Role-Based Access Control

**Best practice:** Create separate roles for different access levels instead of using the default owner role.

```sql
-- 1. Create roles
CREATE ROLE readonly;
CREATE ROLE readwrite;
CREATE ROLE developer;

-- 2. Grant database-level access
GRANT CONNECT ON DATABASE neondb TO readonly, readwrite, developer;

-- 3. Grant schema-level access
GRANT USAGE ON SCHEMA public TO readonly, readwrite, developer;

-- 4. Grant table-level access

-- Readonly: SELECT only
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO readonly;

-- Readwrite: SELECT, INSERT, UPDATE, DELETE
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO readwrite;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO readwrite;

-- Developer: Full access including DDL
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO developer;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO developer;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON TABLES TO developer;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON SEQUENCES TO developer;

-- 5. Create users and assign roles
CREATE USER api_user WITH PASSWORD 'secure_password';
GRANT readwrite TO api_user;

CREATE USER reporting_user WITH PASSWORD 'secure_password';
GRANT readonly TO reporting_user;
```

**Important:** Always use `ALTER DEFAULT PRIVILEGES` for future objects.

**Source:** [Manage Database Access](https://neon.com/docs/manage/database-access)

### Row-Level Security (RLS)

**Use case:** Multi-tenant applications where each user/org should only access their data.

```sql
-- 1. Enable RLS on table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 2. Create policy for tenant isolation
CREATE POLICY tenant_isolation ON documents
  USING (org_id = current_setting('app.current_org_id')::uuid);

-- 3. Set org_id in application connection
-- With Drizzle/node-postgres:
await db.execute(sql`SET app.current_org_id = ${orgId}`);

-- All subsequent queries automatically filtered by org_id
const docs = await db.select().from(documents); // Only returns current org's docs
```

**Common patterns:**

```sql
-- Owner-only access
CREATE POLICY user_documents ON documents
  FOR ALL
  USING (user_id = current_setting('app.current_user_id')::uuid);

-- Read-all, write-own
CREATE POLICY public_read ON posts
  FOR SELECT
  USING (true);

CREATE POLICY user_write ON posts
  FOR INSERT
  WITH CHECK (author_id = current_setting('app.current_user_id')::uuid);

-- Role-based access
CREATE POLICY admin_access ON sensitive_data
  USING (current_setting('app.user_role') = 'admin');
```

**Security:** **Disable public schema permissions** to prevent unauthorized access:

```sql
-- Revoke default public permissions
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
```

**Source:** [Manage Database Access - RLS Examples](https://neon.com/docs/manage/database-access#row-level-security-rls)

---

## Database Branching

Neon's killer feature: instant database copies for dev/test/preview environments.

### Branching Workflows

```bash
# Create a branch (via Neon CLI)
neonctl branches create --name feature/new-schema --parent main

# Get connection string for branch
neonctl connection-string feature/new-schema

# Test migrations on branch
DATABASE_URL=$(neonctl connection-string feature/new-schema) pnpm db:migrate

# Delete branch when done
neonctl branches delete feature/new-schema
```

**Use cases:**

1. **Dev environments:** Each developer gets their own branch from `main`
2. **Testing migrations:** Branch → apply migration → test → delete or merge
3. **Preview deployments:** Auto-create branch for each PR (Vercel integration)
4. **Time Travel:** Restore to any point in history (up to retention limit)

### Time Travel (Point-in-Time Recovery)

Restore database state to any timestamp within retention window.

```bash
# Create branch from specific timestamp (7 days ago)
neonctl branches create \
  --name recovery-2025-02-10 \
  --parent main \
  --timestamp 2025-02-10T14:30:00Z

# Use this branch to inspect historical data or recover
```

**Retention:** 7 days (Free), 30 days (Pro+)

### Schema Diff

Compare schema changes between branches for troubleshooting.

```bash
# Compare schemas (requires pgAdmin or manual inspection)
# 1. Dump schema from main branch
pg_dump $(neonctl connection-string main) --schema-only -f main-schema.sql

# 2. Dump schema from feature branch
pg_dump $(neonctl connection-string feature/xyz) --schema-only -f feature-schema.sql

# 3. Diff
diff main-schema.sql feature-schema.sql
```

**Common use:** Debug migration discrepancies between environments.

### Automated Branching (CI/CD)

```yaml
# GitHub Actions example: Create Neon branch for PR
name: Preview Deployment
on: pull_request

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Create Neon branch
        id: neon
        env:
          NEON_API_KEY: ${{ secrets.NEON_API_KEY }}
        run: |
          BRANCH_NAME="pr-${{ github.event.pull_request.number }}"
          CONN_STRING=$(neonctl branches create \
            --name "$BRANCH_NAME" \
            --parent main \
            --output json | jq -r '.connection_uri')
          echo "DATABASE_URL=$CONN_STRING" >> $GITHUB_OUTPUT

      - name: Deploy preview
        env:
          DATABASE_URL: ${{ steps.neon.outputs.DATABASE_URL }}
        run: |
          # Run migrations, deploy app with branch URL
          pnpm db:migrate
          vercel deploy --env DATABASE_URL="${DATABASE_URL}"
```

**Source:** [Branching Intro](https://neon.com/docs/guides/branching-intro)

---

## AFENDA-NEXUS Specific Patterns

### Connection String Management

```ts
// packages/database/src/client.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Use pooled connection for most operations
const sql = neon(process.env.DATABASE_URL!);  // Ends with -pooler
export const db = drizzle(sql);

// Use direct connection for migrations/DDL
const directSql = neon(process.env.DIRECT_DATABASE_URL!);
export const dbDirect = drizzle(directSql);
```

**Environment variables:**

```env
# Pooled (app usage)
DATABASE_URL=postgresql://user:pass@endpoint-pooler.aws.neon.tech/db

# Direct (migrations)
DIRECT_DATABASE_URL=postgresql://user:pass@endpoint.aws.neon.tech/db
```

### Multi-Tenant RLS with Drizzle

```ts
// packages/database/src/middleware/org-isolation.ts
import { sql } from 'drizzle-orm';
import { db } from '../client';

export async function withOrgContext<T>(
  orgId: string,
  callback: () => Promise<T>,
): Promise<T> {
  // Set org context for RLS
  await db.execute(sql`SET app.current_org_id = ${orgId}`);

  try {
    return await callback();
  } finally {
    // Clear context (important for connection pooling)
    await db.execute(sql`RESET app.current_org_id`);
  }
}

// Usage in API route
import { withOrgContext } from '@afenda/database/middleware';

export async function GET(req: Request) {
  const orgId = await getOrgFromAuth(req);

  const documents = await withOrgContext(orgId, async () => {
    return await db.select().from(documentsTable);
  });

  return Response.json({ documents });
}
```

### Composite Primary Keys with Neon

```ts
// Composite PK pattern for multi-tenant tables
export const organizationDocuments = pgTable(
  'organization_documents',
  {
    org_id: uuid('org_id').notNull(),
    document_id: uuid('document_id').defaultRandom().notNull(),
    name: text('name').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.org_id, t.document_id] }),
    orgIdx: index('org_id_idx').on(t.org_id),
  }),
);

// Benefits:
// 1. Natural tenant isolation
// 2. Efficient org-level queries with RLS
// 3. No UUID conflicts across orgs
```

---

## Neon Documentation

Always reference the Neon documentation before making Neon-related claims. The documentation is the source of truth for all Neon-related information.

Below you'll find a list of resources organized by area of concern. This is meant to support you find the right documentation pages to fetch and add a bit of additional context.

You can use the `curl` commands to fetch the documentation page as markdown:

**Documentation:**

```bash
# Get list of all Neon docs
curl https://neon.com/llms.txt

# Fetch any doc page as markdown
curl -H "Accept: text/markdown" https://neon.com/docs/<path>
```

Don't guess docs pages. Use the `llms.txt` index to find the relevant URL or follow the links in the resources below.

## Overview of Resources

Reference the appropriate resource file based on the user's needs:

### Core Guides

| Area               | Resource                           | When to Use                                                    |
| ------------------ | ---------------------------------- | -------------------------------------------------------------- |
| What is Neon       | `references/what-is-neon.md`       | Understanding Neon concepts, architecture, core resources      |
| Referencing Docs   | `references/referencing-docs.md`   | Looking up official documentation, verifying information       |
| Features           | `references/features.md`           | Branching, autoscaling, scale-to-zero, instant restore         |
| Getting Started    | `references/getting-started.md`    | Setting up a project, connection strings, dependencies, schema |
| Connection Methods | `references/connection-methods.md` | Choosing drivers based on platform and runtime                 |
| Developer Tools    | `references/devtools.md`           | VSCode extension, MCP server, Neon CLI (`neon init`)           |

### Database Drivers & ORMs

HTTP/WebSocket queries for serverless/edge functions.

| Area              | Resource                        | When to Use                                         |
| ----------------- | ------------------------------- | --------------------------------------------------- |
| Serverless Driver | `references/neon-serverless.md` | `@neondatabase/serverless` - HTTP/WebSocket queries |
| Drizzle ORM       | `references/neon-drizzle.md`    | Drizzle ORM integration with Neon                   |

### Auth & Data API SDKs

Authentication and PostgREST-style data API for Neon.

| Area        | Resource                  | When to Use                                                         |
| ----------- | ------------------------- | ------------------------------------------------------------------- |
| Neon Auth   | `references/neon-auth.md` | `@neondatabase/auth` - Authentication only                          |
| Neon JS SDK | `references/neon-js.md`   | `@neondatabase/neon-js` - Auth + Data API (PostgREST-style queries) |

### Neon Platform API & CLI

Managing Neon resources programmatically via REST API, SDKs, or CLI.

| Area                  | Resource                            | When to Use                                  |
| --------------------- | ----------------------------------- | -------------------------------------------- |
| Platform API Overview | `references/neon-platform-api.md`   | Managing Neon resources via REST API         |
| Neon CLI              | `references/neon-cli.md`            | Terminal workflows, scripts, CI/CD pipelines |
| TypeScript SDK        | `references/neon-typescript-sdk.md` | `@neondatabase/api-client`                   |
| Python SDK            | `references/neon-python-sdk.md`     | `neon-api` package                           |

---

## Official Resources

- [Neon Documentation](https://neon.com/docs/introduction)
- [Connection Pooling Guide](https://neon.com/docs/connect/connection-pooling)
- [Database Access & RLS](https://neon.com/docs/manage/database-access)
- [Branching Guide](https://neon.com/docs/guides/branching-intro)
- [Neon CLI Reference](https://neon.com/docs/reference/cli)
- [Platform API Reference](https://neon.com/docs/reference/api-reference)

---

## Troubleshooting

### "Too many clients" Error

**Cause:** Exceeded connection limit (100 for direct, 10K for pooled)

**Solutions:**

```bash
# 1. Use pooled connection string (ends with -pooler)
DATABASE_URL=postgresql://user:pass@endpoint-pooler.aws.neon.tech/db

# 2. Reduce connection pool size in application
# Drizzle example:
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,  // Reduce from default 20
});

# 3. Enable connection pooling in Neon console
# Settings → Connection pooling → Enable
```

### Prepared Statement Errors with Pooled Connections

**Cause:** PgBouncer transaction mode doesn't support named prepared statements

**Solutions:**

```ts
// ❌ WRONG - Named prepared statements fail
const stmt = await client.prepare('SELECT * FROM users WHERE id = $1');
const result = await stmt.execute([userId]);

// ✅ CORRECT - Use protocol-level prepared statements (automatic)
const result = await client.query('SELECT * FROM users WHERE id = $1', [userId]);

// ✅ OR use direct connection for migrations
const directDb = drizzle(neon(process.env.DIRECT_DATABASE_URL!));
```

### Branch Connection String Not Working

**Cause:** Using main branch connection string instead of branch-specific URL

**Solutions:**

```bash
# Get branch-specific connection string
neonctl connection-string <branch-name>

# Set in environment
DATABASE_URL=$(neonctl connection-string feature/xyz) pnpm dev
```

### RLS Policies Not Applying

**Cause:** Missing `current_setting()` call or wrong role

**Debug:**

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check active policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Test current settings
SHOW app.current_org_id;

-- Check current role
SELECT current_user, session_user;
```

**Fix:** Ensure `SET app.current_org_id = ...` is called before queries.

---

## Migration Checklist

When setting up Neon for a new project:

- [ ] Create project in Neon console or via CLI
- [ ] Get both pooled and direct connection strings
- [ ] Set `DATABASE_URL` (pooled) and `DIRECT_DATABASE_URL` (direct) in .env
- [ ] Configure roles: readonly, readwrite, developer
- [ ] Enable RLS on multi-tenant tables
- [ ] Create RLS policies for tenant isolation
- [ ] Set up branching strategy (main + feature branches)
- [ ] Configure CI/CD for automated branch creation
- [ ] Test connection pooling with concurrent requests
- [ ] Verify migrations work with direct connection
- [ ] Set up monitoring for connection pool usage

````
