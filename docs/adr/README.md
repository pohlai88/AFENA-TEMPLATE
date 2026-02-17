# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) documenting significant architectural decisions made in the afenda project.

## What is an ADR?

An Architecture Decision Record (ADR) captures an important architectural decision made along with its context and consequences.

## Format

Each ADR follows this structure:

```markdown
# ADR-NNN: Title

**Status**: [Proposed | Accepted | Deprecated | Superseded]
**Date**: YYYY-MM-DD
**Deciders**: [List of people involved]
**Technical Story**: [Optional ticket/issue reference]

## Context

What is the issue we're facing? What factors are in play?

## Decision

What is the change we're proposing/have agreed to implement?

## Consequences

What becomes easier or more difficult to do because of this change?
```

## Naming Convention

ADRs are numbered sequentially and use kebab-case:

- `001-use-neon-postgres.md`
- `002-monorepo-with-turborepo.md`
- `003-typescript-strict-mode.md`

## Current ADRs

| Number | Title | Status |
|--------|-------|--------|
| [001](001-use-neon-postgres.md) | Use Neon Postgres for Database | Accepted |
| [002](002-monorepo-with-turborepo.md) | Monorepo with Turborepo | Accepted |
| [003](003-typescript-strict-mode.md) | TypeScript Strict Mode | Accepted |
| [004](004-opentelemetry-observability.md) | OpenTelemetry for Observability | Accepted |
| [005](005-shared-package-structure.md) | Shared Package Structure | Accepted |
| [006](006-neon-auth-authentication.md) | Neon Auth for Authentication | Accepted |

## Process

1. **Propose**: Create a new ADR with status "Proposed"
2. **Discuss**: Share with team for feedback
3. **Decide**: Update status to "Accepted" or "Rejected"
4. **Implement**: Reference ADR in relevant code/docs
5. **Review**: Periodically review ADRs for relevance

## Resources

- [ADR GitHub Organization](https://adr.github.io/)
- [Michael Nygard's ADR Template](https://github.com/joelparkerhenderson/architecture-decision-record)
