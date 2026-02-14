'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { NeonAuthUIProvider } from '@neondatabase/auth/react/ui';

import { authClient } from '@/lib/auth/client';

import type { ReactNode } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={(href: string) => router.push(href)}
      replace={(href: string) => router.replace(href)}
      onSessionChange={() => router.refresh()}
      Link={Link}
      redirectTo="/account/settings"
      emailOTP
      social={{
        providers: ['google', 'github'],
      }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
