# Pre-Production Ops Checklist

Manual operational tasks required before production launch.

## Cloudflare R2

- [ ] **R2 CORS** — Configure in Cloudflare Dashboard
  - Origins: `http://localhost:3000`, `https://nexuscanon.com`, `https://www.nexuscanon.com`
  - Methods: PUT, GET, HEAD
  - Headers: Content-Type, Content-MD5, x-amz-*

- [ ] **R2 Limits** — Configure in Cloudflare Dashboard
  - Max object size policy
  - Cache-control defaults for public assets

## Secrets

- [ ] **Rotate production secrets** — Set in Vercel/hosting env
  - `NEON_AUTH_COOKIE_SECRET`
  - `SESSION_SECRET`
  - `NEXTAUTH_SECRET`

## Neon Auth

- [ ] **Auth domain** — Add in Neon Console → Auth → Settings → Domains
  - `www.nexuscanon.com`
  - `nexuscanon.com`

## Observability (optional, pre-launch)

- [ ] **Error tracking** — GlitchTip or equivalent
  - Configure DSN in production env
  - Verify error capture from server actions

- [ ] **Tracing** — Tempo or equivalent
  - Configure tracing endpoint
  - Verify spans from mutation pipeline
