import { notFound } from 'next/navigation';

import { Badge } from 'afenda-ui/components/badge';
import { Button } from 'afenda-ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'afenda-ui/components/card';
import { CheckCircle2, Clock, FileText, XCircle } from 'lucide-react';

import { PageHeader } from '@/app/(app)/org/[slug]/_components/crud/client/page-header';
import { getOrgContext } from '@/app/(app)/org/[slug]/_server/org-context_server';

export default async function ApprovalsInboxPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ctx = await getOrgContext(slug);

  if (!ctx) notFound();

  // Approval inbox is a placeholder — actual data requires auth context
  // to resolve the current user's pending approvals.
  // The fetchPendingApprovals(actorUserId) server action is ready.

  return (
    <div className="space-y-6">
      <PageHeader title="Approval Inbox" description="Pending approval tasks assigned to you" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="text-muted-foreground h-4 w-4" />
            Pending Approvals
          </CardTitle>
          <CardDescription>Documents waiting for your review and decision</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-8 text-center">
            <FileText className="mx-auto mb-3 h-8 w-8" />
            <p className="text-sm">No pending approvals at this time.</p>
            <p className="mt-1 text-xs">
              When documents require your approval, they will appear here.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Approval actions legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Available Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Button size="sm" variant="default" disabled className="pointer-events-none">
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              Approve
            </Button>
            <span className="text-muted-foreground text-xs">
              Accept the document at its current version
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="destructive" disabled className="pointer-events-none">
              <XCircle className="mr-1.5 h-3.5 w-3.5" />
              Reject
            </Button>
            <span className="text-muted-foreground text-xs">
              Reject and return to the requester with a reason
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              Version-Pinned (WF-03)
            </Badge>
            <span className="text-muted-foreground text-xs">
              Decisions are bound to the exact document version shown
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
