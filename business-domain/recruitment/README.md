# afenda-recruitment

<!-- afenda:badges -->
![E - Human Capital Management](https://img.shields.io/badge/E-Human+Capital+Management-00B8D9?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--recruitment-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-E%20·%20of%2010-lightgrey?style=flat-square)


Applicant tracking and recruitment management for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-recruitment` provides domain-specific business logic for recruitment
operations including requisition management, applicant tracking, screening,
interview scheduling, and offer management.

## When to Use This Package

Use `afenda-recruitment` when you need to:

- Create and manage job requisitions
- Track candidates through the recruitment pipeline
- Score and screen applicants
- Schedule and track interviews
- Extend and manage job offers
- Analyze recruitment funnel metrics

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### Job Requisition Management

Define hiring needs:
- Employment types (full-time, part-time, contract, temporary, intern)
- Seniority levels (entry, intermediate, senior, lead, executive)
- Required qualifications and skills
- Approval workflows
- Requisition status tracking

### Applicant Tracking

Manage candidate pipeline (10 stages):
1. New application
2. Screening
3. Phone screen
4. Interview
5. Assessment
6. Reference check
7. Offer
8. Hired
9. Rejected
10. Withdrawn

### Intelligent Screening

100-point scoring algorithm:
- **Experience match** (0-30 points): Years of experience vs. seniority requirements
- **Keyword match** (0-40 points): 5 points per matched keyword, max 40
- **Education** (0-20 points): 20 for relevant degree, 10 otherwise
- **Source bonus** (0-10 points): 10 for referral/recruiter, 5 for company website

### Interview Management

Coordinate interview process:
- Interview types (phone, video, onsite, panel, technical, behavioral)
- Multi-interviewer support
- Feedback collection
- Recommendations (strong yes, yes, maybe, no, strong no)

### Offer Management

Professional offer process:
- Comprehensive terms (salary, bonus, equity, benefits, vacation)
- Probation period
- Start date
- Validity period
- Response tracking (accepted, declined, countered)

### Recruitment Analytics

Measure hiring effectiveness:
- Time-to-fill
- Funnel conversion rates (screening, interview, offer)
- Candidate quality scores
- Offer acceptance/decline rates
- Top sourcing channels
- Cost per hire
