# Windsurf Skills

This directory contains workspace-specific skills for Cascade AI assistant.

## What are Skills?

Skills help Cascade handle complex, multi-step tasks by providing detailed instructions and supporting resources. They act as reusable knowledge modules that guide the AI through specific workflows.

## Directory Structure

```
.windsurf/skills/
├── README.md                    # This file
├── <skill-name>/               # Each skill has its own directory
│   ├── SKILL.md                # Required: Main skill definition with YAML frontmatter
│   ├── <supporting-file>.md    # Optional: Additional documentation
│   └── <config-files>          # Optional: Templates, configs, etc.
```

## Creating a New Skill

### Method 1: Using the UI (Recommended)

1. Open the Cascade panel
2. Click the three dots (⋮) in the top right
3. Click on "Skills"
4. Click "+ Workspace" to create a workspace skill
5. Name the skill (lowercase, numbers, hyphens only)

### Method 2: Manual Creation

1. Create a new directory: `.windsurf/skills/<skill-name>/`
2. Add a `SKILL.md` file with YAML frontmatter:

```markdown
---
name: my-skill-name
description: Brief explanation shown to the model to help it decide when to invoke
---

## Skill Content

Detailed instructions, checklists, and procedures go here...

[Reference supporting files in this directory as needed]
```

## Required Frontmatter Fields

- `name`: Unique identifier (used for @-mentions and UI display)
- `description`: Brief explanation that helps Cascade decide when to invoke this skill

## Adding Supporting Resources

You can add supporting files alongside `SKILL.md`:

```
.windsurf/skills/deploy-to-production/
├── SKILL.md
├── deployment-checklist.md
├── rollback-procedure.md
└── config-template.yaml
```

## Invoking Skills

### Automatic Invocation
Cascade automatically invokes skills when it detects a task matching the skill's description.

### Manual Invocation
Use `@<skill-name>` in your chat to explicitly invoke a skill.

Example: `@deploy-to-production` or `@code-review`

## Skill Scopes

- **Workspace Skills** (this directory): Project-specific, stored in `.windsurf/skills/`
- **Global Skills**: User-wide, stored in `~/.codeium/windsurf/skills/`

## Best Practices

1. **Be Specific**: Write clear, step-by-step instructions
2. **Use Checklists**: Break complex tasks into verifiable steps
3. **Reference Resources**: Link to supporting files for detailed information
4. **Keep Updated**: Maintain skills as your workflows evolve
5. **Descriptive Names**: Use clear, action-oriented skill names
6. **Good Descriptions**: Write descriptions that help Cascade understand when to use the skill

## Example Use Cases

- Deployment workflows with safety checks
- Code review guidelines and standards
- Testing procedures and coverage requirements
- Database migration processes
- Security audit checklists
- Onboarding procedures

## Related Documentation

- [Official Windsurf Skills Documentation](https://docs.windsurf.com/windsurf/cascade/skills)
- [Cascade Rules](https://docs.windsurf.com/windsurf/cascade/rules) - For simpler, always-active guidelines
