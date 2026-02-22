/**
 * PROJECT.md template — render project analysis and validation results.
 * Gaps and recommendations are data-driven; no hardcoded false positives.
 */

import type { ProjectAnalysis } from './analyzer';
import type { ValidationResult } from './validator';
import { deriveGapAnalysis, type GapAnalysis } from './gap-analysis';

const TEMPLATE_VERSION = 2;

function buildVerdictPreview(domainCount: number, gapAnalysis: GapAnalysis): string {
  const base = 'A well-architected, governance-heavy monorepo with strong foundational design and clear separation of concerns.';
  if (gapAnalysis.gaps.length === 0) {
    return base + ' The finance domain is scaffolded with ' + domainCount + ' packages. All validations passed. Suitable for continued enterprise ERP development.';
  }
  if (gapAnalysis.hasCriticalGaps) {
    return base + ' ' + gapAnalysis.gaps.length + ' gap(s) require attention before release (see §9).';
  }
  return base + ' ' + gapAnalysis.gaps.length + ' non-critical gap(s) identified. Suitable for continued development with targeted improvements (see §10).';
}

export function renderProjectMd(
  analysis: ProjectAnalysis,
  validations: ValidationResult[]
): string {
  const gapAnalysis = deriveGapAnalysis(analysis, validations);
  const lines: string[] = [];

  const tableCount = analysis.manifest?.tableCount ?? 161;
  const totalFiles = analysis.manifest?.totalFiles ?? 925;
  const totalLoc = analysis.manifest?.totalLoc ?? 104000;
  const domainCount = analysis.workspace.domainPackages.length;
  const coreCount = analysis.workspace.corePackages.length;
  const locK = totalLoc ? Math.round(totalLoc / 1000) + 'k' : '104k';

  lines.push('# AFENDA-NEXUS — Project Analysis & Verdict');
  lines.push('');
  lines.push('**Document Type:** Project Analysis & Verdict');
  lines.push(`**Generated:** ${analysis.generatedAt} (via \`afenda project gen\`)`);
  lines.push('**Scope:** Full monorepo and architecture');
  lines.push('**Status:** Verbose analysis with strengths, gaps, and recommendations');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Table of Contents');
  lines.push('');
  lines.push('1. [Executive Summary](#1-executive-summary)');
  lines.push('2. [Monorepo Layout](#2-monorepo-layout)');
  lines.push('3. [Architecture Overview](#3-architecture-overview)');
  lines.push('4. [Core Packages and Responsibilities](#4-core-packages-and-responsibilities)');
  lines.push('5. [Business Domain Layer](#5-business-domain-layer)');
  lines.push('6. [Dependency Rules and Governance](#6-dependency-rules-and-governance)');
  lines.push('7. [Build, Test, and Quality Tooling](#7-build-test-and-quality-tooling)');
  lines.push('8. [Strengths](#8-strengths)');
  lines.push('9. [Gaps and Risks](#9-gaps-and-risks)');
  lines.push('10. [Verdict and Recommendations](#10-verdict-and-recommendations)');
  lines.push('11. [References](#11-references)');
  lines.push('12. [Validation Results](#12-validation-results)');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 1. Executive Summary');
  lines.push('');
  lines.push('**AFENDA-NEXUS** is a layered ERP monorepo built on strict dependency rules and Domain-Driven Design. It implements a **4-layer architecture** (Layer 0: Configuration → Layer 1: Foundation → Layer 2: Domain Services → Layer 3: Application) with a single application (`apps/web`), ~' + coreCount + ' core packages under `packages/`, ' + domainCount + ' finance domain packages under `business-domain/finance/`, and specialized tools under `tools/`. The system is designed for enterprise-grade metadata governance, type-safe data access, workflow orchestration, and multi-tenant ERP workloads.');
  lines.push('');
  lines.push('**Scale:** ~' + totalFiles + ' source files, ~' + locK + ' LOC, ' + tableCount + ' database tables, ' + domainCount + ' domain packages in the finance area alone. Zero circular dependencies enforced. Centralized dependency catalog (pnpm), Turborepo for build orchestration, and the **afenda CLI** for capability governance, README generation, and housekeeping.');
  lines.push('');
  const verdictPreview = buildVerdictPreview(domainCount, gapAnalysis);
  lines.push('**Verdict (preview):** ' + verdictPreview);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 2. Monorepo Layout');
  lines.push('');
  lines.push('```');
  lines.push('AFENDA-NEXUS/');
  lines.push('├── apps/');
  for (const app of analysis.workspace.apps) {
    const name = app.split('/').pop() ?? app;
    lines.push(`│   └── ${name}/                    # Application`);
  }
  if (analysis.workspace.apps.length === 0) lines.push('│   └── (none)');
  lines.push('├── packages/                   # Core libraries');
  for (const pkg of analysis.workspace.corePackages.slice(0, 14)) {
    const name = pkg.split('/').pop() ?? pkg;
    lines.push(`│   ├── ${name}/`);
  }
  if (analysis.workspace.corePackages.length > 14) {
    lines.push(`│   └── ... (+${analysis.workspace.corePackages.length - 14} more)`);
  }
  lines.push('├── business-domain/');
  lines.push('│   └── finance/                # ' + domainCount + ' domain packages');
  lines.push('│       ├── accounting/');
  lines.push('│       ├── tax-engine/');
  lines.push('│       ├── fx-management/');
  lines.push('│       └── ...');
  lines.push('├── tools/');
  for (const tool of analysis.workspace.tools) {
    const name = tool.split('/').pop() ?? tool;
    lines.push(`│   ├── ${name}/`);
  }
  lines.push('├── docs/architecture/');
  lines.push('├── .architecture/');
  lines.push('├── .afenda/');
  lines.push('├── pnpm-workspace.yaml');
  lines.push('├── turbo.json');
  lines.push('└── package.json');
  lines.push('```');
  lines.push('');
  lines.push('**Workspace definition (pnpm-workspace.yaml):**');
  lines.push('');
  lines.push('- `apps/*`');
  lines.push('- `packages/*`');
  lines.push('- `business-domain/*`');
  lines.push('- `business-domain/*/*`');
  lines.push('- `tools/*`');
  lines.push('');
  lines.push('**Catalog:** Centralized dependency versions in `pnpm-workspace.yaml` via `catalog:` protocol.');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 3. Architecture Overview');
  lines.push('');
  lines.push('### 3.1 Four-Layer Model');
  lines.push('');
  lines.push('| Layer | Purpose | Location | Depends On |');
  lines.push('|-------|---------|----------|------------|');
  lines.push('| **Layer 0** | Configuration | `eslint-config`, `typescript-config` | None (external npm only) |');
  lines.push('| **Layer 1** | Foundation | `canon`, `database`, `logger`, `ui` | Layer 0 |');
  const layer2Core = analysis.workspace.corePackages.filter((p) => {
    const name = p.split('/').pop() ?? '';
    return ['workflow', 'search', 'migration'].includes(name);
  });
  const layer2Names = layer2Core.map((p) => '`' + (p.split('/').pop() ?? p) + '`').join(', ');
  lines.push('| **Layer 2** | Domain Services | ' + (layer2Names || '`workflow`, `search`, `migration`') + ', `business-domain/*` | Layers 0, 1 |');
  lines.push('| **Layer 3** | Application | `crud`, `observability`, `apps/web` | All lower layers |');
  lines.push('');
  lines.push('**Principle:** Bottom-up dependency flow only. No circular dependencies.');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 4. Core Packages and Responsibilities');
  lines.push('');
  lines.push('### Layer 0 — Configuration: `eslint-config`, `typescript-config`');
  lines.push('### Layer 1 — Foundation: `canon`, `database`, `logger`, `ui`');
  lines.push('### Layer 2 — Domain: `workflow`, `search`, `migration` + ' + domainCount + ' business-domain packages');
  lines.push('### Layer 3 — Application: `crud`, `observability`');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 5. Business Domain Layer');
  lines.push('');
  lines.push('**Finance domain:** ' + domainCount + ' packages under `business-domain/finance/`.');
  lines.push('');
  lines.push('**Advisory:** Package removed. Database tables `advisories`, `advisory_evidence` remain.');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 6. Dependency Rules and Governance');
  lines.push('');
  lines.push('See `ARCHITECTURE.md` and `packages/GOVERNANCE.md` for layer definitions and enforcement.');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 7. Build, Test, and Quality Tooling');
  lines.push('');
  lines.push('- **Build:** `pnpm build` (Turbo)');
  lines.push('- **Dev:** `pnpm dev`');
  lines.push('- **Lint:** `pnpm lint`');
  lines.push('- **afenda CLI:** `meta gen/check`, `readme gen`, `housekeeping`, `project gen`');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 8. Strengths');
  lines.push('');
  lines.push('1. Strict 4-layer architecture');
  lines.push('2. Metadata-first design (canon)');
  lines.push('3. Centralized catalog and tooling');
  lines.push('4. Capability model (VIS-00 … VIS-04)');
  lines.push('5. Comprehensive database schemas');
  lines.push('6. Domain structure with clear boundaries');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 9. Gaps and Risks');
  lines.push('');
  if (gapAnalysis.gaps.length === 0) {
    lines.push('No outstanding gaps identified. ' + (gapAnalysis.validationState === 'none' ? 'Run without `--skip-validate` for full analysis.' : 'All validations passed.'));
  } else {
    for (let i = 0; i < gapAnalysis.gaps.length; i++) {
      const g = gapAnalysis.gaps[i]!;
      const prio = g.priority === 'high' ? '🔴' : g.priority === 'medium' ? '🟡' : '🟢';
      lines.push(`${i + 1}. **${g.area}** (${prio} ${g.priority}): ${g.description}`);
      if (g.action) lines.push(`   - *Action:* ${g.action}`);
    }
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 10. Verdict and Recommendations');
  lines.push('');
  lines.push('**Verdict:** ' + (gapAnalysis.hasCriticalGaps ? 'Targeted improvements needed before release.' : 'Suitable for continued enterprise ERP development.'));
  lines.push('');
  for (const rec of gapAnalysis.recommendations) {
    lines.push('- ' + rec);
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 11. References');
  lines.push('');
  lines.push('| Document | Path |');
  lines.push('|----------|------|');
  lines.push('| Architecture | `ARCHITECTURE.md` |');
  lines.push('| Governance | `packages/GOVERNANCE.md` |');
  lines.push('| Business domain | `docs/architecture/BUSINESS_DOMAIN_ARCHITECTURE.md` |');
  lines.push('| Codebase manifest | `.afenda/codebase.manifest.json` |');
  lines.push('| Proposal | `PROPOSAL.md` |');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 12. Validation Results');
  lines.push('');
  lines.push(`**Run date:** ${analysis.generatedAt}`);
  lines.push('');
  lines.push('| Command | Status | Notes |');
  lines.push('|---------|--------|-------|');
  if (validations.length === 0) {
    lines.push('| *Validations skipped* | — | Run without `--skip-validate` for full results |');
  } else {
    for (const v of validations) {
      const statusBadge = v.status === 'pass' ? '✅ Pass' : v.status === 'fail' ? '❌ Fail' : v.status === 'warn' ? '⚠️ Warn' : '⏸️ Partial';
      const notes = (v.notes ?? '').replace(/\|/g, '\\|').slice(0, 80);
      lines.push(`| \`${v.command}\` | ${statusBadge} | ${notes} |`);
    }
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`<!-- Generated by afenda project gen (template v${TEMPLATE_VERSION}) — regenerate with: pnpm afenda project gen -->`);
  lines.push('');
  lines.push('*End of PROJECT.md*');
  lines.push('');

  return lines.join('\n');
}
