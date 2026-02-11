import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from 'afena-ui/components/badge';
import { Button } from 'afena-ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from 'afena-ui/components/card';
import { Separator } from 'afena-ui/components/separator';
import { ArrowLeft, Building2, Clock, FileText, Mail, Pencil, Phone } from 'lucide-react';

import { getContact } from '@/app/actions/contacts';

import { DeleteContactButton } from '../_components/delete-contact-button';

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
  created_by: string;
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const response = await getContact(id);

  if (!response.ok) {
    notFound();
  }

  const contact = response.data as Contact;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {/* Back link */}
      <Link
        href={`/org/${slug}/contacts`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to contacts
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{contact.name}</h1>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">v{contact.version}</Badge>
            {contact.company && (
              <span className="text-sm text-muted-foreground">{contact.company}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/org/${slug}/contacts/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <DeleteContactButton
            contactId={id}
            contactName={contact.name}
            version={contact.version}
            orgSlug={slug}
          />
        </div>
      </div>

      <Separator className="my-6" />

      {/* Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contact.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-sm hover:underline">
                    {contact.email}
                  </a>
                </div>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <a href={`tel:${contact.phone}`} className="text-sm hover:underline">
                    {contact.phone}
                  </a>
                </div>
              </div>
            )}
            {contact.company && (
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="text-sm">{contact.company}</p>
                </div>
              </div>
            )}
            {!contact.email && !contact.phone && !contact.company && (
              <p className="text-sm text-muted-foreground">No contact details added yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm">
                  {new Date(contact.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Last updated</p>
                <p className="text-sm">
                  {new Date(contact.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Link
                href={`/org/${slug}/contacts/${id}/versions`}
                className="text-sm text-primary hover:underline"
              >
                Version history →
              </Link>
              <Link
                href={`/org/${slug}/contacts/${id}/audit`}
                className="text-sm text-primary hover:underline"
              >
                Audit trail →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {contact.notes && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">{contact.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
