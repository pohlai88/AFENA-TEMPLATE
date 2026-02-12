import { notFound } from 'next/navigation';

import { PageHeader } from '../../_components/crud/client/page-header';
import { getOrgContext } from '../../_server/org-context_server';
import { ContactForm } from '../_components/contact-form_client';

export default async function NewContactPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ctx = await getOrgContext(slug);
  if (!ctx) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="New Contact"
        description="Add a new contact to your organization."
      />
      <ContactForm orgSlug={slug} orgId={ctx.org.id} />
    </div>
  );
}
