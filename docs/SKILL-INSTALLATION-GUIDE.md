# Agent Skills Installation Guide

## Quick Install Commands

### Recommended Skills to Install

```bash
# Navigate to workspace root
cd c:\AI-BOS\AFENDA-NEXUS

# Install high-priority skills
npx skills add leonaaardob/lb-zod-skill
npx skills add leonaaardob/lb-drizzle-skill
npx skills add prompt-security/clawsec
npx skills add KreerC/ACCESSIBILITY.md

# Install medium-priority skills
npx skills add leonaaardob/lb-shadcn-ui-skill
npx skills add danielmeppiel/form-builder
```

## Skill Details

### 1. Zod Validation (`leonaaardob/lb-zod-skill`)

**Why**: Heavily used in afena-cli, validation patterns across packages
**Covers**: Schema validation, type inference, error handling
**Install Count**: TBD
**Source**: https://github.com/leonaaardob/lb-zod-skill

### 2. Drizzle ORM (`leonaaardob/lb-drizzle-skill`)

**Why**: Core database layer with quality-metrics package
**Covers**: Schema, queries, migrations, PostgreSQL/MySQL/SQLite
**Install Count**: TBD
**Source**: https://github.com/leonaaardob/lb-drizzle-skill

### 3. Security & Audit (`prompt-security/clawsec`)

**Why**: Enterprise ERP requires comprehensive security
**Covers**: Drift detection, security recommendations, vulnerability scanning
**Install Count**: 435 stars (most popular security skill)
**Source**: https://github.com/prompt-security/clawsec

### 4. Accessibility (`KreerC/ACCESSIBILITY.md`)

**Why**: Enterprise-grade UI requires WCAG compliance
**Covers**: Web accessibility patterns by real a11y experts
**Install Count**: 18 stars
**Source**: https://github.com/KreerC/ACCESSIBILITY.md

### 5. shadcn/ui Components (`leonaaardob/lb-shadcn-ui-skill`)

**Why**: UI components used in packages/ui
**Covers**: 50+ copy-paste components with Radix UI + Tailwind CSS
**Install Count**: TBD
**Source**: https://github.com/leonaaardob/lb-shadcn-ui-skill

### 6. React Hook Form (`danielmeppiel/form-builder`)

**Why**: Form handling patterns in business-domain packages
**Covers**: Production-ready forms with React Hook Form + Zod validation
**Install Count**: TBD
**Source**: https://github.com/danielmeppiel/form-builder

## Currently Installed Skills

### From skills.sh Repository

1. **monorepo-management** - `wshobson/agents@monorepo-management` (3.9K installs)
2. **next-best-practices** - `vercel-labs/next-skills@next-best-practices` (6.1K installs)
3. **nextjs-16-complete-guide** - `fernandofuc/nextjs-claude-setup@nextjs-16-complete-guide` (1.4K installs)
4. **optimized-nextjs-typescript** - `mindrally/skills@optimized-nextjs-typescript` (210 installs)
5. **pnpm** - `onmax/nuxt-skills@pnpm` (1.7K installs)

### Custom Project Skills (.agents/skills/)

- **lint-types-debug** - ESLint 9+ flat config, TypeScript-ESLint 8+
- **vitest-testing** - Vitest 4.0 testing patterns
- **neon-postgres** - Neon Serverless Postgres guide
- **package-development** - Package development patterns
- **find-skills** - Skill discovery helper
- **typescript-advanced-types** - Advanced TypeScript patterns

## Coverage Analysis

### ✅ Already Covered (No Installation Needed)

- **React v19**: Covered by nextjs-16-complete-guide, next-best-practices
- **ESLint**: Comprehensive coverage in lint-types-debug (805 lines)
- **Vitest**: vitest-testing skill
- **TypeScript**: typescript-advanced-types skill
- **tsup bundling**: Documented in package-development
- **pnpm**: Dedicated pnpm skill
- **Monorepo**: monorepo-management skill

### 🔍 New Coverage from Recommended Skills

- **Zod**: lb-zod-skill (NEW)
- **Drizzle ORM**: lb-drizzle-skill (NEW)
- **React Hook Form**: form-builder (NEW)
- **shadcn/ui**: lb-shadcn-ui-skill (NEW)
- **Security/Audit**: clawsec (NEW)
- **Accessibility**: ACCESSIBILITY.md (NEW)

### ❌ Not Available (Consider Creating)

- **TanStack Table**: No dedicated skill found
  - Recommendation: Create custom skill from TanStack Table v8 docs
  - Usage: Extensive use in business-domain data tables
  - Priority: Medium (can reference official docs for now)

## Installation Verification

After installing skills, verify they appear in:

```bash
# Check installed skills
ls .agents/skills/

# Or use skills.sh CLI
npx skills list
```

## Post-Installation

1. **Update INSTALLED-SKILLS.md**

   ```bash
   # Add new skills to .agents/INSTALLED-SKILLS.md
   # Include: name, source, install count, description, use case
   ```

2. **Test Skill Usage**

   ```bash
   # Ask GitHub Copilot to use specific skills
   # Example: "Using the lb-zod-skill, create a validation schema for user registration"
   ```

3. **Update Documentation**
   - Add skill references to relevant package READMEs
   - Update CONFIGURATION_GUIDE.md with skill-specific patterns
   - Cross-reference in PACKAGE_TEMPLATE.md

## Troubleshooting

### Skills Not Found

```bash
# Ensure skills.sh is accessible
npx skills --version

# Try direct GitHub URL
npx skills add https://github.com/leonaaardob/lb-zod-skill
```

### Skill Conflicts

```bash
# List all skills to check for duplicates
npx skills list

# Remove conflicting skill
npx skills remove <skill-name>
```

### Skill Not Loading in Copilot

1. Restart VS Code
2. Check `.agents/skills/` directory exists
3. Verify SKILL.md file format
4. Check GitHub Copilot extension is enabled

## Future Skills to Consider

Based on technology stack analysis:

1. **TanStack Query (React Query)**
   - Current Usage: Likely used in Next.js apps for data fetching
   - Status: No skill found in search
   - Action: Monitor skills.sh for new releases

2. **Turborepo**
   - Current Coverage: Partially covered in monorepo-management
   - Status: May benefit from dedicated Turborepo skill
   - Action: Search for `agent skill turborepo`

3. **Auth/Authentication**
   - Current Coverage: None found
   - Status: Enterprise ERP needs authentication patterns
   - Action: Search for `agent skill nextauth` or `agent skill auth`

4. **API Development**
   - Current Coverage: None found
   - Status: REST/GraphQL API patterns
   - Action: Search for `agent skill api design` or `agent skill openapi`

## References

- **skills.sh**: https://skills.sh/
- **Skill Search Report**: [SKILL-SEARCH-REPORT.md](./SKILL-SEARCH-REPORT.md)
- **Installed Skills**: [.agents/INSTALLED-SKILLS.md](../.agents/INSTALLED-SKILLS.md)
- **Configuration Guide**: [CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md)
