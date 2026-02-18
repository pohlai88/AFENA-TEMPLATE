# afenda-onboarding

New hire onboarding and integration management for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-onboarding` provides domain-specific business logic for onboarding
operations including onboarding plans, orientation programs, equipment tracking,
knowledge transfer, and integration monitoring.

## When to Use This Package

Use `afenda-onboarding` when you need to:

- Create comprehensive onboarding plans
- Manage onboarding checklists (preboarding through first quarter)
- Track equipment assignments and returns
- Schedule feedback sessions and check-ins
- Coordinate orientation programs
- Assign and track training completion
- Analyze onboarding metrics

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### Onboarding Plans

Structured integration with 5 phases:
- **Preboarding**: Activities before day one
- **Day one**: First day essentials
- **First week**: Initial integration
- **First month**: 30-day milestone
- **First quarter**: 90-day review

### Checklist Management

Task assignment across stakeholders:
- Employee responsibilities
- HR tasks
- Manager duties
- IT setup
- Facilities coordination
- Finance processing

### Equipment Tracking

Manage new hire equipment (8 types):
- Laptop
- Monitor
- Phone
- Headset
- Keyboard/mouse
- Access card
- Other items
- Serial number and asset tracking

### Feedback Sessions

Regular check-ins (5 types):
- Initial check-in
- 1-week review
- 1-month review
- 3-month review
- 6-month review
- Satisfaction ratings (employee and manager)
- Action item tracking

### Orientation Programs

Comprehensive orientation (6 session types):
- Company overview
- HR policies
- Systems training
- Department introduction
- Safety training
- Compliance training

### Training Management

Coordinate learning (5 categories):
- Compliance training
- Systems training
- Product knowledge
- Process training
- Professional development

Delivery methods:
- E-learning
- Instructor-led
- On-the-job
- Self-paced

### Critical Gap Identification

Proactive risk management:
- Missing critical tasks
- Incomplete required training
- Missed feedback sessions

### Onboarding Analytics

Measure program effectiveness (13 metrics):
- Completion time
- On-time completion rate
- Task completion percentage
- Critical task completion
- Training completion rates
- Satisfaction scores (employee and manager)
- Retention rates (30-day and 90-day)
- Time to productivity
