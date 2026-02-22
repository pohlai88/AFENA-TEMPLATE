import Link from 'next/link';
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
import { AlertTriangle, CheckCircle2, Edit, FileText, GitBranch, Hash, Layers } from 'lucide-react';

import { PageHeader } from '@/app/(app)/org/[slug]/_components/crud/client/page-header';
import { getOrgContext } from '@/app/(app)/org/[slug]/_server/org-context_server';
import {
  fetchDefinitionVersions,
  fetchWorkflowDefinition,
} from '@/app/(app)/org/[slug]/settings/workflows/_server/workflows.query_server';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'outline',
  published: 'default',
  archived: 'secondary',
};

export default async function WorkflowDefinitionDetailPage({
  params,
}: {
  params: Promise<{ slug: string; definitionId: string }>;
}) {
  const { slug, definitionId } = await params;
  const ctx = await getOrgContext(slug);
  if (!ctx) notFound();

  const definition = await fetchWorkflowDefinition(definitionId);
  if (!definition) notFound();

  const defRow = definition as Record<string, unknown>;
  const name = typeof defRow['name'] === 'string' ? defRow['name'] : 'Untitled';
  const version = Number(defRow['version'] ?? 1);
  const status = typeof defRow['status'] === 'string' ? defRow['status'] : 'draft';
  const entityType =
    typeof defRow['entity_type'] === 'string'
      ? defRow['entity_type']
      : typeof defRow['entityType'] === 'string'
        ? defRow['entityType']
        : '';
  const definitionKind =
    typeof defRow['definition_kind'] === 'string'
      ? defRow['definition_kind']
      : typeof defRow['definitionKind'] === 'string'
        ? defRow['definitionKind']
        : '';
  const isDefault = Boolean(defRow['is_default'] ?? defRow['isDefault']);
  const compiledHash =
    typeof defRow['compiled_hash'] === 'string'
      ? defRow['compiled_hash']
      : typeof defRow['compiledHash'] === 'string'
        ? defRow['compiledHash']
        : null;
  const compilerVersion =
    typeof defRow['compiler_version'] === 'string'
      ? defRow['compiler_version']
      : typeof defRow['compilerVersion'] === 'string'
        ? defRow['compilerVersion']
        : null;
  const nodesJson = (defRow['nodes_json'] ?? defRow['nodesJson'] ?? []) as unknown[];
  const edgesJson = (defRow['edges_json'] ?? defRow['edgesJson'] ?? []) as unknown[];
  const slotsJson = (defRow['slots_json'] ?? defRow['slotsJson'] ?? []) as unknown[];

  const versions = await fetchDefinitionVersions(entityType, name);

  return (
    <div className="space-y-6">
      <PageHeader title={name} description={`${entityType} · ${definitionKind} · v${version}`}>
        <div className="flex gap-2">
          <Button size="sm" asChild>
            <Link href={`/org/${slug}/settings/workflows/editor/${definitionId}`}>
              <Edit className="mr-2 h-4 w-4" />
              {status === 'draft' ? 'Edit' : 'View'} in Editor
            </Link>
          </Button>
        </div>
      </PageHeader>

      {/* Status + metadata */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Status</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Badge variant={STATUS_VARIANT[status] ?? 'outline'} className="text-sm">
              {status}
            </Badge>
            {isDefault && <Badge variant="secondary">Default</Badge>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Compiled</CardDescription>
          </CardHeader>
          <CardContent>
            {compiledHash ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="font-mono text-xs">{compiledHash.slice(0, 16)}...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-muted-foreground text-sm">Not compiled</span>
              </div>
            )}
            {compilerVersion && (
              <p className="text-muted-foreground mt-1 text-xs">Compiler: {compilerVersion}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Graph</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Layers className="text-muted-foreground h-3.5 w-3.5" />
              {nodesJson.length} nodes
            </span>
            <span className="flex items-center gap-1">
              <GitBranch className="text-muted-foreground h-3.5 w-3.5" />
              {edgesJson.length} edges
            </span>
            <span className="flex items-center gap-1">
              <Hash className="text-muted-foreground h-3.5 w-3.5" />
              {slotsJson.length} slots
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Node list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nodes</CardTitle>
          <CardDescription>All nodes in this workflow definition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {(nodesJson as Array<Record<string, unknown>>).map((node) => {
              const nodeId = typeof node['id'] === 'string' ? node['id'] : '';
              const nodeType = typeof node['type'] === 'string' ? node['type'] : '';
              const label = typeof node['label'] === 'string' ? node['label'] : nodeType;
              const isSystem = nodeId.startsWith('sys:');

              return (
                <div
                  key={nodeId}
                  className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm"
                >
                  <Badge variant={isSystem ? 'secondary' : 'outline'} className="text-[10px]">
                    {nodeType}
                  </Badge>
                  <span className="font-medium">{label}</span>
                  <span className="text-muted-foreground font-mono text-xs">{nodeId}</span>
                </div>
              );
            })}
            {nodesJson.length === 0 && (
              <p className="text-muted-foreground py-4 text-center text-sm">
                No nodes defined yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Version history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Version History</CardTitle>
          <CardDescription>All versions of this workflow definition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {versions.map((v) => (
              <Link
                key={`${v.id}-${String(v.version)}`}
                href={`/org/${slug}/settings/workflows/${v.id}`}
                className="hover:bg-accent flex items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors"
              >
                <FileText className="text-muted-foreground h-4 w-4" />
                <span className="font-medium">v{v.version}</span>
                <Badge variant={STATUS_VARIANT[v.status] ?? 'outline'} className="text-[10px]">
                  {v.status}
                </Badge>
                {v.compiledHash && (
                  <span className="text-muted-foreground font-mono text-[10px]">
                    {v.compiledHash.slice(0, 12)}
                  </span>
                )}
                <span className="text-muted-foreground ml-auto text-xs">
                  {new Date(v.updatedAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
