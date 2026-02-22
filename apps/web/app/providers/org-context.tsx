'use client';

import { createContext, useContext } from 'react';

import type { ReactNode } from 'react';

/**
 * Org context — read-only derived values resolved server-side in OrgLayout.
 * orgSlug = router source of truth, orgId = DB source of truth.
 */
export interface OrgContextValue {
  orgSlug: string;
  orgId: string;
  orgName: string;
  userRole: string | null;
}

const OrgContext = createContext<OrgContextValue | null>(null);

export function OrgProvider({
  value,
  children,
}: {
  value: OrgContextValue;
  children: ReactNode;
}) {
  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

/**
 * Access the current org context. Must be used within an OrgProvider.
 * Throws if called outside /org/[slug]/* routes.
 */
export function useOrg(): OrgContextValue {
  const ctx = useContext(OrgContext);
  if (!ctx) {
    throw new Error('useOrg() must be used within an OrgProvider (inside /org/[slug]/* routes)');
  }
  return ctx;
}
