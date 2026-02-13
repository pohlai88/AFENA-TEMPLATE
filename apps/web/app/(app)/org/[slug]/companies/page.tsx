import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from 'afena-ui/components/button';
import { Plus, Trash2 } from 'lucide-react';

import { PageHeader } from '../_components/crud/client/page-header';
import { getOrgContext } from '../_server/org-context_server';

import { listCompanies } from './_server/companies.query_server';

export default async function CompaniesListPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [rows, ctx] = await Promise.all([listCompanies(), getOrgContext(slug)]);
  if (!ctx) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Companies" description="Manage your organization's companies">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/org/${slug}/companies/trash`}><Trash2 className="mr-2 h-4 w-4" />Trash</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/org/${slug}/companies/new`}><Plus className="mr-2 h-4 w-4" />New Company</Link>
        </Button>
      </PageHeader>
      <pre className="text-xs">{JSON.stringify(rows.slice(0, 5), null, 2)}</pre>
    </div>
  );
}
