# afenda-marketing

<!-- afenda:badges -->
![C - Sales, Marketing & CX](https://img.shields.io/badge/C-Sales%2C+Marketing+%26+CX-FF5630?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--marketing-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-C%20·%20of%2010-lightgrey?style=flat-square)


Marketing campaign management and lead generation for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-marketing` provides domain-specific business logic for marketing
operations including campaign management, lead scoring, marketing automation,
content management, and marketing analytics.

## When to Use This Package

Use `afenda-marketing` when you need to:

- Create and manage marketing campaigns
- Score and qualify leads (MQL/SQL)
- Track campaign activities and performance
- Manage content assets
- Automate marketing workflows
- Calculate marketing ROI

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### Campaign Management

Support multiple campaign types:
- Brand awareness
- Lead generation
- Conversion
- Retention
- Product launch

### Multi-Channel Marketing

Execute campaigns across channels:
- Email marketing
- Social media
- Paid search
- Display advertising
- Content marketing
- Events
- Multi-channel campaigns

### Lead Scoring

Intelligent lead qualification:
- Behavioral scoring (60% weight)
- Demographic scoring (40% weight)
- Grades A-F based on total score
- Automatic MQL/SQL classification

### Campaign Activities

Track marketing touchpoints:
- Email sends
- Ad impressions and clicks
- Landing page visits
- Form submissions
- Content downloads
- Webinar registrations

### Marketing Automation

Automate workflows with:
- Trigger types (form, page visit, email click, score, date)
- Action sequences
- Conditional logic
- Multi-touch nurturing

### Content Management

Organize marketing assets:
- Blog posts
- Whitepapers
- eBooks
- Videos
- Infographics
- Case studies
- Webinars
- Email templates

### Marketing Analytics

Measure performance with:
- MQL/SQL conversion rates
- Cost per lead
- Campaign ROI
- Channel effectiveness
- Budget utilization
