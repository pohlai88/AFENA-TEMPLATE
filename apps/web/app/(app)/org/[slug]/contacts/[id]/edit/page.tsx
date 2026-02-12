import { notFound } from 'next/navigation';

import { PageHeader } from '../../../_components/crud/client/page-header';
import { getOrgContext } from '../../../_server/org-context_server';
import { ContactForm } from '../../_components/contact-form_client';
import { readContact } from '../../_server/contacts.query_server';

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const [contact, ctx] = await Promise.all([
    readContact(id),
    getOrgContext(slug),
  ]);

  if (!contact || !ctx) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Edit Contact"
        description="Update contact information."
      />
      <ContactForm orgSlug={slug} orgId={ctx.org.id} contact={contact} />
    </div>
  );
}
