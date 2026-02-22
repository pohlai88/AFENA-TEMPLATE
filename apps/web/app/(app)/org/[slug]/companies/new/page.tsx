import { notFound } from 'next/navigation';

import { PageHeader } from '../../_components/crud/client/page-header';
import { getOrgContext } from '../../_server/org-context_server';

export default async function NewCompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ctx = await getOrgContext(slug);
  if (!ctx) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="New Company" description="Create a new company." />
      <p className="text-sm text-muted-foreground">TODO: Add company form</p>
    </div>
  );
}
