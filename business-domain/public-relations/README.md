# afenda-public-relations

<!-- afenda:badges -->
![C - Sales, Marketing & CX](https://img.shields.io/badge/C-Sales%2C+Marketing+%26+CX-FF5630?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--public--relations-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-C%20·%20of%2010-lightgrey?style=flat-square)


Public relations and media management for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-public-relations` provides domain-specific business logic for PR
operations including campaign management, media relations, press releases,
coverage tracking, and crisis management.

## When to Use This Package

Use `afenda-public-relations` when you need to:

- Manage PR campaigns and initiatives
- Track media contacts and relationships
- Distribute press releases with embargo support
- Monitor media coverage and sentiment
- Handle crisis communications
- Analyze PR performance metrics

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### PR Campaign Management

Support multiple campaign types:
- Product launches
- Crisis management
- Brand awareness
- Thought leadership
- Event promotion
- Reputation management

### Media Relations

Build and manage media relationships:
- Contact database (journalists, outlets)
- Pitch tracking
- Success rates by contact
- Relationship status (cold, warm, hot)
- Coverage history

### Press Release Management

Professional press release handling:
- Embargo date/time support
- Distribution tracking
- Pickup monitoring
- Multi-outlet distribution
- Boilerplate management

### Media Coverage Analysis

Track and analyze coverage:
- Coverage types (news, feature, interview, review, opinion)
- Sentiment analysis (positive, neutral, negative, mixed)
- Prominence scoring
- Reach calculation
- Share of voice
- Engagement metrics

### Crisis Management

Handle communications crises:
- Crisis types (product, executive, data breach, legal, etc.)
- Severity levels (low, medium, high, critical)
- Response team coordination
- Status tracking
- Response time monitoring
- Resolution tracking

### PR Analytics

Measure PR effectiveness:
- Total coverage count
- Sentiment distribution
- Total reach
- Pitch success rate
- Average response time
- Top performing journalists
- Crisis response efficiency
