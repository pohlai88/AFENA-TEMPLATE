# Skills Search Summary

## Quick Reference Table

| Technology          | Skill Found | Source                           | Stars   | Status                 | Priority  |
| ------------------- | ----------- | -------------------------------- | ------- | ---------------------- | --------- |
| **Zod**             | ✅ Yes      | `leonaaardob/lb-zod-skill`       | 0 (new) | Ready                  | 🔴 High   |
| **Drizzle ORM**     | ✅ Yes      | `leonaaardob/lb-drizzle-skill`   | 0 (new) | Ready                  | 🔴 High   |
| **React Hook Form** | ✅ Yes      | `danielmeppiel/form-builder`     | 0       | Ready                  | 🟡 Medium |
| **TanStack Table**  | ❌ No       | —                                | —       | Create Custom          | 🟡 Medium |
| **shadcn/ui**       | ✅ Yes      | `leonaaardob/lb-shadcn-ui-skill` | 0 (new) | Ready                  | 🟡 Medium |
| **tsup**            | ❌ No       | —                                | —       | Covered in package-dev | 🟢 Low    |
| **Security/Audit**  | ✅ Yes      | `prompt-security/clawsec`        | 435 ⭐  | Ready                  | 🔴 High   |
| **Accessibility**   | ✅ Yes      | `KreerC/ACCESSIBILITY.md`        | 18 ⭐   | Ready                  | 🔴 High   |
| **React v19**       | ⚠️ Partial  | Covered in Next.js skills        | —       | Already Covered        | 🟢 Low    |

**Legend:**

- 🔴 High Priority = Install immediately
- 🟡 Medium Priority = Install after high priority
- 🟢 Low Priority = Already covered or optional

## One-Line Install

```bash
npx skills add leonaaardob/lb-zod-skill leonaaardob/lb-drizzle-skill prompt-security/clawsec KreerC/ACCESSIBILITY.md leonaaardob/lb-shadcn-ui-skill danielmeppiel/form-builder
```

## Technology Coverage Map

### Database & ORM

- ✅ **Drizzle ORM**: `lb-drizzle-skill` (schema, queries, migrations)
- ✅ **Neon Postgres**: Already installed (`.agents/skills/neon-postgres`)

### Validation & Forms

- ✅ **Zod**: `lb-zod-skill` (schema validation, type inference)
- ✅ **React Hook Form**: `form-builder` (forms + Zod integration)

### UI & Components

- ✅ **shadcn/ui**: `lb-shadcn-ui-skill` (50+ components, Radix UI + Tailwind)
- ❌ **TanStack Table**: No skill found (needs custom skill)
- ✅ **Next.js**: Already installed (`next-best-practices`, `nextjs-16-complete-guide`)
- ✅ **React**: Covered in Next.js skills

### Build & Tooling

- ❌ **tsup**: No dedicated skill (covered in `package-development`)
- ✅ **Vitest**: Already installed (`.agents/skills/vitest-testing`)
- ✅ **ESLint**: Already installed (`.agents/skills/lint-types-debug`)
- ✅ **TypeScript**: Already installed (`.agents/skills/typescript-advanced-types`)
- ✅ **pnpm**: Already installed (`pnpm` skill)
- ✅ **Turborepo**: Covered in `monorepo-management`

### Quality & Standards

- ✅ **Security/Audit**: `clawsec` (drift detection, vulnerability scanning)
- ✅ **Accessibility**: `ACCESSIBILITY.md` (WCAG compliance, a11y patterns)

## Found vs Missing Skills

### ✅ Found (6 skills)

1. Zod validation
2. Drizzle ORM
3. React Hook Form (+ Zod)
4. shadcn/ui components
5. Security/Audit (multiple options)
6. Accessibility (a11y)

### ❌ Missing (2 skills)

1. TanStack Table / React Table
2. tsup bundling

### ⚠️ Already Covered (1 skill)

1. React v19 (in Next.js skills)

## Skill Author: leonaaardob

High-quality MDX documentation skills created by `leonaaardob`:

| Skill       | Repository           | Description                                             |
| ----------- | -------------------- | ------------------------------------------------------- |
| Zod         | `lb-zod-skill`       | Complete Zod validation library docs                    |
| Drizzle ORM | `lb-drizzle-skill`   | Complete Drizzle ORM docs (schema, queries, migrations) |
| shadcn/ui   | `lb-shadcn-ui-skill` | 50+ copy-paste components with Radix UI + Tailwind      |

All updated **10 days ago** (January 2025) - very recent and fresh!

## Installation Priority Order

### Phase 1: Critical Foundation (Install Now)

```bash
npx skills add leonaaardob/lb-zod-skill           # 1. Zod - used everywhere
npx skills add leonaaardob/lb-drizzle-skill       # 2. Drizzle - database layer
npx skills add prompt-security/clawsec            # 3. Security - enterprise requirement
npx skills add KreerC/ACCESSIBILITY.md            # 4. A11y - enterprise compliance
```

### Phase 2: UI & Forms (Install After Phase 1)

```bash
npx skills add leonaaardob/lb-shadcn-ui-skill     # 5. shadcn/ui - component library
npx skills add danielmeppiel/form-builder         # 6. React Hook Form - form patterns
```

### Phase 3: Optional (Consider Later)

- Create custom TanStack Table skill (when needed)
- Document tsup patterns in package-development (already partially covered)

## Skills Already Installed

From `.agents/INSTALLED-SKILLS.md`:

| Category        | Skill                       | Source                            | Installs |
| --------------- | --------------------------- | --------------------------------- | -------- |
| Monorepo        | monorepo-management         | `wshobson/agents`                 | 3.9K     |
| Package Manager | pnpm                        | `onmax/nuxt-skills`               | 1.7K     |
| Next.js         | next-best-practices         | `vercel-labs/next-skills`         | 6.1K     |
| Next.js         | nextjs-16-complete-guide    | `fernandofuc/nextjs-claude-setup` | 1.4K     |
| Next.js         | optimized-nextjs-typescript | `mindrally/skills`                | 210      |
| Linting         | lint-types-debug            | Custom (.agents/skills)           | —        |
| Testing         | vitest-testing              | Custom (.agents/skills)           | —        |
| Database        | neon-postgres               | Custom (.agents/skills)           | —        |
| TypeScript      | typescript-advanced-types   | Custom (.agents/skills)           | —        |
| Development     | package-development         | Custom (.agents/skills)           | —        |

**Total**: 5 from skills.sh + 5+ custom = 10+ skills already installed

## Security Skill Options Comparison

| Skill                            | Stars  | Updated     | Focus                                | Recommendation        |
| -------------------------------- | ------ | ----------- | ------------------------------------ | --------------------- |
| **clawsec**                      | 435 ⭐ | 7 hrs ago   | Comprehensive suite, drift detection | ✅ **Primary Choice** |
| skill-audit                      | 43 ⭐  | Jan 10      | CLI tool, pattern detection          | Alternative           |
| netresearch/security-audit-skill | 2      | 2 days ago  | PHP/OWASP patterns                   | PHP-specific          |
| supabase-pentest-skills          | 29 ⭐  | 17 days ago | Supabase security                    | Supabase-specific     |

**Verdict**: `prompt-security/clawsec` with 435 stars is the clear winner!

## Accessibility Skill Options

| Skill                | Stars | Updated    | Focus                            | Recommendation         |
| -------------------- | ----- | ---------- | -------------------------------- | ---------------------- |
| **ACCESSIBILITY.md** | 18 ⭐ | 8 days ago | Real a11y experts, web standards | ✅ **Primary Choice**  |
| wcag-aaa-web-design  | 2     | 2 days ago | WCAG 2.2 AAA, design system      | Enterprise alternative |

**Verdict**: `KreerC/ACCESSIBILITY.md` is community-recommended.

## Next Actions

- [ ] Install Phase 1 skills (critical foundation)
- [ ] Install Phase 2 skills (UI & forms)
- [ ] Update `.agents/INSTALLED-SKILLS.md`
- [ ] Test skills with GitHub Copilot
- [ ] Create custom TanStack Table skill (if needed)
- [ ] Update package READMEs with skill references
- [ ] Add skill usage examples to CONFIGURATION_GUIDE.md

## References

- 📄 [Full Search Report](./SKILL-SEARCH-REPORT.md) - Detailed findings and analysis
- 📦 [Installation Guide](./SKILL-INSTALLATION-GUIDE.md) - Step-by-step installation
- 🏠 [skills.sh Website](https://skills.sh/) - Browse all available skills
- 📚 [Configuration Guide](./CONFIGURATION_GUIDE.md) - Monorepo configuration standards
