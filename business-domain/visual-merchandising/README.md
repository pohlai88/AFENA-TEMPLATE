# afenda-visual-merchandising

Visual merchandising and store display management for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-visual-merchandising` provides domain-specific business logic for
visual merchandising operations including planogram management, compliance
tracking, display performance, and placement optimization.

## When to Use This Package

Use `afenda-visual-merchandising` when you need to:

- Create and manage planograms for retail displays
- Track planogram compliance and deviations
- Optimize product placement by performance
- Manage display installations and photos
- Monitor merchandising standards compliance
- Analyze display performance metrics

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### Planogram Management

- Multiple fixture types (gondola, endcap, shelf, display table, wall bay)
- Product placement by shelf position
- Shelf zones (eye level, reach level, stooping, stretch)
- Facing quantity requirements

### Compliance Tracking

Monitor planogram deviations:
- Missing products
- Wrong shelf placement
- Wrong position on shelf
- Insufficient facings

### Placement Optimization

Optimize product placement based on:
- Sales performance
- Profit margins
- Product ranking
- Zone effectiveness (eye level = highest performance)

### Display Performance

Track display effectiveness:
- Traffic vs. targets
- Conversion rates
- Revenue generated
- ROI per display

### Merchandising Standards

Ensure compliance with:
- Window display guidelines
- Mannequin styling requirements
- Color blocking principles
- Product grouping rules
- Signage standards
- Lighting specifications
- Fixture guidelines

### Analytics

Monitor VM performance with:
- Compliance scores
- Pass/fail rates
- Deviation trends
- Display effectiveness
- Corrective action time
