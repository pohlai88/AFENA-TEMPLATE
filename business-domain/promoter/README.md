# afenda-promoter

<!-- afenda:badges -->
![C - Sales, Marketing & CX](https://img.shields.io/badge/C-Sales%2C+Marketing+%26+CX-FF5630?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--promoter-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-C%20·%20of%2010-lightgrey?style=flat-square)


Brand promoter and field marketing management for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-promoter` provides domain-specific business logic for promoter
management including registration, event staffing, activity tracking,
and performance measurement.

## When to Use This Package

Use `afenda-promoter` when you need to:

- Register and manage brand promoters
- Plan and staff promotional events
- Assign promoters to events and roles
- Track activity reports and consumer engagement
- Calculate promoter compensation
- Analyze promoter and event performance

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### Promoter Registry

Manage promoter workforce:
- Promoter types (brand ambassador, event staff, demonstrator, merchandiser, field rep)
- Employment types (full-time, part-time, contract, temporary)
- Skills and certifications
- Availability tracking
- Performance history

### Event Management

Plan promotional events:
- Event types (in-store demo, sampling, trade show, street team, brand activation, pop-up)
- Staffing requirements
- Event details and locations
- Budget tracking

### Promoter Assignment

Optimize event staffing:
- Role assignment (lead, demonstrator, sampler, merchandiser, support)
- Check-in/check-out tracking
- Actual hours tracking
- Attendance monitoring

### Activity Reporting

Capture event outcomes:
- Consumer engagements
- Samples distributed
- Demonstrations given
- Leads collected
- Consumer feedback (positive, neutral, negative)

### Compensation

Fair and accurate pay:
- Hourly rate calculation
- Actual hours worked
- Expense reimbursement
- Total compensation

### Performance Metrics

Measure effectiveness:
- Attendance rate
- Punctuality rate (15-min grace period)
- Average ratings
- Total engagements
- Weighted performance score (rating 40% + attendance 30% + engagement 30%)

### Event ROI

Analyze event success:
- Cost per engagement
- Cost per lead
- Engagement rate vs. target
- Lead conversion rate
