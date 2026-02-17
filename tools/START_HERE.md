# 🚀 Start Here: AFENDA-NEXUS Tools

<div align="center">

![Monorepo](https://img.shields.io/badge/monorepo-turborepo-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue?style=flat-square)
![Auto-Generated](https://img.shields.io/badge/docs-auto--generated-green?style=flat-square)
![Status](https://img.shields.io/badge/status-production-brightgreen?style=flat-square)

**Your entry point for navigating the AFENDA-NEXUS tools ecosystem**

[Quick Start](#-quick-start) • [Architecture](#-architecture-at-a-glance) •
[Commands](#-essential-commands) • [Documentation](#-documentation-roadmap) •
[FAQ](#-frequently-asked-questions)

</div>

---

## 📋 Table of Contents

- [What Are These Tools?](#-what-are-these-tools)
- [Quick Start](#-quick-start)
- [Architecture at a Glance](#-architecture-at-a-glance)
- [Essential Commands](#-essential-commands)
- [Documentation Roadmap](#-documentation-roadmap)
- [Frequently Asked Questions](#-frequently-asked-questions)
- [Next Steps](#-next-steps)
- [Getting Help](#-getting-help)

---

## 🎯 What Are These Tools?

The `tools/` directory contains **internal development utilities** that power
the AFENDA-NEXUS monorepo. These tools are designed for:

### Core Capabilities

✅ **Metadata Management** - Validate and generate capability documentation\
✅ **Quality Tracking** - Real-time test coverage and build performance metrics\
✅ **Automated Documentation** - Generate consistent README files across all
packages\
✅ **Housekeeping Automation** - Ensure codebase invariants and quality
standards\
✅ **CI/CD Integration** - Seamless integration with GitHub Actions and other
pipelines

### Design Principles

🔧 **Zero External Dependencies** - All tools run locally without external
services\
📊 **Self-Contained Reports** - Generate Markdown, JSON, and HTML reports\
🎨 **Consistent UX** - Unified CLI interface powered by Commander.js\
⚡ **Fast Execution** - Optimized for monorepo scale (38 packages, 175 tables,
83K+ LOC)\
📝 **Auto-Generated Docs** - Documentation stays in sync with code via
`pnpm afenda tools-docs`

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** ≥ 18.0.0
- **pnpm** ≥ 8.0.0
- **Turbo** (installed via pnpm)

### Step 1: Install Dependencies

```bash
# From workspace root
pnpm install
```

### Step 2: Verify Installation

```bash
# Check afenda CLI is available
pnpm afenda --version

# List all available commands
pnpm afenda --help
```

### Step 3: Run Your First Command

```bash
# Generate package READMEs
pnpm afenda readme gen

# Output: ✅ Generated READMEs for 38 packages
```

### Step 4: Explore Quality Metrics

```bash
# Collect current metrics
cd tools/quality-metrics
pnpm run collect

# Analyze trends
pnpm run analyze

# Generate HTML dashboard
pnpm run report
```

### Step 5: Validate Metadata

```bash
# Check metadata quality (VIS-00 to VIS-04)
pnpm afenda meta check

# Generate capability documentation
pnpm afenda meta gen
```

---

## 🏗️ Architecture at a Glance

```
tools/
├── 🔧 afenda-cli/           # Unified CLI tool (20+ commands)
│   ├── bin/afenda.ts        # Entry point
│   ├── src/
│   │   ├── commands/       # CLI command definitions
│   │   ├── core/           # Shared utilities (exec, logger, paths)
│   │   └── features/       # Feature modules (readme, metadata, housekeeping)
│   └── package.json
│
├── 📊 quality-metrics/     # Quality tracking & analysis
│   ├── src/
│   │   ├── collectors/     # Data collectors (coverage, build-times)
│   │   ├── analyzers/      # Trend analysis algorithms
│   │   └── reporters/      # Multi-format output (MD, JSON, HTML)
│   ├── .quality-metrics/   # Generated metrics database
│   └── package.json
│
├── 🛠️ scripts/            # Utility scripts
│   └── validate-deps.ts   # Dependency validator
│
└── 📚 Documentation
    ├── README.md          # Full tools overview
    ├── START_HERE.md      # This file (entry point)
    └── GUIDE.md           # Development guide
```

### Key Components

| Component             | Purpose                        | Technology              |
| --------------------- | ------------------------------ | ----------------------- |
| **afenda-cli**        | Unified command-line interface | Commander.js, Zod       |
| **quality-metrics**   | Metrics collection & analysis  | Vitest, Node.js         |
| **ReportBuilder**     | Consistent report generation   | Markdown templates      |
| **Capability System** | Codebase capability mapping    | AST parsing, validators |

---

## ⚡ Essential Commands

### Bundle Commands (Run Everything)

```bash
# Run all maintenance tasks in sequence
pnpm afenda bundle
```

**Included Tasks**:

1. Generate package READMEs
2. Validate metadata quality
3. Run housekeeping checks
4. Update capability documentation

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

**Generated Files**:

- `.afenda/capability.ledger.json` - Raw capability data
- `.afenda/capability.matrix.md` - Coverage matrix
- `.afenda/codebase.manifest.json` - Package manifest
- `.agents/context/capability-map.md` - AI agent context

### Housekeeping

```bash
# Run all invariant checks
pnpm afenda housekeeping

# Checks performed: E1-E7, H00-H02
```

### Quality Metrics

```bash
# Collect current metrics
cd tools/quality-metrics
pnpm run collect

# Analyze trends (requires historical data)
pnpm run analyze

# Generate HTML dashboard
pnpm run report
```

---

## 📖 Documentation Roadmap

### For Different Personas

#### 👨‍💻 **I'm a Developer (First-Time User)**

1. ✅ **START_HERE.md** (you are here) - Get oriented
2. 📖 [README.md](./README.md) - Understand tool capabilities
3. 🔧 [afenda-cli/README.md](./afenda-cli/README.md) - Learn CLI commands
4. 📊 [GUIDE.md](./GUIDE.md) - Development best practices

#### 🏗️ **I'm Building a New Tool**

1. 📖 [GUIDE.md](./GUIDE.md) - Architecture & patterns
2. 🔧 [afenda-cli/README.md](./afenda-cli/README.md) - CLI integration
3. 📊 [quality-metrics/README.md](./quality-metrics/README.md) - Metrics
   integration
4. 📋 [../CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines

#### 🔍 **I'm a QA Engineer**

1. 📊 [quality-metrics/README.md](./quality-metrics/README.md) - Metrics guide
2. 📖 [README.md](./README.md) - Tool overview
3. 🔧 [afenda-cli/README.md](./afenda-cli/README.md) - Housekeeping commands

#### ⚙️ **I'm a DevOps Engineer**

1. 📖 [README.md](./README.md) - CI/CD integration examples
2. 🔧 [afenda-cli/README.md](./afenda-cli/README.md) - Automation commands
3. 📊 [quality-metrics/README.md](./quality-metrics/README.md) - Metrics in
   CI/CD

### Full Documentation Index

| Document                                                 | Purpose           | Complexity   | Est. Reading Time |
| -------------------------------------------------------- | ----------------- | ------------ | ----------------- |
| **START_HERE.md** ⭐                                     | Quick orientation | Entry-level  | 5 min             |
| [README.md](./README.md)                                 | Complete overview | Intermediate | 15 min            |
| [GUIDE.md](./GUIDE.md)                                   | Development guide | Advanced     | 20 min            |
| [afenda-cli/README.md](./afenda-cli/README.md)           | CLI reference     | Intermediate | 10 min            |
| [quality-metrics/README.md](./quality-metrics/README.md) | Metrics guide     | Intermediate | 12 min            |

---

## ❓ Frequently Asked Questions

### General Questions

**Q: Are these tools required for development?**\
A: No, but they're highly recommended. They ensure code quality and consistent
documentation.

**Q: Can I use these tools outside AFENDA-NEXUS?**\
A: The tools are designed for this monorepo but can be adapted. See
[GUIDE.md](./GUIDE.md) for architecture details.

**Q: How often should I run these tools?**\
A: README generation and metadata checks run automatically in CI. Quality
metrics should be collected after significant changes.

### Command Questions

**Q: What's the difference between `bundle` and running commands
individually?**\
A: `bundle` runs all maintenance tasks in a specific order. Use it for
comprehensive checks; use individual commands for targeted tasks.

**Q: Why is `meta gen` slow?**\
A: It scans the entire codebase (83K+ LOC, 175 tables, 38 packages). This is
normal and runs in ~10-30 seconds.

**Q: Can I customize the generated READMEs?**\
A: READMEs are template-based. Customize templates in
`afenda-cli/src/features/readme/`. See [GUIDE.md](./GUIDE.md).

### Troubleshooting

**Q: `afenda` command not found**\
A: Run `pnpm install` from workspace root to ensure CLI is linked.

**Q: Metrics collection fails**\
A: Ensure Vitest is configured. Check `vitest.config.ts` in workspace root.

**Q: Generated files are empty**\
A: Check console for errors. Most common cause: missing package.json or invalid
metadata.

---

## 🎯 Next Steps

### Recommended Path

```
1️⃣ Run Quick Start commands (above)
   └─> Verify tools work correctly

2️⃣ Read README.md for comprehensive overview
   └─> Understand all tool capabilities

3️⃣ Explore GUIDE.md for development patterns
   └─> Learn best practices and architecture

4️⃣ Check tool-specific READMEs
   └─> Deep dive into afenda-cli and quality-metrics

5️⃣ Integrate tools into your workflow
   └─> Add to pre-commit hooks, CI/CD pipelines
```

### Common Workflows

#### Workflow 1: Daily Development

```bash
# Morning: Check quality status
cd tools/quality-metrics && pnpm run collect

# Throughout day: Validate changes
pnpm afenda meta check

# Before committing: Generate docs
pnpm afenda readme gen
```

#### Workflow 2: Weekly Quality Review

```bash
# Collect full metrics
cd tools/quality-metrics
pnpm run collect
pnpm run analyze
pnpm run report

# Review HTML dashboard
# open .quality-metrics/dashboard.html
```

#### Workflow 3: Release Preparation

```bash
# Run all checks
pnpm afenda bundle

# Generate fresh capability map
pnpm afenda meta gen

# Review quality trends
cd tools/quality-metrics && pnpm run report
```

---

## 💡 Getting Help

### Resources

📚 **Documentation**

- [Tools README](./README.md) - Complete tool reference
- [Development Guide](./GUIDE.md) - Architecture and patterns
- [Project README](../README.md) - Overall project documentation

🐛 **Troubleshooting**

- Check console output for error messages
- Verify `pnpm install` completed successfully
- Review tool-specific READMEs for known issues

🤝 **Contributing**

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [packages/GOVERNANCE.md](../packages/GOVERNANCE.md) - Package standards
- [CODING_STANDARDS.md](../docs/CODING_STANDARDS.md) - Code style guide

### Support Channels

- **Documentation Issues**: Check tool-specific READMEs
- **Bug Reports**: See [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Feature Requests**: Follow contribution guidelines

---

<div align="center">

**📝 Auto-Generated Documentation**

This file is auto-generated via `pnpm afenda tools-docs`. Manual edits will be
overwritten.\
Last updated: Auto-generated on save

---

[⬆ Back to Top](#-start-here-afenda-nexus-tools)

</div>
