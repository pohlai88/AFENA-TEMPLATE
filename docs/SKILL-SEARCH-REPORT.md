# Agent Skills Search Report

## Search Date

January 2025

## Objective

Search for agent skills that match our technology stack: Zod, Drizzle ORM, React Hook Form, TanStack Table, shadcn/ui, tsup bundling, Security/Audit, Accessibility (a11y), and React v19.

## Search Results

### ✅ 1. Zod Validation

#### Primary Recommendation: `leonaaardob/lb-zod-skill`

- **Source**: `leonaaardob/lb-zod-skill`
- **Stars**: 0 (recently created)
- **Last Updated**: 10 days ago
- **Description**: Complete Zod validation library documentation in markdown format for AI agents - covers schema validation, type inference, and error handling
- **Topics**: markdown, documentation, typescript, schema, validation
- **Format**: MDX
- **Use Case**: Perfect for our extensive Zod usage in afena-cli and validation patterns

#### Alternative: `danielmeppiel/form-builder`

- **Source**: `danielmeppiel/form-builder`
- **Description**: Agent Skill for building production-ready forms with React Hook Form + Zod validation
- **Combined**: Covers both Zod and React Hook Form together

### ✅ 2. Drizzle ORM

#### Recommendation: `leonaaardob/lb-drizzle-skill`

- **Source**: `leonaaardob/lb-drizzle-skill`
- **Stars**: 0 (recently created)
- **Last Updated**: 10 days ago
- **Description**: Complete Drizzle ORM documentation in markdown format for AI agents - covers schema, queries, migrations, and database integrations (PostgreSQL, MySQL, SQLite)
- **Topics**: markdown, documentation, typescript, sql, orm
- **Format**: MDX
- **Use Case**: Essential for our database layer with drizzle-orm and quality-metrics packages

### ✅ 3. React Hook Form (+ Zod)

#### Recommendation: `danielmeppiel/form-builder`

- **Source**: `danielmeppiel/form-builder`
- **Stars**: 0
- **Last Updated**: 25 days ago
- **Description**: Agent Skill for building production-ready forms with React Hook Form + Zod validation
- **Use Case**: Covers form handling patterns used throughout business-domain packages

### ✅ 4. shadcn/ui Components

#### Primary Recommendation: `leonaaardob/lb-shadcn-ui-skill`

- **Source**: `leonaaardob/lb-shadcn-ui-skill`
- **Stars**: 0 (recently created)
- **Last Updated**: 10 days ago
- **Description**: Complete shadcn/ui documentation in markdown format for AI agents - covers 50+ copy-paste components built with Radix UI and Tailwind CSS
- **Topics**: react, markdown, components, documentation, ai

#### Alternative: `ThunderboltDev/shadcn-baseui`

- **Source**: `ThunderboltDev/shadcn-baseui`
- **Last Updated**: 17 days ago
- **Description**: Skills for AI agents when using shadcn/ui with Base UI

#### Alternative: `jgarrison929/openclaw-skills`

- **Source**: `jgarrison929/openclaw-skills`
- **Description**: OpenClaw agent skills including .NET, Next.js, React, TypeScript, shadcn/ui, security, databases

### ❌ 5. TanStack Table / React Table

#### Status: No Dedicated Skill Found

- **Search Results**: 0 repositories
- **Alternative**: 979 pull requests and 68 commits mention it, but no standalone agent skill
- **Recommendation**: Consider creating custom skill from TanStack Table documentation

### ❌ 6. tsup Bundling

#### Status: No Dedicated Skill Found

- **Search Results**: 0 repositories
- **Alternative**: Our existing `vitest-testing` and `package-development` skills cover build configuration
- **Recommendation**: Document tsup patterns in package-development skill

### ✅ 7. Security & Audit

#### Primary Recommendation: `prompt-security/clawsec`

- **Source**: `prompt-security/clawsec`
- **Stars**: 435 ⭐
- **Last Updated**: 7 hours ago (actively maintained)
- **Description**: Complete security skill suite for OpenClaw's family of agents. Protect your SOUL.md with drift detection, live security recommendations
- **Topics**: molt, clawdbot, clawdbot-skill, moltbot-skills, moltbot-skill
- **Format**: JavaScript
- **Use Case**: Comprehensive security suite for enterprise ERP system

#### Alternative: `pors/skill-audit`

- **Source**: `pors/skill-audit`
- **Stars**: 43 ⭐
- **Description**: Security auditing CLI for AI agent skills - detects prompt injection, secrets, and dangerous code patterns
- **Format**: Python

#### Alternative: `netresearch/security-audit-skill`

- **Source**: `netresearch/security-audit-skill`
- **Stars**: 2
- **Last Updated**: 2 days ago
- **Description**: Agent Skill for PHP security audits - OWASP patterns, vulnerability detection | Claude Code compatible
- **Topics**: open-standard, ai-agent, agent-skills

#### Alternative: `yoanbernabeu/supabase-pentest-skills`

- **Source**: `yoanbernabeu/supabase-pentest-skills`
- **Stars**: 29 ⭐
- **Description**: 24 AI Agent Skills for professional security auditing of Supabase applications

### ✅ 8. Accessibility (a11y)

#### Primary Recommendation: `KreerC/ACCESSIBILITY.md`

- **Source**: `KreerC/ACCESSIBILITY.md`
- **Stars**: 18 ⭐
- **Last Updated**: 8 days ago
- **Description**: SKILL.md for web accessibility by real accessibility experts. Make sure your AI agents develop web stuff accessibly
- **Topics**: documentation, web, accessibility, skill, a11y
- **Use Case**: Critical for ensuring enterprise-grade accessible UI components

#### Alternative: `simonplmak-cloud/wcag-aaa-web-design`

- **Source**: `simonplmak-cloud/wcag-aaa-web-design`
- **Stars**: 2
- **Last Updated**: 2 days ago
- **Description**: Open-source WCAG 2.2 AAA accessible design system and AI agent skill for building enterprise web applications. Includes full component library
- **Topics**: enterprise, frontend, accessibility, a11y, aria
- **Format**: CSS

### 🔍 9. React v19

#### Status: No Standalone Skill, Found in Composite Collections

- **Search Results**: 4 repositories (mostly composite skill collections)

#### Found in: `yonatangross/orchestkit`

- **Source**: `yonatangross/orchestkit`
- **Stars**: 76 ⭐
- **Last Updated**: 27 minutes ago (very active)
- **Description**: Complete AI Development Toolkit for Claude Code — 61 skills, 36 agents, 86 hooks, 3 plugins. Production-ready patterns for FastAPI, React...
- **Topics**: react, testing, security, typescript, mcp
- **Format**: TypeScript

#### Found in: `soilmass/vibe-coding-plugin`

- **Source**: `soilmass/vibe-coding-plugin`
- **Description**: Claude Code plugin with 56 skills, 16 agents, and 9 hooks for Next.js 15 + React 19 development
- **Format**: Python

#### Note on React v19

Our existing skills already cover React v19:

- `optimized-nextjs-typescript` (installed)
- `nextjs-16-complete-guide` (installed) - Next.js 16 includes React 19
- `next-best-practices` (installed)

## Installation Priority Recommendations

### High Priority (Immediate Install)

1. ✅ **Zod**: `leonaaardob/lb-zod-skill` - Critical for validation patterns
2. ✅ **Drizzle ORM**: `leonaaardob/lb-drizzle-skill` - Core database layer
3. ✅ **Security**: `prompt-security/clawsec` - 435 stars, actively maintained, comprehensive
4. ✅ **Accessibility**: `KreerC/ACCESSIBILITY.md` - Enterprise requirement

### Medium Priority

5. ✅ **shadcn/ui**: `leonaaardob/lb-shadcn-ui-skill` - UI component library
6. ✅ **React Hook Form**: `danielmeppiel/form-builder` - Form handling patterns

### Low Priority (Already Covered or Can Be Created)

7. ❌ **TanStack Table**: No skill found - consider creating custom skill
8. ❌ **tsup**: No skill found - already covered in package-development
9. ⚠️ **React v19**: Already covered by existing Next.js skills

## Skill Author Pattern

Notable: `leonaaardob` has created comprehensive documentation skills for:

- Zod validation
- Drizzle ORM
- shadcn/ui

All are:

- Recently created (10 days ago)
- MDX format (markdown with components)
- Comprehensive documentation coverage
- Zero stars (brand new)

## Installation Format

Based on existing skills in `.agents/INSTALLED-SKILLS.md`:

```bash
# Format: owner/repo@skill-name or owner/repo
npx skills add leonaaardob/lb-zod-skill
npx skills add leonaaardob/lb-drizzle-skill
npx skills add prompt-security/clawsec
npx skills add KreerC/ACCESSIBILITY.md
npx skills add leonaaardob/lb-shadcn-ui-skill
npx skills add danielmeppiel/form-builder
```

## Next Steps

1. **Review Security PR**: User mentioned having PR for security-stack - `prompt-security/clawsec` aligns perfectly
2. **Install High Priority Skills**: Zod, Drizzle ORM, Security, Accessibility
3. **Test Skills**: Validate skills work with GitHub Copilot
4. **Update INSTALLED-SKILLS.md**: Document new skills with sources and use cases
5. **Create Custom Skills**: Consider creating TanStack Table and tsup skills if needed

## Search Methodology

Used GitHub repository search with queries:

- `agent skill zod`
- `agent skill drizzle orm`
- `agent skill react hook form`
- `agent skill tanstack table`
- `agent skill shadcn ui`
- `agent skill tsup bundling`
- `agent skill security audit`
- `agent skill accessibility a11y`
- `agent skill react 19`

Filtered by:

- Repositories type
- Recent updates (within 30 days preferred)
- Star count (quality indicator)
- Relevance to monorepo stack
