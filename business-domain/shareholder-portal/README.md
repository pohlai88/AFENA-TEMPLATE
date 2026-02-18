# afenda-shareholder-portal

Shareholder self-service portal and investor communications for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-shareholder-portal` provides domain-specific business logic for
shareholder portal operations including account management, dividend statements,
proxy voting, communications, and document access.

## When to Use This Package

Use `afenda-shareholder-portal` when you need to:

- Manage shareholder portal accounts
- Calculate and display dividend payments
- Enable proxy voting for shareholder meetings
- Distribute shareholder communications
- Calculate shareholder returns (ROI, gains)
- Provide access to governance documents

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### Account Management

- Holdings tracking
- Ownership percentage calculation
- Cost basis and current value
- Share class information

### Dividend Management

Calculate dividend payments with:
- Gross dividend calculation
- Withholding tax application
- Net dividend to shareholder
- Payment history tracking

### Proxy Voting

Enable shareholder participation:
- Resolution voting
- Voting power calculation
- Meeting types (AGM, EGM, class meetings)
- Vote aggregation and results

### Shareholder Communications

Deliver various communication types:
- Announcements
- Meeting notices
- Financial reports
- Dividend notices
- Corporate actions
- Newsletters

### Document Library

Provide access to:
- Annual reports
- Financial statements
- Meeting minutes
- Prospectuses
- Share certificates
- Tax forms

### Engagement Analytics

Monitor shareholder engagement:
- Portal adoption rate
- Communication read rates
- Voting participation
- Top shareholders by ownership
