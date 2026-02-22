import { AuthProvider } from '../auth-provider';
import { CommandPalette } from '../command-palette';
import { QueryProvider } from '../query-provider';

import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <QueryProvider>
        {children}
        <CommandPalette />
      </QueryProvider>
    </AuthProvider>
  );
}
