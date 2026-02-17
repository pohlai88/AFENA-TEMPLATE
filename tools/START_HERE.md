# Tools Directory - Entry Point

> **This is the entry point** - All documentation is auto-generated

## 📚 Documentation

All tools documentation is **auto-generated** from constants and code structure.

### Generate Documentation

```bash
# Generate all tools documentation
pnpm afena tools-docs

# This creates:
# - README.md (auto-generated overview)
# - GUIDE.md (auto-generated development guide)
```

### View Documentation

After generation, see:
- **README.md** - Quick start, commands, structure
- **GUIDE.md** - Architecture, best practices, adding commands

## 🚀 Quick Commands

```bash
# Run all maintenance tasks
pnpm bundle

# Preview changes (dry-run)
pnpm bundle:dry

# Generate READMEs
pnpm afena readme gen

# Run housekeeping checks
pnpm afena housekeeping

# Generate tools docs
pnpm afena tools-docs
```

## 📖 Why Auto-Generated?

**Benefits:**
- ✅ Always up-to-date with code
- ✅ No manual maintenance needed
- ✅ Consistent format across all docs
- ✅ Generated from constants (single source of truth)
- ✅ CLI and Markdown formats

**How It Works:**
1. All report structures defined in `src/core/report-config.ts`
2. Documentation templates in `src/docs/tools-docs.ts`
3. Run `pnpm afena tools-docs` to regenerate
4. Never edit README.md or GUIDE.md manually

## 🔧 For Developers

### Adding New Commands

1. Update `src/core/report-config.ts` with command configuration
2. Create command implementation using `ReportBuilder`
3. Register in `src/cli.ts`
4. Regenerate docs: `pnpm afena tools-docs`

### Modifying Documentation

1. Edit templates in `src/docs/tools-docs.ts`
2. Regenerate: `pnpm afena tools-docs`
3. Commit both source and generated files

---

**Next Steps:**
1. Run `pnpm afena tools-docs` to generate full documentation
2. Read README.md for quick start
3. Read GUIDE.md for development guide
