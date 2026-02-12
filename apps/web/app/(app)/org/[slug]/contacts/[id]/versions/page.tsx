import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from 'afena-ui/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from 'afena-ui/components/card';
import { Separator } from 'afena-ui/components/separator';
import { ArrowLeft, Clock, GitBranch } from 'lucide-react';

import { getContact, getContactVersions } from '@/app/actions/contacts';

import { RevertButton } from '../../_components/revert-button';

interface EntityVersion {
  id: string;
  version: number;
  parentVersion: number | null;
  snapshot: Record<string, unknown>;
  diff: unknown;
  createdAt: string;
  createdBy: string;
}

export default async function ContactVersionsPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;

  const [contactRes, versionsRes] = await Promise.all([
    getContact(id),
    getContactVersions(id),
  ]);

  if (!contactRes.ok) {
    notFound();
  }

  const contact = contactRes.data as { name: string; version: number };
  const versions: EntityVersion[] = versionsRes.ok ? (versionsRes.data as EntityVersion[]) : [];

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
        <GitBranch className="h-6 w-6 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Version History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {contact.name} — currently at v{contact.version}
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Error state */}
      {!versionsRes.ok && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              Failed to load versions: {versionsRes.error?.message ?? 'Unknown error'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {versionsRes.ok && versions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Clock className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-medium">No versions recorded</h3>
          </CardContent>
        </Card>
      )}

      {/* Version list */}
      {versions.length > 0 && (
        <div className="space-y-4">
          {versions.map((ver) => {
            const isCurrent = ver.version === contact.version;
            const snapshot = ver.snapshot;

            return (
              <Card key={ver.id} className={isCurrent ? 'border-primary/50' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-medium">
                        Version {ver.version}
                      </CardTitle>
                      {isCurrent && (
                        <Badge variant="default" className="text-xs">Current</Badge>
                      )}
                      {ver.parentVersion != null && (
                        <span className="text-xs text-muted-foreground">
                          from v{ver.parentVersion}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(ver.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {!isCurrent && (
                        <RevertButton
                          contactId={id}
                          contactName={contact.name}
                          targetVersion={ver.version}
                          currentVersion={contact.version}
                          snapshot={snapshot}
                          orgSlug={slug}
                        />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="rounded-md bg-muted/50 p-3">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Snapshot</p>
                    <div className="grid gap-1 text-sm">
                      {Object.entries(snapshot)
                        .filter(([key]) => !['id', 'org_id', 'created_by', 'updated_by', 'created_at', 'updated_at', 'version', 'is_deleted', 'deleted_at', 'deleted_by'].includes(key))
                        .map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <span className="font-mono text-xs text-muted-foreground">{key}:</span>
                            <span className="text-xs">{value != null ? `${value as string | number | boolean}` : '—'}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Show diff if available */}
                  {ver.diff != null && (
                    <div className="mt-3 rounded-md bg-muted/50 p-3">
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Changes (JSON Patch)</p>
                      <pre className="text-xs leading-relaxed">
                        {JSON.stringify(ver.diff, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
