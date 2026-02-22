import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from 'afenda-ui/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from 'afenda-ui/components/card';
import { Separator } from 'afenda-ui/components/separator';
import { ArrowLeft, Clock, GitBranch } from 'lucide-react';

import { getContact, getContactVersions } from '@/app/actions/contacts';

import { getOrgContext } from '@/app/(app)/org/[slug]/_server/org-context_server';
import { RevertButton } from '@/app/(app)/org/[slug]/contacts/_components/revert-button_client';

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

  const [contactRes, versionsRes, ctx] = await Promise.all([
    getContact(id),
    getContactVersions(id),
    getOrgContext(slug),
  ]);

  if (!contactRes.ok || !ctx) {
    notFound();
  }

  const contact = contactRes.data as { name: string; version: number };
  const versions: EntityVersion[] = versionsRes.ok ? (versionsRes.data as EntityVersion[]) : [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {/* Back link */}
      <Link
        href={`/org/${slug}/contacts/${id}`}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {contact.name}
      </Link>

      <div className="flex items-center gap-3">
        <GitBranch className="text-muted-foreground h-6 w-6" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Version History</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {contact.name} — currently at v{contact.version}
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Error state */}
      {!versionsRes.ok && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">
              Failed to load versions: {versionsRes.error?.message ?? 'Unknown error'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {versionsRes.ok && versions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Clock className="text-muted-foreground/40 h-12 w-12" />
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
                      <CardTitle className="text-sm font-medium">Version {ver.version}</CardTitle>
                      {isCurrent && (
                        <Badge variant="default" className="text-xs">
                          Current
                        </Badge>
                      )}
                      {ver.parentVersion != null && (
                        <span className="text-muted-foreground text-xs">
                          from v{ver.parentVersion}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
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
                          orgId={ctx.org.id}
                        />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-muted/50 rounded-md p-3">
                    <p className="text-muted-foreground mb-1 text-xs font-medium">Snapshot</p>
                    <div className="grid gap-1 text-sm">
                      {Object.entries(snapshot)
                        .filter(
                          ([key]) =>
                            ![
                              'id',
                              'org_id',
                              'created_by',
                              'updated_by',
                              'created_at',
                              'updated_at',
                              'version',
                              'is_deleted',
                              'deleted_at',
                              'deleted_by',
                            ].includes(key),
                        )
                        .map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <span className="text-muted-foreground font-mono text-xs">{key}:</span>
                            <span className="text-xs">
                              {value != null ? `${value as string | number | boolean}` : '—'}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Show diff if available */}
                  {ver.diff != null && (
                    <div className="bg-muted/50 mt-3 rounded-md p-3">
                      <p className="text-muted-foreground mb-1 text-xs font-medium">
                        Changes (JSON Patch)
                      </p>
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
