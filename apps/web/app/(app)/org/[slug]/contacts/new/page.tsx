import { ContactForm } from '../_components/contact-form';

export default async function NewContactPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">New Contact</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a new contact to your organization.
      </p>
      <div className="mt-6">
        <ContactForm orgSlug={slug} />
      </div>
    </div>
  );
}
