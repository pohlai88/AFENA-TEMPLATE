# Neon MCP Usage Guide

> **Superseded** by [.architecture/database.architecture.md](./database.architecture.md) §10 Neon MCP Reference.
> This document is historical; do not edit.
> If conflicts exist, the consolidated doc wins.

> **Purpose:** Use Neon MCP Server for database introspection, migrations, and branch management from Cursor/AI tools.

---

## 1. Overview

The [Neon MCP Server](https://neon.com/docs/ai/neon-mcp-server) exposes Neon Postgres management via natural language. Use it for:

| Use Case | MCP Tool | When |
|----------|----------|------|
| **Schema introspection** | `mcp_Neon_describe_table_schema`, `mcp_Neon_get_database_tables` | Debugging, docs, understanding schema |
| **Run SQL** | `mcp_Neon_run_sql`, `mcp_Neon_run_sql_transaction` | Apply migrations, ad-hoc queries |
| **Query tuning** | `mcp_Neon_prepare_query_tuning`, `mcp_Neon_explain_sql_statement` | Performance analysis |
| **Branch management** | `mcp_Neon_create_branch`, `mcp_Neon_list_projects` | Preview envs, dev branches |
| **Schema diff** | `mcp_Neon_compare_database_schema` | Compare branches before merge |
| **Migration prep** | `mcp_Neon_prepare_database_migration` | Safe schema changes via temp branch |

---

## 2. Project Setup

1. **Neon MCP** must be configured in Cursor (MCP settings).
2. **Project ID** — Get from [Neon Console](https://console.neon.tech) or `mcp_Neon_list_projects`.
3. **Connection** — `DATABASE_URL` in `.env` points to Neon; MCP uses Neon API (no direct DB URL needed for most tools).

---

## 3. Common Workflows

### Inspect table schema

```
User: "Describe the sales_invoices table schema in Neon"
→ mcp_Neon_describe_table_schema(tableName: "sales_invoices", projectId: "...")
```

### List all tables

```
User: "List all tables in the Neon database"
→ mcp_Neon_get_database_tables(projectId: "...")
```

### Run a migration

```
User: "Run this SQL on Neon: CREATE INDEX ..."
→ mcp_Neon_run_sql(projectId: "...", sql: "...")
```

**Note:** Prefer `drizzle-kit migrate` for Drizzle-managed migrations. Use MCP for ad-hoc or one-off SQL.

### Query tuning

```
User: "This query is slow: SELECT * FROM sales_invoices WHERE ..."
→ mcp_Neon_prepare_query_tuning(projectId: "...", sql: "...", databaseName: "neondb")
```

### Compare branches

```
User: "Compare schema between main and feature branch"
→ mcp_Neon_compare_database_schema(projectId: "...", branchId: "...", databaseName: "neondb")
```

---

## 4. Integration with Afenda

| Afenda Component | Neon MCP Usage |
|------------------|----------------|
| **Drizzle schema** | Source of truth; MCP for introspection only |
| **Migrations** | `drizzle-kit generate` + `drizzle-kit migrate`; MCP for manual SQL if needed |
| **RW/RO** | `db` (RW) vs `dbRo` (RO); MCP connects to project default branch |
| **Branching** | Neon branches for preview; MCP to create/list branches |

---

## 5. References

- [Neon MCP Server](https://neon.com/docs/ai/neon-mcp-server)
- [Neon Docs Index](https://neon.com/docs/llms.txt)
- [database.architecture.md](./database.architecture.md)
- [db.schema.governance.md](./db.schema.governance.md)
