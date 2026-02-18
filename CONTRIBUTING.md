# Contributing Guide

Thank you for contributing to afenda! This guide will help you get started.

## Code of Conduct

Be respectful, constructive, and collaborative.

## Development Setup

### Prerequisites

- **Node.js**: >= 20.x
- **pnpm**: >= 9.x
- **PostgreSQL**: Via Neon (no local install needed)

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-org/afenda-template.git
cd afenda-template

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Configure .env with your Neon database credentials
# (See .env.example for all required variables)

# Run database migrations
pnpm --filter afenda-database db:push

# Build all packages
pnpm build

# Start development server
pnpm dev
```

## Project Structure

```
afenda-monorepo/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   ├── database/         # Database schema and client
│   ├── logger/           # Structured logging
│   ├── observability/    # OpenTelemetry & Sentry
│   ├── ui/               # Shared React components
│   └── ...               # Other shared packages
├── tools/
│   └── afenda-cli/        # CLI tool for metadata generation
└── docs/
    ├── adr/              # Architecture Decision Records
    ├── api/              # API documentation
    ├── TESTING.md        # Testing guide
    └── OBSERVABILITY.md  # Observability guide
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feat/my-feature
# or
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/changes
- `chore/` - Maintenance tasks

### 2. Make Changes

Follow our coding standards:

#### TypeScript

- ✅ Use strict TypeScript (all strict flags enabled)
- ✅ Include JSDoc comments for public APIs
- ✅ Use explicit types over `any`
- ✅ Handle `undefined` properly (`noUncheckedIndexedAccess`)

Example:

```typescript
/**
 * Create a new user in the database
 *
 * @param data - User creation data
 * @returns Created user entity
 * @throws {ValidationError} If user data is invalid
 */
export async function createUser(data: CreateUserInput): Promise<User> {
  // Implementation
}
```

#### Code Style

- **Indentation**: 2 spaces (configured in `.editorconfig`)
- **Line length**: 100 characters max
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Trailing commas**: Always (objects, arrays)

#### Naming Conventions

- **Files**: `kebab-case.ts`
- **Functions**: `camelCase`
- **Classes/Interfaces**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private fields**: `_prefixWithUnderscore`

### 3. Write Tests

All new features require tests:

```bash
# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

#### Test Requirements

- **Unit tests**: For business logic, utilities
- **Integration tests**: For database queries, API endpoints
- **E2E tests**: For critical user flows (Playwright)

**Coverage thresholds**:

- Lines: 80%
- Functions: 80%
- Branches: 75%
- Statements: 80%

Example test:

```typescript
import { describe, expect, it } from 'vitest';
import { createUser } from './user-service';

describe('createUser', () => {
  it('should create a new user', async () => {
    const user = await createUser({
      email: 'test@example.com',
      name: 'Test User',
    });

    expect(user).toMatchObject({
      email: 'test@example.com',
      name: 'Test User',
    });
    expect(user.id).toBeDefined();
  });

  it('should throw on duplicate email', async () => {
    await createUser({ email: 'test@example.com', name: 'User 1' });

    await expect(createUser({ email: 'test@example.com', name: 'User 2' })).rejects.toThrow(
      'Email already exists',
    );
  });
});
```

### 4. Run Quality Checks

Before committing:

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Format
pnpm format

# Run all tests
pnpm test

# Or run everything at once
pnpm type-check && pnpm lint && pnpm test
```

Fix any errors before proceeding.

### 5. Commit Changes

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat(database): add user soft delete functionality"
```

**Commit format**:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples**:

```bash
feat(auth): add password reset functionality
fix(api): correct user query RLS policy
docs(readme): update installation instructions
refactor(database): extract query builders to helpers
test(crud): add integration tests for delete operations
chore(deps): upgrade dependencies
```

### 6. Push and Create PR

```bash
git push origin feat/my-feature
```

Create a Pull Request on GitHub:

1. Go to the repository
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template (auto-populated)
5. Request review from team members

## Pull Request Checklist

Before requesting review, ensure:

- [ ] Code passes all tests (`pnpm test`)
- [ ] Code passes type checking (`pnpm type-check`)
- [ ] Code passes linting (`pnpm lint`)
- [ ] Code follows style guide
- [ ] Coverage threshold met (≥80%)
- [ ] No new linting warnings
- [ ] Architecture docs updated (if applicable)
- [ ] CHANGELOG updated (if user-facing change)
- [ ] README updated (if necessary)
- [ ] Tests added/updated
- [ ] JSDoc comments added for public APIs
- [ ] No sensitive data committed

## Common Tasks

### Adding a New Package

```bash
# Create package directory
mkdir -p packages/my-package/src

# Create package.json
cd packages/my-package
pnpm init

# Add dependencies
pnpm add <dependency>

# Add to workspace
# (Already configured via pnpm-workspace.yaml)

# Create index.ts
touch src/index.ts

# Add build configuration
# (Copy tsconfig.json, tsup.config.ts from another package)

# Build and test
pnpm build
pnpm test
```

### Running Package-Specific Commands

```bash
# Run command in specific package
pnpm --filter afenda-database <command>

# Examples
pnpm --filter afenda-database build
pnpm --filter afenda-database test
pnpm --filter afenda-database type-check
```

### Database Migrations

```bash
# Generate migration from schema changes
pnpm --filter afenda-database db:generate

# Apply migrations
pnpm --filter afenda-database db:push

# Create explicit migration
pnpm --filter afenda-database db:migrate
```

### Updating Dependencies

```bash
# Update all dependencies (interactive)
pnpm update --interactive --recursive

# Update specific dependency
pnpm update <package-name> --filter <workspace>

# Check for outdated dependencies
pnpm outdated
```

## Troubleshooting

### Build Failures

```bash
# Clean build cache
rm -rf .turbo node_modules/.cache

# Rebuild from scratch
pnpm clean
pnpm install
pnpm build
```

### Test Failures

```bash
# Run specific test file
pnpm test path/to/test.test.ts

# Run tests in UI mode for debugging
pnpm test:ui

# Check coverage
pnpm test:coverage
```

### Type Errors

```bash
# Clean TypeScript cache
rm -rf tsconfig.tsbuildinfo

# Run type check with verbose output
pnpm type-check --verbose
```

## Getting Help

- **Documentation**: Check [docs/](./docs/) directory
- **ADRs**: See [docs/adr/](./docs/adr/) for architectural decisions
- **Issues**: Search
  [GitHub Issues](https://github.com/your-org/afenda-template/issues)
- **Discussions**: Ask in
  [GitHub Discussions](https://github.com/your-org/afenda-template/discussions)

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Pnpm Documentation](https://pnpm.io/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Guide](./docs/TESTING.md)
- [Observability Guide](./docs/OBSERVABILITY.md)

---

Thank you for contributing! 🎉
