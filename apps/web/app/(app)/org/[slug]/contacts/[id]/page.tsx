import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from 'afena-ui/components/badge';
import { Button } from 'afena-ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from 'afena-ui/components/card';
import { Building2, Clock, FileText, Mail, Pencil, Phone } from 'lucide-react';

import {
  EntityDetailLayout,
  MetadataCard,
} from '../../_components/crud/client/entity-detail-layout';
import { PageHeader } from '../../_components/crud/client/page-header';
import { DeleteContactButton } from '../_components/delete-contact-button';
import { readContact } from '../_server/contacts.query_server';

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const contact = await readContact(id);

  if (!contact) notFound();

  return (
    <EntityDetailLayout
      header={
        <PageHeader title={contact.name}>
          <Badge variant="secondary" className="text-xs">v{contact.version}</Badge>
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
        </PageHeader>
      }
      main={
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
      }
      sidebar={
        <MetadataCard>
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
        </MetadataCard>
      }
      footer={
        contact.notes ? (
          <Card>
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
        ) : undefined
      }
    />
  );
}
