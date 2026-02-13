import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from 'afena-ui/components/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'afena-ui/components/card';
import { GitBranch } from 'lucide-react';

import { PageHeader } from '../../../_components/crud/client/page-header';
import { getOrgContext } from '../../../_server/org-context_server';
import { fetchWorkflowInstances } from '../_server/workflows.query_server';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  running: 'default',
  paused: 'outline',
  completed: 'secondary',
  failed: 'destructive',
  cancelled: 'secondary',
};

export default async function WorkflowInstancesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ entityType?: string; status?: string }>;
}) {
  const { slug } = await params;
  const { entityType, status } = await searchParams;
  const [instances, ctx] = await Promise.all([
    fetchWorkflowInstances(entityType, status),
    getOrgContext(slug),
  ]);

  if (!ctx) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflow Instances"
        description="Active and completed workflow instances across all document types"
      />

      <div className="grid gap-3">
        {instances.map((inst) => (
          <Link
            key={inst.id}
            href={`/org/${slug}/settings/workflows/instances/${inst.id}`}
            className="block"
          >
            <Card className="transition-colors hover:border-primary/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    {inst.entityType}:{inst.entityId.slice(0, 8)}
                  </CardTitle>
                  <Badge variant={STATUS_VARIANT[inst.status] ?? 'outline'}>
                    {inst.status}
                  </Badge>
                </div>
                <CardDescription className="font-mono text-xs">
                  Instance {inst.id.slice(0, 8)} · Def v{inst.definitionVersion} · Entity v{inst.entityVersion}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>
                  Current: {inst.currentNodes.join(', ') || 'none'}
                </span>
                <span>
                  Started {new Date(inst.createdAt).toLocaleDateString()}
                </span>
                {inst.completedAt && (
                  <span>
                    Completed {new Date(inst.completedAt).toLocaleDateString()}
                  </span>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}

        {instances.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No workflow instances found.
          </div>
        )}
      </div>
    </div>
  );
}
