# Capability Coverage Matrix

> Generated at 2026-02-22T03:14:33.153Z | Policy phase 3

## Summary

| Status | Count |
| ------ | ----- |
| ✅ Covered | 27 |
| ⚠️ Orphaned | 4 |
| 👻 Phantom | 0 |
| 🔕 Excepted | 2 |
| 📋 Planned | 0 |
| **Total** | **33** |

## Mutation Capabilities

| Key | Status | Surfaces | UI |
| --- | ------ | -------- | -- |
| `contacts.create` | ✅ covered | 2 surface(s) | 1 page(s) |
| `contacts.update` | ✅ covered | 2 surface(s) | 1 page(s) |
| `contacts.delete` | ✅ covered | 2 surface(s) | 2 page(s) |
| `contacts.restore` | ✅ covered | 2 surface(s) | 1 page(s) |
| `companies.create` | ✅ covered | 2 surface(s) | 2 page(s) |
| `companies.update` | ✅ covered | 2 surface(s) | 2 page(s) |
| `companies.delete` | ✅ covered | 2 surface(s) | 2 page(s) |
| `companies.restore` | ✅ covered | 2 surface(s) | 1 page(s) |

## Read Capabilities

| Key | Status | Surfaces | UI |
| --- | ------ | -------- | -- |
| `contacts.read` | ✅ covered | 1 surface(s) | 1 page(s) |
| `contacts.list` | ✅ covered | 1 surface(s) | 2 page(s) |
| `contacts.versions` | ✅ covered | 1 surface(s) | 1 page(s) |
| `contacts.audit` | ✅ covered | 1 surface(s) | 1 page(s) |
| `custom_fields.read` | ✅ covered | 1 surface(s) | — |
| `views.read` | ✅ covered | 1 surface(s) | — |
| `system.health.read` | ✅ covered | 2 surface(s) | — |
| `companies.read` | ✅ covered | 1 surface(s) | 1 page(s) |
| `companies.list` | ✅ covered | 1 surface(s) | 2 page(s) |
| `companies.versions` | ✅ covered | 1 surface(s) | 1 page(s) |
| `companies.audit` | ✅ covered | 1 surface(s) | 1 page(s) |

## Search Capabilities

| Key | Status | Surfaces | UI |
| --- | ------ | -------- | -- |
| `contacts.search` | ✅ covered | 1 surface(s) | — |
| `search.global` | ✅ covered | 3 surface(s) | — |

## Admin Capabilities

| Key | Status | Surfaces | UI |
| --- | ------ | -------- | -- |
| `admin.custom_fields.define` | ⚠️ orphaned | — | — |
| `admin.custom_fields.sync` | ⚠️ orphaned | — | — |
| `admin.aliases.resolve` | ⚠️ orphaned | — | — |
| `admin.roles.manage` | ✅ covered | 1 surface(s) | — |
| `admin.views.manage` | ✅ covered | 2 surface(s) | — |
| `system.workflows.manage` | ✅ covered | 1 surface(s) | — |

## System Capabilities

| Key | Status | Surfaces | UI |
| --- | ------ | -------- | -- |
| `system.workflows.evaluate` | ⚠️ orphaned | — | — |

## Auth Capabilities

| Key | Status | Surfaces | UI |
| --- | ------ | -------- | -- |
| `auth.sign_in` | ✅ covered | 1 surface(s) | 1 page(s) |
| `auth.sign_out` | ✅ covered | 1 surface(s) | 1 page(s) |

## Storage Capabilities

| Key | Status | Surfaces | UI |
| --- | ------ | -------- | -- |
| `storage.files.upload` | 🔕 excepted | 1 surface(s) | — |
| `storage.files.metadata` | ✅ covered | 1 surface(s) | — |
| `storage.files.save` | 🔕 excepted | 1 surface(s) | — |

## Active Exceptions

| ID | Key | Rule | Reason | Expires |
| -- | --- | ---- | ------ | ------- |
| EXC-0001 | `storage.files.upload` | VIS-00 | Presign route generates a signed URL but does not call mutate() — the actual upload goes directly to R2. No kernel write boundary to tag. | 2026-04-15 |
| EXC-0002 | `storage.files.save` | VIS-00 | Metadata POST uses raw db.insert (not kernel mutate) for r2_files table which is not a domain entity. Will migrate to kernel in Phase 2. | 2026-04-15 |

