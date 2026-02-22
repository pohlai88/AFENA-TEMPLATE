import { notFound } from 'next/navigation';

import { SidebarInset, SidebarProvider } from 'afenda-ui/components/sidebar';

import { OrgProvider } from '@/app/providers/org-context';
import { listUserOrgs } from '@/lib/org';

import { AppHeader } from './_components/app-header_client';
import { AppSidebar } from './_components/app-sidebar_client';
import { getOrgContext } from './_server/org-context_server';

/**
 * Org-scoped layout — enterprise app shell.
 * Server-only: no pathname logic, only composes shell.
 */
export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const ctx = await getOrgContext(slug);
  if (!ctx) notFound();

  const userOrgs = await listUserOrgs();

  // Bridge to existing OrgProvider for backward compat
  const orgContextValue = {
    orgSlug: ctx.org.slug,
    orgId: ctx.org.id,
    orgName: ctx.org.name,
    userRole: ctx.actor.orgRole,
  };

  return (
    <OrgProvider value={orgContextValue}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring"
      >
        Skip navigation
      </a>
      <SidebarProvider>
        <AppSidebar currentOrg={orgContextValue} orgs={userOrgs} />
        <SidebarInset>
          <AppHeader />
          <main id="main-content" className="flex-1 p-4">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </OrgProvider>
  );
}
