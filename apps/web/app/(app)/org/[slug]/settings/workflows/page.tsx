import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from 'afenda-ui/components/badge';
import { Button } from 'afenda-ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'afenda-ui/components/card';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  FileText,
  GitBranch,
  Plus,
} from 'lucide-react';

import { PageHeader } from '../../_components/crud/client/page-header';
import { getOrgContext } from '../../_server/org-context_server';

import { fetchWorkflowDefinitions, fetchHealthStats } from './_server/workflows.query_server';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'outline',
  published: 'default',
  archived: 'secondary',
};

export default async function WorkflowsSettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [definitions, ctx, health] = await Promise.all([
    fetchWorkflowDefinitions(),
    getOrgContext(slug),
    fetchHealthStats(),
  ]);

  if (!ctx) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflow Definitions"
        description="Manage workflow definitions for your organization's document types"
      >
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/org/${slug}/settings/workflows/health`}>
              <Activity className="mr-2 h-4 w-4" />
              Health
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/org/${slug}/settings/workflows/instances`}>
              <GitBranch className="mr-2 h-4 w-4" />
              Instances
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/org/${slug}/settings/workflows/new`}>
              <Plus className="mr-2 h-4 w-4" />
              New Definition
            </Link>
          </Button>
        </div>
      </PageHeader>

      {/* Health summary cards */}
      {health && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Outbox</CardDescription>
              <CardTitle className="text-2xl">{health.pendingOutbox}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Processing</CardDescription>
              <CardTitle className="text-2xl">{health.processingOutbox}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Failed</CardDescription>
              <CardTitle className="text-2xl text-destructive">{health.failedOutbox}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Stuck Instances</CardDescription>
              <CardTitle className="text-2xl text-orange-500">{health.stuckInstances}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Definitions grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {definitions.map((def) => (
          <Link
            key={`${def.id}-${String(def.version)}`}
            href={`/org/${slug}/settings/workflows/${def.id}`}
            className="block"
          >
            <Card className="transition-colors hover:border-primary/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {def.name}
                  </CardTitle>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={STATUS_VARIANT[def.status] ?? 'outline'}>
                      {def.status}
                    </Badge>
                    {def.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription className="font-mono text-xs">
                  {def.entityType} · v{def.version} · {def.definitionKind}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4 text-xs text-muted-foreground">
                {def.compiledHash ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Compiled
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                    Not compiled
                  </span>
                )}
                <span>
                  Updated {new Date(def.updatedAt).toLocaleDateString()}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}

        {definitions.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No workflow definitions yet. Create your first definition to get started.
          </div>
        )}
      </div>
    </div>
  );
}
