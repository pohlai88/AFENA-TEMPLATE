import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from 'afena-ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'afena-ui/components/table';
import { ArrowLeft, Trash2 } from 'lucide-react';

import { getDeletedContacts } from '@/app/actions/contacts';

import { RestoreContactButton } from '../_components/restore-contact-button';

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  version: number;
  deleted_at: string | null;
}

export default async function ContactsTrashPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await getDeletedContacts({ limit: 50 });

  const contacts: Contact[] = response.ok
    ? ((response.data as Contact[]).filter((c) => c.deleted_at !== null))
    : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <Link
        href={`/org/${slug}/contacts`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to contacts
      </Link>

      <div className="flex items-center gap-3">
        <Trash2 className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trash</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Soft-deleted contacts that can be restored.
          </p>
        </div>
      </div>

      {/* Empty state */}
      {contacts.length === 0 && (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Trash2 className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-medium">Trash is empty</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Deleted contacts will appear here.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {contacts.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">
              {contacts.length} deleted contact{contacts.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Deleted</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <span className="font-medium text-muted-foreground line-through">
                        {contact.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {contact.email ?? '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {contact.company ?? '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {contact.deleted_at && (
                        <span className="text-sm text-muted-foreground">
                          {new Date(contact.deleted_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <RestoreContactButton
                        contactId={contact.id}
                        contactName={contact.name}
                        version={contact.version}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
