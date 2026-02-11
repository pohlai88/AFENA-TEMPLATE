# Neon Postgres — Overview
@doc-version: 2026-02-11
@last-updated: 2026-02-11

## What is Neon

Neon is a serverless Postgres platform. It separates compute from storage, supports branching, autoscaling, and provides managed auth + a REST Data API.

## Project Details

| Field | Value |
|-------|-------|
| Project | `nexuscanon-axis` |
| Project ID | `dark-band-87285012` |
| Org ID | `org-fragrant-lake-90358173` |
| Region | `aws-ap-southeast-1` |
| Postgres | v17 |
| Plan | `launch_v3` (up to 1M MAU) |
| Branch | `br-icy-darkness-a1eom4rq` |

## Connection URLs

| Type | Purpose | Env Var |
|------|---------|---------|
| Pooled (PgBouncer) | Runtime queries | `DATABASE_URL` |
| Direct TCP | Migrations, DDL | `DATABASE_URL_MIGRATIONS` |
| Data API (REST) | Client-side queries | `NEON_DATA_API_URL` |

## Key Concepts

- **Branching** — Create isolated DB copies for preview environments. Auth state branches too.
- **Autoscaling** — Compute scales to zero when idle, scales up on demand.
- **Connection Pooling** — PgBouncer endpoint supports up to 10K concurrent connections.
- **Row-Level Security** — Postgres RLS enforced at DB level, required for Data API.

## Neon CLI

Installed globally as `neonctl` v2.20.2. Authenticated as `jackwee@ai-bos.io`.

```bash
neonctl projects list
neonctl branches list
neonctl branches create --name preview-123
neonctl connection-string
neonctl databases list
neonctl roles list
```
