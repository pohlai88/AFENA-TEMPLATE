# Installed Skills Reference

> **Installation Date:** February 18, 2026 (Updated)  
> **Location:** `C:\AI-BOS\AFENDA-NEXUS\.agents\skills`  
> **Total Skills:** 18 (5 original + 13 newly installed)

## 🎯 Purpose

These skills provide specialized knowledge and best practices for your AFENA-NEXUS monorepo, focusing on Next.js 16, pnpm workspace management, and TypeScript optimization.

---

## ✅ Installed Skills

### 1. **Next.js Best Practices** (Vercel Labs)

- **Source:** `vercel-labs/next-skills@next-best-practices`
- **Installs:** 13,500+
- **Description:** Official Next.js best practices from Vercel Engineering
- **Covers:**
  - File conventions
  - React Server Components (RSC) boundaries
  - Data fetching patterns
  - Async APIs
  - Metadata optimization
  - Error handling
  - Route handlers
  - Image/font optimization
  - Bundle optimization

**Use when:** Building new features, optimizing performance, following Next.js patterns

---

### 2. **Next.js 16 Complete Guide**

- **Source:** `fernandofuc/nextjs-claude-setup@nextjs-16-complete-guide`
- **Installs:** 84
- **Description:** Complete guide to Next.js 16 features and migration
- **Covers:**
  - Next.js 16 breaking changes
  - Migration from v15
  - Turbopack integration
  - Cache Components
  - Latest performance optimizations

**Use when:** Upgrading from Next.js 15, learning Next.js 16 features, troubleshooting version-specific issues

---

### 3. **Monorepo Management**

- **Source:** `wshobson/agents@monorepo-management`
- **Installs:** 2,300+
- **Description:** Master monorepo management with Turborepo, Nx, and pnpm workspaces
- **Covers:**
  - Turborepo configuration
  - Nx integration
  - pnpm workspace management
  - Optimized build pipelines
  - Shared dependency management
  - Cache strategies

**Use when:** Managing your 60+ packages, optimizing builds, configuring Turborepo, handling workspace dependencies

---

### 4. **pnpm**

- **Source:** `onmax/nuxt-skills@pnpm`
- **Installs:** 313
- **Description:** Node.js dependency management with pnpm
- **Covers:**
  - Workspace setup
  - Catalog management
  - CLI commands
  - Dependency overrides
  - CI configuration
  - Performance optimization

**Use when:** Managing dependencies, configuring pnpm-workspace.yaml, troubleshooting pnpm issues, setting up CI/CD

---

### 5. **Optimized Next.js + TypeScript**

- **Source:** `mindrally/skills@optimized-nextjs-typescript`
- **Installs:** 74
- **Description:** Modern Next.js + TypeScript best practices
- **Covers:**
  - TypeScript configuration
  - Type-safe patterns
  - Performance optimization
  - Security best practices
  - Clean architecture
  - Modern UI/UX patterns

**Use when:** Writing TypeScript in Next.js, type-safe component development, architectural decisions

---

### 6. **Zod Validation**

- **Source:** `leonaaardob/lb-zod-skill`
- **Installs:** New (0 stars)
- **Description:** Complete Zod validation library documentation
- **Covers:**
  - Schema validation
  - TypeScript type inference
  - Form validation
  - API validation
  - Error handling
  - Data parsing
  - Refinements and transforms
  - Ecosystem integrations

**Use when:** Building validation schemas, form validation, API request/response validation, type-safe parsing

---

### 7. **Drizzle ORM**

- **Source:** `leonaaardob/lb-drizzle-skill`
- **Installs:** New (0 stars)
- **Description:** Complete Drizzle ORM documentation
- **Covers:**
  - Schema definition
  - Queries and migrations
  - Database connections (PostgreSQL, MySQL, SQLite)
  - Integrations (Neon, Supabase, PlanetScale, Cloudflare D1, Turso)
  - Column types and relations
  - Transactions
  - Framework usage (Next.js, SvelteKit, Astro)

**Use when:** Database schema design, writing queries, migration management, Neon integration, ORM patterns

---

### 8. **Security Suite (ClawSec)** - 8 Skills

- **Source:** `prompt-security/clawsec`
- **Installs:** 435⭐ (Most popular security skill!)
- **Description:** Complete security skill suite for OpenClaw agents
- **Skills Installed:**
  1. **claw-release** - Release security checks
  2. **clawsec-clawhub-checker** - ClawHub security verification
  3. **clawsec-feed** - Security feed monitoring
  4. **clawsec-suite** - Comprehensive security suite
  5. **clawtributor** - Contribution security
  6. **openclaw-audit-watchdog** - Continuous security audits
  7. **prompt-agent** - Prompt security analysis
  8. **soul-guardian** - SOUL.md drift detection

**Covers:**

- Drift detection
- Live security recommendations
- Vulnerability scanning
- Prompt injection detection
- Secrets detection
- Dangerous code pattern detection
- Security best practices

**Use when:** Security audits, reviewing code changes, protecting configuration files, vulnerability detection, security compliance

---

### 9. **Accessibility (a11y)**

- **Source:** `KreerC/ACCESSIBILITY.md`
- **Installs:** 18⭐
- **Description:** Web accessibility by real accessibility experts
- **Covers:**
  - WCAG compliance
  - Accessible component patterns
  - Screen reader optimization
  - Keyboard navigation
  - ARIA attributes
  - Color contrast
  - Semantic HTML
  - Accessibility testing

**Use when:** Building UI components, ensuring WCAG compliance, accessibility audits, enterprise UI requirements

---

### 10. **shadcn/ui Components**

- **Source:** `leonaaardob/lb-shadcn-ui-skill`
- **Installs:** New (0 stars)
- **Description:** Complete shadcn/ui documentation - 50+ components
- **Covers:**
  - Component installation
  - Radix UI primitives
  - Tailwind CSS integration
  - Theming and customization
  - Form components
  - Chart components
  - Framework integrations
  - Copy-paste component patterns

**Use when:** Adding UI components, building forms, creating data tables, theming applications, component customization

---

### 11. **React Hook Form**

- **Source:** `danielmeppiel/form-builder`
- **Installs:** New (0 stars)
- **Description:** Production-ready forms with React Hook Form + Zod validation
- **Covers:**
  - Form setup and configuration
  - React Hook Form patterns
  - Zod schema integration
  - Form validation
  - Error handling
  - Accessible form patterns
  - Performance optimization

**Use when:** Building forms, form validation, combining React Hook Form with Zod, accessible form patterns

---

## 🎓 How to Use These Skills

These skills are now automatically available to GitHub Copilot and other AI coding assistants. They provide:

1. **Context-aware suggestions** - When you ask questions about Next.js, pnpm, or monorepo management
2. **Best practice guidance** - Recommendations based on official patterns and community standards
3. **Code examples** - Real-world implementation patterns
4. **Troubleshooting help** - Solutions to common problems

### Example Queries

Ask me things like:

**Next.js & React:**

- "What's the best way to structure a Server Component in Next.js 16?"
- "Show me the best practice for data fetching in Next.js App Router"
- "What are the breaking changes in Next.js 16?"

**Monorepo & Package Management:**

- "How do I optimize my pnpm workspace for faster installs?"
- "How should I configure Turborepo for my monorepo?"
- "What's the best way to manage shared dependencies?"

**Validation & Forms:**

- "Using the Zod skill, create a validation schema for user registration"
- "Build an accessible form with React Hook Form and Zod validation"
- "How do I handle nested validation with Zod?"

**Database & ORM:**

- "Using Drizzle ORM, create a schema for a multi-tenant database"
- "How do I set up Drizzle with Neon Postgres?"
- "Show me best practices for database migrations with Drizzle"

**UI Components:**

- "Using shadcn/ui, create a data table with sorting and filtering"
- "How do I customize the shadcn/ui theme for my brand?"
- "Show me accessible form components with shadcn/ui"

**Security & Accessibility:**

- "Run a security audit on my codebase using ClawSec"
- "Check my components for accessibility issues"
- "Detect security vulnerabilities in my dependencies"
- "Ensure WCAG 2.2 compliance for my UI"

---

## 📚 Additional Project Skills

Your project also has custom skills in `.agent\skills`:

- `afenda-architecture` - Your specific architecture patterns
- `afena-cli-usage` - CLI tool usage
- `afenda-database-patterns` - Database patterns and conventions
- `ci-cd-pipeline` - CI/CD setup
- `domain-driven-patterns` - DDD patterns
- `lint-types-debug` - Linting and debugging
- `monorepo-testing-strategy` - Testing strategies
- `neon-postgres` - Neon Postgres integration
- `package-development` - Package development guidelines
- `vitest-testing` - Vitest testing patterns

---

## 🔄 Updating Skills

To update all skills to their latest versions:

```bash
npx skills update
```

To check for updates:

```bash
npx skills check
```

---

## 📖 Learn More

- Browse all skills: https://skills.sh/
- Vercel Next.js docs: https://nextjs.org/docs
- pnpm docs: https://pnpm.io/
- Turborepo docs: https://turbo.build/repo/docs

---

**💡 Tip:** These skills work best when you ask specific questions about implementation, architecture, or best practices related to your Next.js 16 monorepo!
