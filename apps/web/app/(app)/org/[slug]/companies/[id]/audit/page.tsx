import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Card, CardContent } from 'afenda-ui/components/card';
import { Separator } from 'afenda-ui/components/separator';
import { ArrowLeft, FileText } from 'lucide-react';

import { getCompany, getCompanyAuditLogs } from '@/app/actions/companies';

export default async function CompanyAuditPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const [entityRes, auditRes] = await Promise.all([getCompany(id), getCompanyAuditLogs(id)]);
  if (!entityRes.ok) notFound();

  const logs = auditRes.ok ? (auditRes.data as Record<string, unknown>[]) : [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Link href={`/org/${slug}/companies/${id}`} className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />Back to detail
      </Link>
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-semibold tracking-tight">Audit Trail</h1>
      </div>
      <Separator className="my-6" />
      {logs.length === 0 && (
        <Card><CardContent className="py-16 text-center"><p className="text-sm text-muted-foreground">No audit entries.</p></CardContent></Card>
      )}
      {logs.length > 0 && <pre className="text-xs">{JSON.stringify(logs, null, 2)}</pre>}
    </div>
  );
}
