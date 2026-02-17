# API Documentation

## Overview

afenda provides a REST API for managing entities, workflows, and advisory services.

## Specifications

- **OpenAPI Spec**: [openapi.yaml](./openapi.yaml)
- **Interactive Docs**: Available at `/api/docs` (Swagger UI)
- **Base URL**: `https://app.afenda.dev/api` (Production)

## Authentication

All API endpoints (except public routes) require JWT authentication.

### Getting a Token

```bash
# Step 1: Sign in via Neon Auth
curl -X POST https://app.afenda.dev/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Step 2: Token returned in httpOnly cookie
# Use browser or HTTP client that handles cookies
```

### Using the Token

```bash
curl https://app.afenda.dev/api/users/me \
  -H "Authorization: Bearer <jwt-token>"
```

## Rate Limiting

- **Authenticated**: 1000 requests/hour
- **Unauthenticated**: 100 requests/hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1640995200
```

## Endpoints

### Health Checks

#### `GET /api/health`
Full health status including database and memory checks.

**Response**:
```json
{
  "healthy": true,
  "name": "afenda-web",
  "checks": {
    "database": {
      "healthy": true,
      "message": "Database connection OK",
      "responseTime": 15
    },
    "memory": {
      "healthy": true,
      "message": "Memory usage: 256MB / 1024MB",
      "responseTime": 1
    }
  },
  "timestamp": "2026-02-17T10:30:00Z",
  "uptime": 3600
}
```

#### `GET /api/ready`
Kubernetes readiness probe (returns `OK` or `NOT READY`).

#### `GET /api/alive`
Kubernetes liveness probe (returns `OK` or `DEAD`).

### Users

#### `GET /api/users/me`
Get current authenticated user.

**Headers**:
```
Authorization: Bearer <jwt-token>
```

**Response**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {
    "field": "email",
    "reason": "Invalid email format"
  },
  "correlationId": "abc-123-def-456"
}
```

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `BAD_REQUEST` | 400 | Invalid request parameters |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate email) |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

## Correlation IDs

Every request includes a correlation ID (`x-correlation-id` header) for debugging:

```bash
curl -H "x-correlation-id: my-custom-id" https://app.afenda.dev/api/health
```

If not provided, one is auto-generated. Reference this ID when reporting issues.

## Versioning

API version is included in the URL:

- **Current**: `/api/v1/...` (default, no version prefix)
- **Future**: `/api/v2/...` (when breaking changes occur)

## Examples

### cURL

```bash
# Health check
curl https://app.afenda.dev/api/health

# Get current user (authenticated)
curl -H "Authorization: Bearer <jwt>" https://app.afenda.dev/api/users/me
```

### JavaScript/Fetch

```javascript
// With correlation ID propagation
import { fetchWithCorrelation } from 'afenda-observability/correlation';

const response = await fetchWithCorrelation('https://app.afenda.dev/api/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const user = await response.json();
```

### TypeScript with Type Safety

```typescript
import type { User } from '@/types/api';

async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch('https://app.afenda.dev/api/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
```

## Development

### Local API Server

```bash
pnpm dev
# API available at http://localhost:3000/api
```

### Viewing OpenAPI Docs Locally

```bash
# Install Swagger UI viewer
pnpm add -g swagger-ui-watcher

# Serve OpenAPI spec
swagger-ui-watcher docs/api/openapi.yaml
# Open http://localhost:8080
```

### Generating Client SDKs

```bash
# Generate TypeScript client
npx openapi-typescript docs/api/openapi.yaml -o src/types/api.ts

# Generate Python client
pip install openapi-generator-cli
openapi-generator-cli generate -i docs/api/openapi.yaml -g python -o clients/python
```

## Resources

- [OpenAPI Specification](https://spec.openapis.org/oas/v3.1.0)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [API Best Practices](https://github.com/microsoft/api-guidelines)

---

**Questions?** Check the [main README](../../README.md) or contact support.
