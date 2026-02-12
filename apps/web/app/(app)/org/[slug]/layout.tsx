import { notFound } from 'next/navigation';

import { OrgSwitcher } from '@/app/components/org-switcher';
import { OrgProvider } from '@/app/providers/org-context';
import { resolveOrg, listUserOrgs } from '@/lib/org';

import type { OrgListItem } from '@/lib/org';

/**
 * Org-scoped layout — wraps all /org/[slug]/... routes.
 * Resolves org + membership server-side, provides OrgProvider to children.
 */
export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const org = await resolveOrg(slug);
  if (!org) notFound();

  const userOrgs: OrgListItem[] = await listUserOrgs();

  return (
    <OrgProvider value={org}>
      <div className="flex min-h-screen flex-col">
        <header className="flex h-14 items-center gap-4 border-b px-6">
          <OrgSwitcher currentOrg={org} orgs={userOrgs} />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </OrgProvider>
  );
}
