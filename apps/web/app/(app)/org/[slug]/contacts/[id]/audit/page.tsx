import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from 'afena-ui/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from 'afena-ui/components/card';
import { Separator } from 'afena-ui/components/separator';
import { ArrowLeft, Clock, FileText, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';

import { getContact, getContactAuditLogs } from '@/app/actions/contacts';

interface AuditLogEntry {
  id: string;
  actionType: string;
  actionFamily: string;
  actorUserId: string;
  versionBefore: number | null;
  versionAfter: number;
  channel: string;
  reason: string | null;
  createdAt: string;
  diff: unknown;
  before: unknown;
  after: unknown;
}

const VERB_ICONS: Record<string, typeof Plus> = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  restore: RotateCcw,
};

const VERB_LABELS: Record<string, string> = {
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
  restore: 'Restored',
};

const VERB_COLORS: Record<string, string> = {
  create: 'bg-green-500/10 text-green-700 dark:text-green-400',
  update: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  delete: 'bg-red-500/10 text-red-700 dark:text-red-400',
  restore: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
};

function extractVerb(actionType: string): string {
  const lastDot = actionType.lastIndexOf('.');
  return lastDot === -1 ? actionType : actionType.slice(lastDot + 1);
}

export default async function ContactAuditPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;

  const [contactRes, auditRes] = await Promise.all([
    getContact(id),
    getContactAuditLogs(id),
  ]);

  if (!contactRes.ok) {
    notFound();
  }

  const contact = contactRes.data as { name: string };
  const logs: AuditLogEntry[] = auditRes.ok ? (auditRes.data as AuditLogEntry[]) : [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {/* Back link */}
      <Link
        href={`/org/${slug}/contacts/${id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {contact.name}
      </Link>

      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Audit Trail</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete history of changes to {contact.name}
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Error state */}
      {!auditRes.ok && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              Failed to load audit logs: {auditRes.error?.message ?? 'Unknown error'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {auditRes.ok && logs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Clock className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-medium">No audit entries</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Changes will be recorded here automatically.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      {logs.length > 0 && (
        <div className="space-y-4">
          {logs.map((log) => {
            const verb = extractVerb(log.actionType);
            const Icon = VERB_ICONS[verb] ?? FileText;
            const label = VERB_LABELS[verb] ?? verb;
            const colorClass = VERB_COLORS[verb] ?? 'bg-muted text-muted-foreground';

            return (
              <Card key={log.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">{label}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {log.versionBefore !== null && (
                        <Badge variant="outline" className="text-xs">
                          v{log.versionBefore} → v{log.versionAfter}
                        </Badge>
                      )}
                      {log.versionBefore === null && (
                        <Badge variant="outline" className="text-xs">
                          v{log.versionAfter}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {log.channel}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                {/* Show diff for updates */}
                {verb === 'update' && log.diff != null && (
                  <CardContent className="pt-0">
                    <div className="rounded-md bg-muted/50 p-3">
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Changes</p>
                      <pre className="text-xs leading-relaxed">
                        {JSON.stringify(log.diff, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                )}

                {/* Show reason if provided */}
                {log.reason && (
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Reason:</span> {String(log.reason)}
                    </p>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
