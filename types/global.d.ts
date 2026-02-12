
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

export { }

export { }
