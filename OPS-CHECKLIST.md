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

## Observability (optional, pre-launch)

- [ ] **Error tracking** — GlitchTip DSN already in `.env` (`SENTRY_DSN`)
  - Verify error capture from server actions in production

- [ ] **Tracing** — Grafana OTEL already in `.env` (`OTEL_EXPORTER_OTLP_ENDPOINT`)
  - Verify spans from mutation pipeline in production
