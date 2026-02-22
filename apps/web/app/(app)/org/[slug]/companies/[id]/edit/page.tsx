import { notFound } from 'next/navigation';

import { PageHeader } from '../../../_components/crud/client/page-header';
import { getOrgContext } from '../../../_server/org-context_server';
import { readCompany } from '../../_server/companies.query_server';

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const [row, ctx] = await Promise.all([readCompany(id), getOrgContext(slug)]);
  if (!row || !ctx) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Edit Company" description="Update company information." />
      <p className="text-sm text-muted-foreground">TODO: Add company form (prefilled)</p>
    </div>
  );
}
