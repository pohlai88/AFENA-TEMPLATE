import { notFound } from 'next/navigation';

import { Card, CardContent } from 'afenda-ui/components/card';
import { Trash2 } from 'lucide-react';

import { PageHeader } from '../../_components/crud/client/page-header';
import { getOrgContext } from '../../_server/org-context_server';
import { listTrashedCompanies } from '../_server/companies.query_server';

export default async function CompaniesTrashPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [rows, ctx] = await Promise.all([listTrashedCompanies(), getOrgContext(slug)]);
  if (!ctx) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Trash" description="Soft-deleted companies that can be restored." />
      {rows.length === 0 && (
        <Card><CardContent className="flex flex-col items-center justify-center py-16">
          <Trash2 className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-medium">Trash is empty</h3>
        </CardContent></Card>
      )}
      {rows.length > 0 && <pre className="text-xs">{JSON.stringify(rows, null, 2)}</pre>}
    </div>
  );
}
