import { notFound, redirect } from 'next/navigation';

import { Button } from 'afenda-ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'afenda-ui/components/card';
import { Input } from 'afenda-ui/components/input';
import { Label } from 'afenda-ui/components/label';
import { Plus } from 'lucide-react';

import { createWorkflowDefinition } from '@/app/actions/workflows';

import { PageHeader } from '@/app/(app)/org/[slug]/_components/crud/client/page-header';
import { getOrgContext } from '@/app/(app)/org/[slug]/_server/org-context_server';

const ENTITY_TYPES = [
  'contacts',
  'companies',
  'sales_invoices',
  'purchase_invoices',
  'sales_orders',
  'purchase_orders',
  'delivery_notes',
  'goods_receipts',
  'payments',
  'quotations',
];

export default async function NewWorkflowDefinitionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ctx = await getOrgContext(slug);
  if (!ctx) notFound();

  async function handleCreate(formData: FormData) {
    'use server';

    const entityType = formData.get('entityType') as string;
    const name = formData.get('name') as string;
    const definitionKind = formData.get('definitionKind') as 'envelope' | 'org_patch' | 'effective';

    if (!entityType || !name) return;

    const result = await createWorkflowDefinition({
      entityType,
      name,
      definitionKind: definitionKind || 'org_patch',
    });

    if (result.ok && result.data) {
      const row = result.data as Record<string, unknown>;
      redirect(`/org/${slug}/settings/workflows/editor/${row['id'] as string}`);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Workflow Definition"
        description="Create a new workflow definition for a document type"
      />

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-base">Definition Details</CardTitle>
          <CardDescription>
            Choose an entity type and name for your workflow definition. Org patches customize the
            default lifecycle envelope for your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entityType">Entity Type</Label>
              <select
                id="entityType"
                name="entityType"
                required
                className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
              >
                <option value="">Select entity type...</option>
                {ENTITY_TYPES.map((et) => (
                  <option key={et} value={et}>
                    {et}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Definition Name</Label>
              <Input id="name" name="name" required placeholder="e.g. Invoice Approval Workflow" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="definitionKind">Kind</Label>
              <select
                id="definitionKind"
                name="definitionKind"
                className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
              >
                <option value="org_patch">Org Patch (customize slots)</option>
                <option value="envelope">Envelope (system lifecycle)</option>
                <option value="effective">Effective (compiled)</option>
              </select>
              <p className="text-muted-foreground text-xs">
                Most workflows should use &quot;Org Patch&quot; to customize body slots within the
                system envelope.
              </p>
            </div>

            <Button type="submit" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Definition
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
