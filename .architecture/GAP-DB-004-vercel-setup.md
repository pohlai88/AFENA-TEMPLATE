# GAP-DB-004: Vercel Configuration for Search Outbox + Drain

## Required Environment Variables

Add these in [Vercel Project Settings → Environment Variables](https://vercel.com/jacks-projects-7b3cfe94/afenda/settings/environment-variables):

| Variable | Description | Targets | Type |
|----------|-------------|---------|------|
| `CRON_SECRET` | Auth for internal search endpoints. Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. | Production, Preview, Development | Secret |
| `DATABASE_URL` | App DB — normal app routes (RLS applies). | Production, Preview | Secret |
| `SEARCH_WORKER_DATABASE_URL` | **Worker DB** — drain/bootstrap only. Must use role with **BYPASSRLS** so worker can process all orgs. Set to same pooler URL as `DATABASE_URL` (neondb_owner bypasses RLS). Falls back to `DATABASE_URL` if unset (local dev). | Production, Preview | Secret |

**Rule:** Public app routes = `DATABASE_URL`. Internal search maintenance (drain, bootstrap, lag, health) = `SEARCH_WORKER_DATABASE_URL`.

## Setup Checklist

- [x] `CRON_SECRET` set in Vercel
- [ ] `SEARCH_WORKER_DATABASE_URL` set in Vercel (or same as `DATABASE_URL` if owner bypasses RLS)
- [ ] `NEXT_PUBLIC_APP_URL` = **Production Domain** (e.g. `https://nexuscanon.com`) — only for external schedulers like QStash; poke uses direct call, no URL needed
- [ ] Deploy succeeds (cron runs after deploy)
- [ ] Run migration 0053: `search_backfill_state` table
- [ ] No manual bootstrap needed — drain self-heals with chunked backfill when empty

## Generate CRON_SECRET

```bash
# Unix/macOS
openssl rand -hex 32

# Windows (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and add it as `CRON_SECRET` in Vercel.

## Poke (No URL Needed)

Poke uses **direct function call** (no HTTP). Mutations call `drainSearchOutbox()` via `after()` — same process, no `NEXT_PUBLIC_APP_URL` needed for poke. Set `NEXT_PUBLIC_APP_URL` only if you need an absolute URL (e.g. QStash calling your drain endpoint).

## Cron Job

Configured in `apps/web/vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/internal/search/drain",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

- **Schedule**: Every 5 minutes
- **Path**: `/api/internal/search/drain`
- **Auth**: Vercel automatically sends `Authorization: Bearer <CRON_SECRET>`

## Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/internal/search/drain` | GET, POST | Self-healing chunked backfill + time-budgeted outbox drain |
| `/api/internal/search/bootstrap` | POST | One-time full backfill (idempotent; use for small datasets) |
| `/api/internal/search/lag` | GET | Lag metrics: oldest unprocessed age, pending count, last completed |
| `/api/internal/search/health` | GET | Health: total_documents, org_count, healthy |

All require `Authorization: Bearer <CRON_SECRET>`.

## Bootstrap (after first deploy)

**Option A — Local (ensure DATABASE_URL is set, e.g. in apps/web/.env):**
```bash
pnpm search:bootstrap
```

**Option B — Via API (production):**
```bash
curl -X POST \
  -H "Authorization: Bearer $CRON_SECRET" \
  https://afenda-jacks-projects-7b3cfe94.vercel.app/api/internal/search/bootstrap
```

Replace the URL with your production domain.

**Option C — Drain endpoint (recommended):** The drain runs **chunked backfill** automatically when `search_documents` is empty. Completes over multiple invocations (no timeout). No manual bootstrap needed.

## Vercel Deploy (Monorepo)

| Setting | Value |
|---------|-------|
| **Root Directory** | `apps/web` |
| **Install Command** | `pnpm install --frozen-lockfile` |
| **Build Command** | `pnpm build` |
| **Output** | Next.js default |

If using repo root as Root Directory:
- **Build Command:** `pnpm turbo run build --filter=web` or `pnpm -C apps/web build`
- Ensure `pnpm-lock.yaml` is at the correct root.
