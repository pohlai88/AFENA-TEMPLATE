# API Architecture

Brief reference for the afenda web API structure.

## Tiers

| Tier | Purpose | Versioned | In OpenAPI |
|------|---------|-----------|------------|
| **Contract** | External HTTP API (SDK, mobile, partners) | Yes (`/api/v1/...`) | Yes |
| **BFF** | UI-coupled endpoints (search, storage, views, custom-fields) | No | No |
| **Admin** | Spec, meta, capabilities, health | No | No |
| **Auth** | Delegated to Neon Auth | No | No |

## Endpoints by Tier

### Tier 1 — Contract (OpenAPI)

- `GET/POST /api/entities/[entityType]` — List, create
- `GET/PATCH/DELETE /api/entities/[entityType]/[id]` — Read, update, soft-delete
- `POST /api/entities/[entityType]/[id]/restore`
- `GET /api/entities/[entityType]/[id]/versions`
- `GET /api/entities/[entityType]/[id]/audit`
- `POST /api/webhooks/[source]` — Inbound webhooks

### Tier 2 — BFF

- `GET /api/search` — Full-text search
- `POST /api/storage/presign` — Presigned upload URLs
- `GET/POST /api/storage/metadata` — File metadata
- `GET /api/views/[entityType]` — Entity view definitions
- `GET /api/custom-fields/[entityType]` — Custom field definitions

### Tier 3 — Admin

- `GET /api/docs` — OpenAPI 3.1 JSON spec
- `GET /api/docs/ui` — Swagger UI
- `GET /api/meta/capabilities`
- `GET/POST /api/meta/capabilities/flags`

### Tier 4 — Auth

- `/api/auth/[...path]` — Delegated to auth provider

## Route Manifest (SSOT)

All routes are declared in `src/lib/api/route-manifest.ts`. Each `app/api/**/route.ts` must:

1. Be listed in the manifest
2. Export `ROUTE_META` matching the manifest entry
3. Use `entity-route-handlers` for domain reads/writes (no direct DB/crud imports)

CI enforces this via `pnpm ci:routes`.

## Path Builders

Use route builders instead of raw path strings:

- **API URLs:** `src/lib/routes/api-v1.ts`, `bff.ts`, `admin.ts` (when added)
- **App navigation:** `src/lib/routes/app-routes.ts`

## OpenAPI

- Spec: `GET /api/docs` (JSON)
- UI: `GET /api/docs/ui`
- Generated from the route manifest only (no filesystem scan)
