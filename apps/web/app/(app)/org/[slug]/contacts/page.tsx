import Link from 'next/link';

import { Badge } from 'afena-ui/components/badge';
import { Button } from 'afena-ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from 'afena-ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'afena-ui/components/table';
import { Building2, Mail, Phone, Plus, Trash2 } from 'lucide-react';

import { getContacts } from '@/app/actions/contacts';

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  version: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export default async function ContactsListPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await getContacts({ limit: 50 });

  const contacts: Contact[] = response.ok ? (response.data as Contact[]) : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your organization&apos;s contacts
          </p>
        </div>
        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Error state */}
      {!response.ok && (
        <Card className="mt-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              Failed to load contacts: {response.error?.message ?? 'Unknown error'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {response.ok && contacts.length === 0 && (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-medium">No contacts yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first contact to get started.
            </p>
            <Button className="mt-4" size="sm" asChild>
              <Link href={`/org/${slug}/contacts/new`}>
                <Plus className="mr-2 h-4 w-4" />
                New Contact
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {response.ok && contacts.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">
              {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="w-20 text-right">Version</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id} className="cursor-pointer">
                    <TableCell>
                      <Link
                        href={`/org/${slug}/contacts/${contact.id}`}
                        className="font-medium hover:underline"
                      >
                        {contact.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {contact.email ? (
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          {contact.email}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {contact.phone ? (
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          {contact.phone}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {contact.company ? (
                        <span className="text-sm">{contact.company}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        v{contact.version}
                      </Badge>
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
