# Pre-Production Ops Checklist

Manual operational tasks required before production launch.

## Cloudflare R2

- [x] **R2 CORS** — Applied via CLI (`r2-cors.json`)
  - Origins, PUT/GET/HEAD, Content-Type/Content-MD5/x-amz-\*\*

- [ ] **R2 Limits** — Configure in Cloudflare Dashboard
  - Max object size policy
  - Cache-control defaults for public assets

## Secrets

- [ ] **Rotate `NEON_AUTH_COOKIE_SECRET`** — Set in Vercel/hosting env
  - Only live secret; `SESSION_SECRET` and `NEXTAUTH_SECRET` removed (dead, not used by Neon Auth)

## Neon Auth

- [ ] **Auth domain** — Add in Neon Console → Auth → Settings → Domains
  - `www.nexuscanon.com`
  - `nexuscanon.com`

## Neon Database Monitoring

- [ ] **`pg_stat_statements`** — Enable in Neon Console → Settings → Extensions
  - Identifies slow queries in production
  - Review top-10 by `mean_exec_time` weekly
  - Alert on queries exceeding 1s mean execution time
  - PRD reference: advance.db.md §Challenge 5

- [ ] **Connection pool monitoring** — Track via Neon Dashboard
  - Monitor active/idle connection counts
  - Alert if pool utilization exceeds 80%
  - PRD reference: advance.db.md §Challenge 10

- [ ] **Partition readiness** — Monitor table sizes for partition triggers
  - `audit_logs`: partition at >10M rows (by `created_at`, monthly)
  - `journal_lines`: partition at >10M rows (by `posted_at`, monthly)
  - `stock_movements`: partition at >10M rows (by `posted_at`, monthly)
  - `workflow_executions`: partition at >5M rows (by `created_at`, monthly)
  - `custom_field_values`: partition at >20M rows (by `entity_type`, list)
  - Query: `SELECT relname, n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC LIMIT 10;`

## Observability (optional, pre-launch)

- [ ] **Error tracking** — GlitchTip DSN already in `.env` (`SENTRY_DSN`)
  - Verify error capture from server actions in production

- [ ] **Tracing** — Grafana OTEL already in `.env` (`OTEL_EXPORTER_OTLP_ENDPOINT`)
  - Verify spans from mutation pipeline in production
