# afenda-branding

Brand management and compliance for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-branding` provides domain-specific business logic for brand management
including guidelines administration, asset library management, compliance
monitoring, brand health tracking, and trademark protection.

## When to Use This Package

Use `afenda-branding` when you need to:

- Manage brand guidelines and standards
- Maintain brand asset library
- Monitor brand compliance
- Track brand health metrics
- Manage trademarks and registrations
- Analyze brand performance

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### Brand Guidelines

Maintain comprehensive brand standards:
- Logo specifications and variants
- Color palettes (Hex, RGB, CMYK, Pantone)
- Typography specifications
- Imagery guidelines
- Usage rules

### Asset Library

Organize brand assets:
- Logos
- Images
- Videos
- Templates
- Fonts
- Icons
- Illustrations
- Download tracking
- License management

### Compliance Monitoring

Ensure brand consistency:
- Logo usage compliance
- Color accuracy
- Typography compliance
- Messaging alignment
- Imagery appropriateness
- Overall compliance scoring

### Brand Health Tracking

Monitor brand performance across 5 areas:
- **Awareness** (15%): Brand, aided, unaided, top-of-mind
- **Perception** (25%): Favorability, trust, quality, value
- **Consideration** (20%): Brand consideration, purchase intent
- **Loyalty** (25%): Satisfaction, NPS, repurchase intent
- **Differentiation** (15%): Uniqueness, competitive advantage

### Trademark Management

Protect brand IP:
- Registration tracking by jurisdiction
- Nice classification
- Renewal deadline monitoring
- Status tracking
- Expiration alerts

### Compliance Reviews

Regular brand audit process:
- Issue categorization (critical, major, minor)
- Compliance areas (logo, color, typography, messaging, imagery)
- Overall scoring
- Pass threshold (80%)
- Corrective action tracking
