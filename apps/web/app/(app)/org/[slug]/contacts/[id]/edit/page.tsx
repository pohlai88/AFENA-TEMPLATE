import { notFound } from 'next/navigation';

import { PageHeader } from '../../../_components/crud/client/page-header';
import { ContactForm } from '../../_components/contact-form';
import { readContact } from '../../_server/contacts.query_server';

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const contact = await readContact(id);

  if (!contact) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Edit Contact"
        description="Update contact information."
      />
      <ContactForm orgSlug={slug} contact={contact} />
    </div>
  );
}
