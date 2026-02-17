import { notFound } from 'next/navigation';

import { Badge } from 'afenda-ui/components/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'afenda-ui/components/card';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Inbox,
  Loader2,
  XCircle,
} from 'lucide-react';

import { PageHeader } from '@/app/(app)/org/[slug]/_components/crud/client/page-header';
import { getOrgContext } from '@/app/(app)/org/[slug]/_server/org-context_server';
import { fetchHealthStats } from '@/app/(app)/org/[slug]/settings/workflows/_server/workflows.query_server';

export default async function WorkflowHealthPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [health, ctx] = await Promise.all([fetchHealthStats(), getOrgContext(slug)]);

  if (!ctx) notFound();

  if (!health) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Workflow Health"
          description="Monitor workflow engine health and outbox status"
        />
        <div className="text-muted-foreground py-12 text-center">
          Unable to load health stats. The workflow tables may not be initialized.
        </div>
      </div>
    );
  }

  const hasIssues =
    health.failedOutbox > 0 || health.deadLetterOutbox > 0 || health.stuckInstances > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflow Health"
        description="Monitor workflow engine health and outbox status"
      >
        <Badge variant={hasIssues ? 'destructive' : 'default'} className="text-sm">
          {hasIssues ? 'Issues Detected' : 'Healthy'}
        </Badge>
      </PageHeader>

      {/* Engine Outbox */}
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">Engine Event Outbox</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <Inbox className="h-3.5 w-3.5" />
                Pending
              </CardDescription>
              <CardTitle className="text-3xl">{health.pendingOutbox}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">Events waiting to be processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5" />
                Processing
              </CardDescription>
              <CardTitle className="text-3xl">{health.processingOutbox}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">Currently being processed by workers</p>
            </CardContent>
          </Card>

          <Card className={health.failedOutbox > 0 ? 'border-destructive/50' : ''}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5" />
                Failed
              </CardDescription>
              <CardTitle
                className={`text-3xl ${health.failedOutbox > 0 ? 'text-destructive' : ''}`}
              >
                {health.failedOutbox}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">
                Will be retried with exponential backoff
              </p>
            </CardContent>
          </Card>

          <Card className={health.deadLetterOutbox > 0 ? 'border-destructive/50' : ''}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Dead Letter
              </CardDescription>
              <CardTitle
                className={`text-3xl ${health.deadLetterOutbox > 0 ? 'text-destructive' : ''}`}
              >
                {health.deadLetterOutbox}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">
                Exhausted retries — requires admin intervention
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Side Effects */}
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">Side Effects Outbox</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                Pending Side Effects
              </CardDescription>
              <CardTitle className="text-3xl">{health.pendingSideEffects}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">
                Webhooks, emails, notifications waiting for IO worker
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Oldest Pending Age
              </CardDescription>
              <CardTitle className="text-xl">{health.oldestPendingAge ?? 'N/A'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">
                Time since oldest pending event was created
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stuck Instances */}
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">Instance Health</h3>
        <Card className={health.stuckInstances > 0 ? 'border-orange-500/50' : ''}>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Stuck Instances
            </CardDescription>
            <CardTitle className={`text-3xl ${health.stuckInstances > 0 ? 'text-orange-500' : ''}`}>
              {health.stuckInstances}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">
              Running instances with no pending outbox events and no activity for 30+ minutes. May
              need projection rebuild or manual re-enqueue.
            </p>
            {health.stuckInstances === 0 && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-green-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                All instances progressing normally
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
