import { PageHeader } from '../../_components/crud/client/page-header';
import { ContactForm } from '../_components/contact-form_client';

export default async function NewContactPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="New Contact"
        description="Add a new contact to your organization."
      />
      <ContactForm orgSlug={slug} />
    </div>
  );
}
