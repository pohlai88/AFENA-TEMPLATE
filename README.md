# Afena Monorepo

A modern monorepo powered by Turborepo, Next.js 16 with Turbopack, and TypeScript.

## 🚀 Features

- **Monorepo Architecture**: Using Turborepo for efficient builds and caching
- **Next.js 16**: With Turbopack for lightning-fast development
- **TypeScript**: Full type safety across the monorepo
- **Shared Packages**: Reusable UI components and configurations
- **Tailwind CSS**: For styling
- **PNPM**: Fast, disk space efficient package manager

## 📁 Structure

```
afena-monorepo/
├── apps/
│   └── web/                 # Next.js 16 application
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── eslint-config/       # Shared ESLint configuration
│   └── typescript-config/   # Shared TypeScript configurations
├── turbo.json              # Turborepo configuration
├── pnpm-workspace.yaml     # PNPM workspace configuration
└── package.json            # Root package.json
```

## 🛠️ Available Scripts

- `pnpm dev` - Start development servers for all apps
- `pnpm build` - Build all apps and packages
- `pnpm lint` - Lint all packages
- `pnpm type-check` - Type check all packages
- `pnpm clean` - Clean all build outputs

## 🏃‍♂️ Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📦 Packages

### afena-ui
Shared UI components built with React and Tailwind CSS.

### afena-eslint-config
Shared ESLint configuration for all packages.

### afena-typescript-config
Shared TypeScript configurations:
- `base.json` - Base TypeScript configuration
- `nextjs.json` - Next.js specific configuration
- `react-library.json` - React library configuration

## 🎯 Development Workflow

1. Make changes to packages or apps
2. Turborepo automatically handles dependencies and caching
3. Use `pnpm build` to verify changes
4. Use `pnpm lint` and `pnpm type-check` to ensure code quality

## 🔧 Turbopack

Next.js 16 includes Turbopack for faster development. The dev script in `apps/web` uses:
```bash
next dev --turbopack
```

## 📝 Adding New Packages

1. Create a new directory in `packages/`
2. Add a `package.json` with the package name prefixed with `afena-`
3. Add to `pnpm-workspace.yaml` if needed
4. Configure TypeScript to extend from `afena-typescript-config`

## 🚀 Deployment

The monorepo is configured for optimal deployment with Vercel. Each app can be deployed independently.

## 📚 Learn More

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PNPM Workspace Documentation](https://pnpm.io/workspaces)
