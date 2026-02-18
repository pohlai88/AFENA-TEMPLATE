# afenda-advertising

<!-- afenda:badges -->
![C - Sales, Marketing & CX](https://img.shields.io/badge/C-Sales%2C+Marketing+%26+CX-FF5630?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--advertising-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-C%20·%20of%2010-lightgrey?style=flat-square)


Advertising campaign and media buying management for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-advertising` provides domain-specific business logic for advertising
operations including campaign management, media buying, creative management,
performance tracking, and A/B testing.

## When to Use This Package

Use `afenda-advertising` when you need to:

- Manage advertising campaigns across channels
- Execute media buying with multiple platforms
- Track creative asset performance
- Monitor ad performance metrics (CTR, ROAS, ROI)
- Conduct A/B testing with statistical confidence
- Attribute conversions across touchpoints

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### Campaign Management

Support multiple campaign types:
- Display advertising
- Video advertising
- Search advertising
- Social media advertising
- Native advertising
- Audio advertising
- Out-of-home advertising

### Buying Models

Flexible pricing models:
- CPM (Cost per thousand impressions)
- CPC (Cost per click)
- CPA (Cost per acquisition)
- CPV (Cost per view)
- Flat fee

### Media Buying

Integrate with major platforms:
- Google Ads
- Meta (Facebook/Instagram)
- LinkedIn Ads
- Twitter/X Ads
- Programmatic platforms
- Direct publisher buys

### Creative Management

Organize advertising assets:
- Multiple formats (banner, video, interstitial, native, rich media)
- Performance tracking by creative
- Approval workflows
- Usage across campaigns

### Performance Metrics

Track comprehensive ad metrics:
- Impressions, reach, frequency
- Clicks and CTR
- Video views and completion
- Conversions and conversion rate
- CPM, CPC, CPA calculations
- Revenue and ROAS
- ROI calculation

### A/B Testing

Statistical testing with confidence scoring:
- Test types (creative, audience, placement, bidding)
- Variant comparison
- Winner determination (>20% = 95% confidence, >10% = 85%, >5% = 70%)
- CPA optimization (lower is better)
- CTR/conversion optimization (higher is better)

### Attribution

Track customer journey:
- First-click attribution
- Last-click attribution
- Linear attribution
- Time-decay attribution
- Position-based attribution
- Data-driven attribution
