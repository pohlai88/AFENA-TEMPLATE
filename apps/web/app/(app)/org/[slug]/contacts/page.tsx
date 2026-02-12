import Link from 'next/link';

import { Button } from 'afena-ui/components/button';
import { Plus, Trash2 } from 'lucide-react';

import { PageHeader } from '../_components/crud/client/page-header';

import { ContactsTable } from './_components/contacts-table_client';
import { listContacts } from './_server/contacts.query_server';

export default async function ContactsListPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const contacts = await listContacts();

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

      <ContactsTable data={contacts} orgSlug={slug} />
    </div>
  );
}
