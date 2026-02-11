import { notFound } from 'next/navigation';

import { getContact } from '@/app/actions/contacts';

import { ContactForm } from '../../_components/contact-form';

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  version: number;
}

export default async function EditContactPage({
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
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Contact</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Update contact information.
      </p>
      <div className="mt-6">
        <ContactForm orgSlug={slug} contact={contact} />
      </div>
    </div>
  );
}
