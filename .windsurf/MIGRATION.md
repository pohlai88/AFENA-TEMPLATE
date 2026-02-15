# Migration to Windsurf Skills

This document explains the migration from `.cursor` and `.agent` directories to the unified `.windsurf/skills` structure.

## What Was Migrated

### From `.cursor/skills/` → `.windsurf/skills/`

**lint-types-debug** skill migrated with all supporting files:
- `SKILL.md` - Main skill definition
- `reference.md` - Detailed error patterns and code examples
- `COMPLIANCE-REPORT.md` - Compliance tracking document

### From `.agent/reference/` → `.windsurf/skills/`

**neon-postgres** skill migrated with 28 supporting reference documents:
- `SKILL.md` - Main skill definition
- `references/` directory with comprehensive Neon documentation:
  - Core guides (what-is-neon, getting-started, features, connection-methods, devtools)
  - Database drivers (neon-serverless, neon-drizzle)
  - Auth & Data API (neon-auth, neon-js with subdirectories)
  - Platform API (neon-platform-api, neon-cli, SDKs)
  - REST API (branches, endpoints, operations, etc.)

## Directory Structure

```
.windsurf/skills/
├── README.md                    # Complete skills system guide
├── INDEX.md                     # Quick reference to all skills
├── SKILL-TEMPLATE.md            # Template for new skills
├── MIGRATION.md                 # This file
│
├── lint-types-debug/            # ESLint & TypeScript debugging
│   ├── SKILL.md
│   ├── reference.md
│   └── COMPLIANCE-REPORT.md
│
├── neon-postgres/               # Neon Postgres reference
│   ├── SKILL.md
│   └── references/              # 28 reference documents
│       ├── *.md                 # Core guides
│       ├── neon-auth/           # Auth-specific docs
│       ├── neon-js/             # Data API docs
│       └── neon-rest-api/       # REST API docs
│
└── example-deployment/          # Example deployment workflow
    ├── SKILL.md
    ├── deployment-checklist.md
    └── rollback-procedure.md
```

## Why Migrate?

1. **Unified Structure** - All skills in one location following Windsurf conventions
2. **Better Discovery** - Windsurf UI automatically detects skills in `.windsurf/skills/`
3. **Consistent Format** - All skills follow the same YAML frontmatter + markdown structure
4. **Team Collaboration** - Workspace skills are version-controlled and shared with team
5. **Official Support** - Follows official Windsurf documentation patterns

## Original Directories

The original directories are **preserved** and can be safely removed after verifying the migration:

- `.cursor/skills/lint-types-debug/` - Original Cursor skill (can be deleted)
- `.agent/reference/neon-postgres/` - Original agent reference (can be deleted)
- `.agent/context/` - Keep this for capability-map.md and other context files

## Using Migrated Skills

### Automatic Invocation
Cascade automatically invokes skills based on task context:
- Lint/type errors → `@lint-types-debug` is invoked
- Neon questions → `@neon-postgres` is invoked

### Manual Invocation
Explicitly invoke skills using `@skill-name`:

```
@lint-types-debug Fix the exactOptionalPropertyTypes error in read.ts
```

```
@neon-postgres How do I configure Neon Auth for Next.js?
```

```
@example-deployment Deploy to production with safety checks
```

## Verification

To verify the migration was successful:

1. **Check Windsurf UI**:
   - Open Cascade panel
   - Click ⋮ (three dots) → Skills
   - You should see: lint-types-debug, neon-postgres, example-deployment

2. **Test Invocation**:
   ```
   @lint-types-debug help
   ```
   Should load the skill and provide lint/type debugging guidance

3. **Check Files**:
   ```powershell
   # List all skills
   Get-ChildItem .windsurf\skills -Directory
   
   # Verify neon-postgres references
   Get-ChildItem .windsurf\skills\neon-postgres\references -Recurse
   ```

## Next Steps

1. **Test the migrated skills** to ensure they work correctly
2. **Update team documentation** to reference `.windsurf/skills/` instead of old locations
3. **Create new skills** using the template and examples as guides
4. **Remove old directories** after confirming everything works:
   ```powershell
   # After verification, optionally remove old directories
   Remove-Item .cursor\skills\lint-types-debug -Recurse
   Remove-Item .agent\reference\neon-postgres -Recurse
   ```

## Creating New Skills

Use the provided template:

```powershell
# Copy template to new skill directory
Copy-Item .windsurf\skills\SKILL-TEMPLATE.md .windsurf\skills\my-new-skill\SKILL.md

# Edit the SKILL.md file
# Update INDEX.md to include your new skill
```

See [README.md](./skills/README.md) for detailed instructions.

## Troubleshooting

### Skill Not Appearing in UI
- Restart Windsurf
- Ensure `SKILL.md` has valid YAML frontmatter
- Check that skill name uses lowercase, numbers, and hyphens only

### Skill Not Being Invoked
- Check the `description` field in frontmatter - it should clearly describe when to use the skill
- Try manual invocation with `@skill-name` to test

### Supporting Files Not Loading
- Ensure relative paths in `SKILL.md` are correct
- Supporting files should be in the same directory as `SKILL.md`

## References

- [Windsurf Skills Documentation](https://docs.windsurf.com/windsurf/cascade/skills)
- [Skills README](./skills/README.md)
- [Skills Index](./skills/INDEX.md)
