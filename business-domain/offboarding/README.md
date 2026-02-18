# afenda-offboarding

Employee exit and offboarding management for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-offboarding` provides domain-specific business logic for offboarding
operations including exit procedures, knowledge transfer, clearance tracking,
exit interviews, and alumni relations.

## When to Use This Package

Use `afenda-offboarding` when you need to:

- Manage employee exit procedures
- Plan and execute knowledge transfer
- Track clearance items and asset returns
- Conduct exit interviews
- Calculate final payments
- Maintain alumni network
- Analyze turnover trends

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### Offboarding Plans

Structured exit process for all exit types:
- Resignation
- Retirement
- Termination
- End of contract
- Layoff

### Exit Checklists

Comprehensive task tracking:
- Equipment return
- System access revocation
- Exit interviews
- Knowledge transfer
- Final payment processing

### Knowledge Transfer Planning

Minimize knowledge loss:
- Successor identification
- Critical process documentation
- Ongoing project handover
- Key contact introductions
- System access handover
- Handover session scheduling

### Clearance Management

Track clearance items:
- Equipment recovery
- Access card return
- Key return
- Document return
- System access removal
- Corporate card cancellation

### Exit Interviews

Gather valuable feedback:
- Exit reason categorization
- Satisfaction ratings (6 areas: job, management, culture, compensation, career dev, work-life balance)
- What worked well
- Areas for improvement
- Suggestions
- Rehire eligibility assessment
- Future relationship interest

### Final Payment Calculation

Accurate settlement:
- Outstanding salary
- Unused vacation payout
- Pro-rated bonus
- Deductions (advances, unreturned equipment)
- Benefits continuation info

### Alumni Network

Maintain relationships:
- Alumni enrollment
- Contact information
- Current employer tracking
- Rehire eligibility
- Referral tracking
- Engagement monitoring

### Turnover Analytics

Understand attrition (14 metrics):
- Voluntary vs. involuntary exits
- Exit reasons analysis
- Satisfaction trends
- Rehire eligibility rate
- Turnover rates (overall and voluntary)
- Exit interview completion
- Clearance compliance
- Knowledge transfer completion
