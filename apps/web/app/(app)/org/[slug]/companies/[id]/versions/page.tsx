import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Card, CardContent } from 'afenda-ui/components/card';
import { Separator } from 'afenda-ui/components/separator';
import { ArrowLeft, GitBranch } from 'lucide-react';

import { getCompany, getCompanyVersions } from '@/app/actions/companies';

import { getOrgContext } from '../../../_server/org-context_server';

export default async function CompanyVersionsPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const [entityRes, versionsRes, ctx] = await Promise.all([
    getCompany(id), getCompanyVersions(id), getOrgContext(slug),
  ]);
  if (!entityRes.ok || !ctx) notFound();

  const versions = versionsRes.ok ? (versionsRes.data as Record<string, unknown>[]) : [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Link href={`/org/${slug}/companies/${id}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />Back to detail
      </Link>
      <div className="flex items-center gap-3">
        <GitBranch className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-semibold tracking-tight">Version History</h1>
      </div>
      <Separator className="my-6" />
      {versions.length === 0 && (
        <Card><CardContent className="py-16 text-center"><p className="text-sm text-muted-foreground">No versions recorded.</p></CardContent></Card>
      )}
      {versions.length > 0 && <pre className="text-xs">{JSON.stringify(versions, null, 2)}</pre>}
    </div>
  );
}
