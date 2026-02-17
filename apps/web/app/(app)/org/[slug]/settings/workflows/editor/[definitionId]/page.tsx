import { notFound } from 'next/navigation';

import { Card, CardContent } from 'afenda-ui/components/card';
import { GitBranch } from 'lucide-react';

import { PageHeader } from '@/app/(app)/org/[slug]/_components/crud/client/page-header';
import { getOrgContext } from '@/app/(app)/org/[slug]/_server/org-context_server';
import {
  fetchDefinitionVersions,
  fetchWorkflowDefinition,
} from '@/app/(app)/org/[slug]/settings/workflows/_server/workflows.query_server';

import { EditorShell } from './editor-shell';

export default async function WorkflowEditorPage({
  params,
}: {
  params: Promise<{ slug: string; definitionId: string }>;
}) {
  const { slug, definitionId } = await params;
  const ctx = await getOrgContext(slug);
  if (!ctx) notFound();

  const definition = await fetchWorkflowDefinition(definitionId);
  if (!definition) {
    return (
      <div className="space-y-6">
        <PageHeader title="Workflow Editor" description="Definition not found" />
        <Card>
          <CardContent className="text-muted-foreground py-8 text-center">
            The workflow definition could not be loaded.
          </CardContent>
        </Card>
      </div>
    );
  }

  const defRow = definition as Record<string, unknown>;
  const name = typeof defRow['name'] === 'string' ? defRow['name'] : 'Untitled';
  const version = Number(defRow['version'] ?? 1);
  const rawStatus = typeof defRow['status'] === 'string' ? defRow['status'] : 'draft';
  const status = rawStatus as 'draft' | 'published' | 'archived';
  const entityType =
    typeof defRow['entity_type'] === 'string'
      ? defRow['entity_type']
      : typeof defRow['entityType'] === 'string'
        ? defRow['entityType']
        : '';
  const nodesJson = (defRow['nodes_json'] ?? defRow['nodesJson'] ?? []) as unknown[];
  const edgesJson = (defRow['edges_json'] ?? defRow['edgesJson'] ?? []) as unknown[];
  const slotsJson = (defRow['slots_json'] ?? defRow['slotsJson'] ?? []) as unknown[];

  const versionRows = await fetchDefinitionVersions(entityType, name);
  const versions = versionRows.map((v) => ({
    id: v.id,
    version: v.version,
    status: v.status as 'draft' | 'published' | 'archived',
    name: v.name,
    compiledHash: v.compiledHash,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
  }));

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="shrink-0 border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <GitBranch className="text-muted-foreground h-5 w-5" />
          <div>
            <h1 className="text-sm font-semibold">{name}</h1>
            <p className="text-muted-foreground text-xs">
              {entityType} · v{version} · {status}
            </p>
          </div>
        </div>
      </div>

      <EditorShell
        definitionId={definitionId}
        name={name}
        entityType={entityType}
        version={version}
        status={status}
        nodesJson={nodesJson}
        edgesJson={edgesJson}
        slotsJson={slotsJson}
        versions={versions}
      />
    </div>
  );
}
