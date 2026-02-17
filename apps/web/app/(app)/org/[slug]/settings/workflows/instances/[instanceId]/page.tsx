import { notFound } from 'next/navigation';

import { Badge } from 'afenda-ui/components/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'afenda-ui/components/card';
import { CheckCircle2, Circle, Clock, GitBranch, Loader2, XCircle } from 'lucide-react';

import { PageHeader } from '@/app/(app)/org/[slug]/_components/crud/client/page-header';
import { getOrgContext } from '@/app/(app)/org/[slug]/_server/org-context_server';
import {
  fetchWorkflowInstance,
  fetchWorkflowSteps,
} from '@/app/(app)/org/[slug]/settings/workflows/_server/workflows.query_server';

const STATUS_ICON: Record<string, typeof CheckCircle2> = {
  completed: CheckCircle2,
  running: Loader2,
  pending: Clock,
  failed: XCircle,
  skipped: Circle,
  cancelled: XCircle,
};

const STATUS_COLOR: Record<string, string> = {
  completed: 'text-green-500',
  running: 'text-blue-500',
  pending: 'text-yellow-500',
  failed: 'text-destructive',
  skipped: 'text-muted-foreground',
  cancelled: 'text-muted-foreground',
};

export default async function WorkflowInstanceDetailPage({
  params,
}: {
  params: Promise<{ slug: string; instanceId: string }>;
}) {
  const { slug, instanceId } = await params;
  const [instance, steps, ctx] = await Promise.all([
    fetchWorkflowInstance(instanceId),
    fetchWorkflowSteps(instanceId),
    getOrgContext(slug),
  ]);

  if (!ctx || !instance) notFound();

  const inst = instance as Record<string, unknown>;
  const instanceStatus = inst['status'] as string;
  const entityType = (inst['entity_type'] as string) ?? (inst['entityType'] as string) ?? '';
  const entityId = (inst['entity_id'] as string) ?? (inst['entityId'] as string) ?? '';
  const currentNodes =
    (inst['current_nodes'] as string[]) ?? (inst['currentNodes'] as string[]) ?? [];
  const entityVersion =
    (inst['entity_version'] as number) ?? (inst['entityVersion'] as number) ?? 0;
  const createdAt = (inst['created_at'] as string) ?? (inst['createdAt'] as string) ?? '';
  const completedAt = (inst['completed_at'] as string) ?? (inst['completedAt'] as string) ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Instance ${instanceId.slice(0, 8)}`}
        description={`${entityType}:${entityId.slice(0, 8)} · Entity v${String(entityVersion)}`}
      >
        <Badge
          variant={
            instanceStatus === 'completed'
              ? 'secondary'
              : instanceStatus === 'failed'
                ? 'destructive'
                : 'default'
          }
        >
          {instanceStatus}
        </Badge>
      </PageHeader>

      {/* Instance summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Nodes</CardDescription>
            <CardTitle className="font-mono text-sm">
              {currentNodes.length > 0 ? currentNodes.join(', ') : 'none'}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Started</CardDescription>
            <CardTitle className="text-sm">
              {createdAt ? new Date(createdAt).toLocaleString() : 'N/A'}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-sm">
              {completedAt ? new Date(completedAt).toLocaleString() : 'In progress'}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Step execution timeline */}
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">Step Execution Timeline</h3>
        <div className="space-y-2">
          {(steps as Record<string, unknown>[]).map((step, idx) => {
            const stepStatus = (step['status'] as string) ?? '';
            const stepTokenId = (step['token_id'] as string) ?? (step['tokenId'] as string) ?? '';
            const stepEntityVer = Number(step['entity_version'] ?? step['entityVersion'] ?? 0);
            const stepDurationMs = step['duration_ms'] != null ? Number(step['duration_ms']) : null;
            const stepCreatedAt = (step['created_at'] as string) ?? '';
            const stepError = (step['error'] as string) ?? '';
            const stepEdges = (step['chosen_edge_ids'] as string[]) ?? [];
            const Icon = STATUS_ICON[stepStatus] ?? Circle;
            const color = STATUS_COLOR[stepStatus] ?? 'text-muted-foreground';

            return (
              <Card key={(step['id'] as string) ?? idx}>
                <CardHeader className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="font-mono text-sm">
                          {(step['node_id'] as string) ?? (step['nodeId'] as string) ?? ''}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {(step['node_type'] as string) ?? (step['nodeType'] as string) ?? ''}
                        </Badge>
                        <Badge
                          variant={
                            stepStatus === 'completed'
                              ? 'secondary'
                              : stepStatus === 'failed'
                                ? 'destructive'
                                : 'outline'
                          }
                          className="text-xs"
                        >
                          {stepStatus}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        Token: {stepTokenId.slice(0, 8)}
                        {' · '}Entity v{stepEntityVer}
                        {stepDurationMs !== null && <> · {stepDurationMs}ms</>}
                      </CardDescription>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {stepCreatedAt ? new Date(stepCreatedAt).toLocaleTimeString() : ''}
                    </div>
                  </div>
                </CardHeader>
                {stepError && (
                  <CardContent className="pt-0">
                    <p className="text-destructive text-xs">{stepError}</p>
                  </CardContent>
                )}
                {stepEdges.length > 0 && (
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground flex items-center gap-1 text-xs">
                      <GitBranch className="h-3 w-3" />
                      Edges: {stepEdges.join(', ')}
                    </p>
                  </CardContent>
                )}
              </Card>
            );
          })}

          {steps.length === 0 && (
            <div className="text-muted-foreground py-8 text-center">
              No step executions recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
