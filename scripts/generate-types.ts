#!/usr/bin/env tsx

import { execSync } from 'child_process'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const rootDir = process.cwd()
const typesDir = join(rootDir, 'types')

// Ensure types directory exists
if (!existsSync(typesDir)) {
  mkdirSync(typesDir, { recursive: true })
}

// Generate Next.js types
console.log('🔧 Generating Next.js types...')
try {
  execSync('pnpm next build', {
    cwd: join(rootDir, 'apps/web'),
    stdio: 'inherit'
  })

  // Copy generated types
  const nextTypesDir = join(rootDir, 'apps/web/.next/types')
  if (existsSync(nextTypesDir)) {
    execSync(`cp -r ${nextTypesDir}/* ${typesDir}/`, { stdio: 'inherit' })
  }
} catch (error) {
  console.error('❌ Failed to generate Next.js types:', error)
}

// Generate API types from OpenAPI/Swagger
console.log('🔧 Generating API types...')
try {
  // Example: Using openapi-typescript
  execSync('npx openapi-typescript http://localhost:3000/api/swagger-json -o types/api.ts', {
    stdio: 'inherit'
  })
} catch (error) {
  console.log('⚠️ API type generation skipped (no API server running)')
}

// Generate database types (Prisma example)
console.log('🔧 Generating database types...')
try {
  execSync('pnpm prisma generate', {
    cwd: join(rootDir, 'apps/web'),
    stdio: 'inherit'
  })
} catch (error) {
  console.log('⚠️ Database type generation skipped (no Prisma schema)')
}

// Create global type definitions
const globalTypes = `
// Global type definitions
declare global {
  namespace App {
    interface PageProps {
      params?: Record<string, string | string[]>
      searchParams?: Record<string, string | string[]>
    }
    
    interface LayoutProps {
      children: React.ReactNode
      params?: Record<string, string | string[]>
    }
    
    interface RouteContext {
      params?: Record<string, string | string[]>
      searchParams?: Record<string, string | string[]>
    }
  }
}

// Environment variable types
interface EnvVars {
  NODE_ENV: 'development' | 'production' | 'test'
  NEXT_PUBLIC_APP_URL: string
  NEXT_PUBLIC_API_URL: string
  DATABASE_URL?: string
}

declare const process: {
  env: EnvVars & Record<string, string | undefined>
}

// Enhanced Next.js types
declare module 'next' {
  type EnhancedPageProps = App.PageProps & {
    // Add custom page props here
  }
}

// API Route types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface APIError {
  code: string
  message: string
  details?: Record<string, any>
}

// Common component props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export {}

export {}
`

writeFileSync(join(typesDir, 'global.d.ts'), globalTypes)

// Create index file for easy imports
const indexTypes = `
// Generated type definitions
export * from './global'
export * from './api'
export * from './next-types'

// Re-export commonly used types
export type { APIResponse, APIError } from './global'
`

writeFileSync(join(typesDir, 'index.d.ts'), indexTypes)

console.log('✅ Type generation complete!')
console.log('📁 Generated types are available in the /types directory')
