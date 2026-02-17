import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from 'afenda-ui/components/button';
import { Plus, Trash2 } from 'lucide-react';

import { PageHeader } from '../_components/crud/client/page-header';
import { getOrgContext } from '../_server/org-context_server';

import { ContactsTable } from './_components/contacts-table_client';
import { resolveContactListActions } from './_server/contacts.policy_server';
import { listContacts } from './_server/contacts.query_server';

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

  const rowActions = resolveContactListActions(ctx, contacts);

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
        rowActions={rowActions}
      />
    </div>
  );
}
