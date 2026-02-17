# ADR-001: Use Neon Postgres for Database

**Status**: Accepted  
**Date**: 2025-11-15  
**Deciders**: Engineering Team  
**Technical Story**: Database selection for afenda platform

## Context

We needed a PostgreSQL database solution that:
- Supports serverless/edge deployment models
- Provides connection pooling for high concurrency
- Offers branch-based development workflows
- Scales automatically with demand
- Minimizes operational overhead

Traditional PostgreSQL hosting (RDS, self-hosted) requires:
- Manual connection pool management
- Complex branching/staging setup
- Manual scaling configuration
- High operational burden

## Decision

We will use **Neon Postgres** as our primary database solution.

### Key Features Utilized

1. **Serverless Postgres**: Auto-scaling compute that pauses when idle
2. **Built-in Connection Pooling**: PgBouncer-compatible pooler for serverless functions
3. **Database Branching**: Git-like branches for development/testing
4. **Neon Auth**: Integrated JWT-based authentication with RLS
5. **Neon Data API**: PostgREST-style REST API for browser access

### Connection Strategy

- **Application Runtime**: Pooled connections (`host-pooler.region.aws.neon.tech`)
- **Database Migrations**: Direct TCP (`host.region.aws.neon.tech`) for DDL/locks
- **Search Worker**: BYPASSRLS connection for multi-tenant operations

## Consequences

### Positive

✅ **Zero connection management**: Built-in pooling handles serverless concurrency  
✅ **Branch-based workflow**: Each feature branch can have its own database branch  
✅ **Cost efficiency**: Compute auto-pauses when idle, storage-based pricing  
✅ **Fast cold starts**: Pooler maintains warm connections  
✅ **Integrated auth**: Neon Auth eliminates need for separate auth service  
✅ **Developer experience**: Instant database provisioning for testing  

### Negative

⚠️ **Vendor lock-in**: Neon-specific features (branching, auth) are not portable  
⚠️ **Beta features**: Neon Auth and Data API are in beta (may have breaking changes)  
⚠️ **Regional availability**: Limited to specific AWS regions  
⚠️ **Learning curve**: Team needs to learn Neon-specific workflows  

### Neutral

ℹ️ **Migration strategy**: Standard PostgreSQL makes migration to/from Neon straightforward  
ℹ️ **Compatibility**: 100% PostgreSQL-compatible, no proprietary SQL extensions used  

## Alternatives Considered

### Supabase
- ❌ More opinionated full-stack platform
- ❌ Heavier weight (includes auth, storage, realtime)
- ✅ Better real-time features
- **Rejected**: Too many features we don't need

### AWS RDS (PostgreSQL)
- ✅ Mature, production-proven
- ❌ No serverless connection pooling
- ❌ Manual scaling configuration
- ❌ No branching workflow
- **Rejected**: Too much operational overhead

### PlanetScale (MySQL)
- ✅ Excellent branching workflow
- ❌ MySQL, not PostgreSQL
- ❌ No native JSON/JSONB support
- **Rejected**: Team expertise is in PostgreSQL

### Self-Hosted PostgreSQL
- ✅ Full control
- ❌ High operational burden
- ❌ Manual connection pooling setup
- ❌ Complex HA/backup configuration
- **Rejected**: Not suitable for lean team

## Implementation Notes

- Use `@neondatabase/neon-js` for serverless HTTP queries
- Use `pg` with pooled connections for traditional queries
- Environment variables: `DATABASE_URL`, `DATABASE_URL_MIGRATIONS`
- Database branching integrated into CI/CD pipeline

## References

- [Neon Documentation](https://neon.tech/docs)
- [Neon Auth Guide](https://neon.tech/docs/guides/neon-auth)
- [Connection Pooling Best Practices](https://neon.tech/docs/connect/connection-pooling)
