import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from 'afena-ui/components/button';
import { Plus, Trash2 } from 'lucide-react';

import { PageHeader } from '../_components/crud/client/page-header';
import { getOrgContext } from '../_server/org-context_server';

import { ContactsTable } from './_components/contacts-table_client';
import { resolveContactActions } from './_server/contacts.policy_server';
import { listContacts } from './_server/contacts.query_server';

import type { ResolvedActions } from 'afena-canon';

export default async function ContactsListPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [contacts, ctx] = await Promise.all([
    listContacts(),
    getOrgContext(slug),
  ]);

  if (!ctx) notFound();

  const rowActions = new Map<string, ResolvedActions>();
  for (const c of contacts) {
    rowActions.set(
      c.id,
      resolveContactActions(ctx, {
        docStatus: c.doc_status,
        isDeleted: c.is_deleted,
      }),
    );
  }

  const serializedActions = Object.fromEntries(rowActions);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description="Manage your organization's contacts"
      >
        <Button variant="outline" size="sm" asChild>
          <Link href={`/org/${slug}/contacts/trash`}>
            <Trash2 className="mr-2 h-4 w-4" />
            Trash
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/org/${slug}/contacts/new`}>
            <Plus className="mr-2 h-4 w-4" />
            New Contact
          </Link>
        </Button>
      </PageHeader>

      <ContactsTable
        data={contacts}
        orgSlug={slug}
        orgId={ctx.org.id}
        rowActions={serializedActions}
      />
    </div>
  );
}
