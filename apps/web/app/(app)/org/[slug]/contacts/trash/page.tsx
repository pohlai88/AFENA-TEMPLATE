import { Card, CardContent, CardHeader, CardTitle } from 'afena-ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'afena-ui/components/table';
import { Trash2 } from 'lucide-react';

import { PageHeader } from '../../_components/crud/client/page-header';
import { RestoreContactButton } from '../_components/restore-contact-button';
import { listTrashedContacts } from '../_server/contacts.query_server';

export default async function ContactsTrashPage() {
  const contacts = await listTrashedContacts();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trash"
        description="Soft-deleted contacts that can be restored."
      />

      {/* Empty state */}
      {contacts.length === 0 && (
        <Card>
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
        <Card>
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
