# afenda-secretariat

<!-- afenda:badges -->
![H - Governance, Risk & Compliance](https://img.shields.io/badge/H-Governance%2C+Risk+%26+Compliance-403294?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--secretariat-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-H%20·%20of%2010-lightgrey?style=flat-square)


Corporate secretariat and governance management for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-secretariat` provides domain-specific business logic for corporate
secretary functions including board management, resolution tracking, statutory
filings, compliance calendars, and governance documentation.

## When to Use This Package

Use `afenda-secretariat` when you need to:

- Manage board meetings (quorum validation, attendance, minutes)
- Track resolutions and voting records
- Manage statutory filings and deadlines
- Maintain governance documentation
- Monitor compliance calendars
- Generate governance analytics

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### Board Meeting Management

- Multiple meeting types (board, committee, shareholders, extraordinary)
- Quorum validation based on eligible voters
- Attendance tracking
- Voting records

### Resolution Management

Support for various resolution types:
- Ordinary resolutions
- Special resolutions
- Written resolutions
- Circular resolutions

### Statutory Filings

Track and manage required filings:
- Annual returns
- Financial statements
- Director appointments
- Share allotments
- Office changes
- Name changes

### Compliance Calendar

Automated deadline tracking with categorization:
- Filing deadlines
- Meeting requirements
- Report submissions
- License renewals
- Payment obligations

### Governance Analytics

Monitor governance health with metrics:
- Quorum success rate
- On-time filing rate
- Meeting frequency
- Compliance scores
