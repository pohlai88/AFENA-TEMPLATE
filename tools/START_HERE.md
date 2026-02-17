# 🚀 Start Here: AFENDA-NEXUS Tools

<div align="center">

![Monorepo](https://img.shields.io/badge/monorepo-turborepo-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue?style=flat-square)
![Status](https://img.shields.io/badge/status-production-brightgreen?style=flat-square)

**Your entry point for navigating the AFENDA-NEXUS tools ecosystem**

</div>

---

## 📋 Table of Contents

- [What Are These Tools?](#-what-are-these-tools)
- [Quick Start](#-quick-start)
- [Architecture Overview](#-architecture-overview)
- [Essential Commands](#-essential-commands)
- [Documentation Guide](#-documentation-guide)
- [Common Workflows](#-common-workflows)
- [Frequently Asked Questions](#-frequently-asked-questions)
- [Getting Help](#-getting-help)

---

## 🎯 What Are These Tools?

The `tools/` directory contains **internal development utilities** that power the AFENDA-NEXUS monorepo.

### Core Capabilities

✅ **Metadata Management** - Validate and generate capability documentation  
✅ **Quality Tracking** - Real-time test coverage and build performance metrics  
✅ **Automated Documentation** - Generate consistent README files across all packages  
✅ **Housekeeping Automation** - Ensure codebase invariants and quality standards  
✅ **CI/CD Integration** - Seamless integration with GitHub Actions and other pipelines

### Design Principles

🔧 **Zero External Dependencies** - All tools run locally without external services  
📊 **Self-Contained Reports** - Generate Markdown, JSON, and HTML reports  
🎨 **Consistent UX** - Unified CLI interface powered by Commander.js  
⚡ **Fast Execution** - Optimized for monorepo scale (38 packages, 175 tables, 83K+ LOC)  
📝 **Documentation First** - Documentation stays in sync with code

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** ≥ 18.0.0
- **pnpm** ≥ 8.0.0
- **Turbo** (installed via pnpm)

### Installation

```bash
# From workspace root
pnpm install

# Verify CLI installation
pnpm afenda --version

# List available commands
pnpm afenda --help
```

### Your First Commands

```bash
# Generate package READMEs
pnpm afenda readme gen

# Validate metadata quality
pnpm afenda meta check

# Run all maintenance tasks
pnpm afenda bundle
```

### Quality Metrics Setup

```bash
# Navigate to quality metrics directory
cd tools/quality-metrics

# Collect current metrics
pnpm run collect

# Analyze historical trends
pnpm run analyze

# Generate HTML dashboard
pnpm run report
```

---

## 🏗️ Architecture Overview

### Directory Structure

```
tools/
├── afena-cli/              # Unified CLI tool (20+ commands)
│   ├── bin/afenda.ts       # Entry point
│   ├── src/
│   │   ├── commands/       # CLI command definitions
│   │   ├── core/           # Shared utilities
│   │   └── features/       # Feature modules
│   └── package.json
│
├── quality-metrics/        # Quality tracking & analysis
│   ├── src/
│   │   ├── collectors/     # Data collectors
│   │   ├── analyzers/      # Trend analysis
│   │   └── reporters/      # Report generation
│   ├── .quality-metrics/   # Generated data
│   └── package.json
│
└── scripts/                # Utility scripts
    └── validate-deps.ts    # Dependency validator
```

### Key Components

| Component             | Purpose                        | Technology              |
| --------------------- | ------------------------------ | ----------------------- |
| **afena-cli**         | Unified command-line interface | Commander.js, Zod       |
| **quality-metrics**   | Metrics collection & analysis  | Vitest, Node.js         |
| **ReportBuilder**     | Consistent report generation   | Markdown templates      |
| **Capability System** | Codebase capability mapping    | AST parsing, validators |

---

## ⚡ Essential Commands

### Bundle Command (Run Everything)

```bash
# Run all maintenance tasks in sequence:
# 1. Generate package READMEs
# 2. Validate metadata quality
# 3. Run housekeeping checks
# 4. Update capability documentation
pnpm afenda bundle
```

### README Generation

```bash
# Generate READMEs for all packages
pnpm afenda readme gen

# Generate with verbose output
pnpm afenda readme gen --verbose
```

### Metadata Management

```bash
# Validate metadata (VIS-00 to VIS-04)
pnpm afenda meta check

# Generate capability documentation
pnpm afenda meta gen
```

**Generated Files:**

- `.afenda/capability.ledger.json` - Raw capability data
- `.afenda/capability.matrix.md` - Coverage matrix
- `.afenda/codebase.manifest.json` - Package manifest
- `.agents/context/capability-map.md` - AI agent context

### Housekeeping

```bash
# Run all invariant checks (E1-E7, H00-H02)
pnpm afenda housekeeping
```

### Quality Metrics

```bash
# From tools/quality-metrics directory
cd tools/quality-metrics

# Collect current metrics
pnpm run collect

# Analyze trends (requires historical data)
pnpm run analyze

# Generate HTML dashboard
pnpm run report
```

---

## 📖 Documentation Guide

### For Different Roles

#### 👨‍💻 Developer (First-Time User)

1. **START_HERE.md** (you are here) - Quick orientation
2. [README.md](README.md) - Complete tool overview
3. [afena-cli/README.md](afena-cli/README.md) - CLI command reference
4. [GUIDE.md](GUIDE.md) - Development best practices

#### 🏗️ Tool Developer

1. [GUIDE.md](GUIDE.md) - Architecture & patterns
2. [afena-cli/README.md](afena-cli/README.md) - CLI integration
3. [quality-metrics/README.md](quality-metrics/README.md) - Metrics integration
4. [../CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines

#### 🔍 QA Engineer

1. [quality-metrics/README.md](quality-metrics/README.md) - Metrics guide
2. [README.md](README.md) - Tool overview
3. [QUALITY-GUIDE.md](QUALITY-GUIDE.md) - Quality gates & security

#### ⚙️ DevOps Engineer

1. [README.md](README.md) - CI/CD integration examples
2. [afena-cli/README.md](afena-cli/README.md) - Automation commands
3. [QUALITY-GUIDE.md](QUALITY-GUIDE.md) - Quality gates configuration

### Documentation Index

| Document                                               | Purpose            | Level        | Time   |
| ------------------------------------------------------ | ------------------ | ------------ | ------ |
| **START_HERE.md** ⭐                                   | Quick orientation  | Entry        | 5 min  |
| [README.md](README.md)                                 | Complete overview  | Intermediate | 15 min |
| [GUIDE.md](GUIDE.md)                                   | Development guide  | Advanced     | 20 min |
| [QUALITY-GUIDE.md](QUALITY-GUIDE.md)                   | Quality & security | Intermediate | 10 min |
| [afena-cli/README.md](afena-cli/README.md)             | CLI reference      | Intermediate | 10 min |
| [quality-metrics/README.md](quality-metrics/README.md) | Metrics guide      | Intermediate | 12 min |

---

## 🔄 Common Workflows

### Daily Development

```bash
# Morning: Check quality status
cd tools/quality-metrics && pnpm run collect

# Throughout day: Validate changes
pnpm afenda meta check

# Before committing: Generate docs
pnpm afenda readme gen
```

### Weekly Quality Review

```bash
# Collect full metrics
cd tools/quality-metrics
pnpm run collect
pnpm run analyze
pnpm run report

# Review HTML dashboard
start .quality-metrics/dashboard.html
```

### Release Preparation

```bash
# Run all checks
pnpm afenda bundle

# Generate fresh capability map
pnpm afenda meta gen

# Review quality trends
cd tools/quality-metrics && pnpm run report
```

### Pre-commit Hook

```bash
# Add to .git/hooks/pre-commit
#!/bin/bash
pnpm test:coverage
pnpm afenda meta check
pnpm afenda readme gen
```

---

## ❓ Frequently Asked Questions

### General

**Q: Are these tools required for development?**  
A: No, but highly recommended. They ensure code quality and consistent documentation.

**Q: Can I use these tools outside AFENDA-NEXUS?**  
A: The tools are designed for this monorepo but can be adapted. See [GUIDE.md](GUIDE.md) for architecture details.

**Q: How often should I run these tools?**  
A: README generation and metadata checks run automatically in CI. Quality metrics should be collected after significant changes.

### Commands

**Q: What's the difference between `bundle` and individual commands?**  
A: `bundle` runs all maintenance tasks in a specific order. Use it for comprehensive checks; use individual commands for targeted tasks.

**Q: Why is `meta gen` slow?**  
A: It scans the entire codebase (83K+ LOC, 175 tables, 38 packages). This is normal and runs in ~10-30 seconds.

**Q: Can I customize generated READMEs?**  
A: Yes. Customize templates in `afena-cli/src/features/readme/`. See [GUIDE.md](GUIDE.md) for details.

### Troubleshooting

**Q: `afenda` command not found**  
A: Run `pnpm install` from workspace root to ensure CLI is linked.

**Q: Metrics collection fails**  
A: Ensure Vitest is configured. Check `vitest.config.ts` in workspace root.

**Q: Generated files are empty**  
A: Check console for errors. Common causes: missing package.json or invalid metadata.

---

## 💡 Getting Help

### Documentation Resources

📚 **Core Documentation**

- [Tools README](README.md) - Complete tool reference
- [Development Guide](GUIDE.md) - Architecture and patterns
- [Quality Guide](QUALITY-GUIDE.md) - Quality gates & security
- [Project README](../README.md) - Overall project documentation

🐛 **Troubleshooting**

- Check console output for error messages
- Verify `pnpm install` completed successfully
- Review tool-specific READMEs for known issues

🤝 **Contributing**

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [packages/GOVERNANCE.md](../packages/GOVERNANCE.md) - Package standards
- [docs/CODING_STANDARDS.md](../docs/CODING_STANDARDS.md) - Code style guide

### Support Channels

- **Documentation Issues**: Check tool-specific READMEs
- **Bug Reports**: See [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Feature Requests**: Follow contribution guidelines

---

## 🎯 Next Steps

### Recommended Learning Path

1. ✅ **Complete Quick Start** - Run the basic commands above
2. 📖 **Read [README.md](README.md)** - Understand all tool capabilities
3. 🔧 **Explore [GUIDE.md](GUIDE.md)** - Learn development patterns
4. 📊 **Review [QUALITY-GUIDE.md](QUALITY-GUIDE.md)** - Set up quality gates
5. 🚀 **Integrate into workflow** - Add to pre-commit hooks and CI/CD

---

<div align="center">

**Last Updated:** February 2026  
**Maintained By:** AFENDA-NEXUS Team

---

_For the most up-to-date information, always refer to the source documentation._

</div>
