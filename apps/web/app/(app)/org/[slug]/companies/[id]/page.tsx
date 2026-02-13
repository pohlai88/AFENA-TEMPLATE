import { notFound } from 'next/navigation';

import { Badge } from 'afena-ui/components/badge';

import { EntityDetailLayout, MetadataCard } from '../../_components/crud/client/entity-detail-layout';
import { PageHeader } from '../../_components/crud/client/page-header';
import { getOrgContext } from '../../_server/org-context_server';
import { readCompany } from '../_server/companies.query_server';

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const [row, ctx] = await Promise.all([readCompany(id), getOrgContext(slug)]);
  if (!row || !ctx) notFound();

  return (
    <EntityDetailLayout
      header={
        <PageHeader title={row.id}>
          <Badge variant="secondary" className="text-xs">v{row.version}</Badge>
        </PageHeader>
      }
      main={<pre className="text-xs">{JSON.stringify(row, null, 2)}</pre>}
      sidebar={<MetadataCard><p className="text-xs text-muted-foreground">Created: {row.created_at}</p></MetadataCard>}
    />
  );
}
