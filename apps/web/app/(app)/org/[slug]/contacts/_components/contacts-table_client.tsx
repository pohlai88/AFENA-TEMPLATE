'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from 'afena-ui/components/button';
import { Building2, Plus } from 'lucide-react';

import { DataTable } from '../../_components/crud/client/data-table_client';
import { EntityActionsCell } from '../../_components/crud/client/entity-actions-cell_client';
import { StatusBadge } from '../../_components/crud/client/status-badge';
import { executeContactAction } from '../_server/contacts.server-actions';

import { contactColumns } from './contact-columns';

import type { ContactRow } from './contact-columns';
import type { ColumnDef } from '@tanstack/react-table';
import type { ActionEnvelope, ActionKind, ResolvedActions } from 'afena-canon';

interface ContactsTableProps {
  data: ContactRow[];
  orgSlug: string;
  orgId: string;
  rowActions: Record<string, ResolvedActions>;
}

export function ContactsTable({ data, orgSlug, orgId, rowActions }: ContactsTableProps) {
  const router = useRouter();

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border py-16">
        <Building2 className="h-12 w-12 text-muted-foreground/40" />
        <h3 className="mt-4 text-lg font-medium">No contacts yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first contact to get started.
        </p>
        <Button className="mt-4" size="sm" asChild>
          <Link href={`/org/${orgSlug}/contacts/new`}>
            <Plus className="mr-2 h-4 w-4" />
            New Contact
          </Link>
        </Button>
      </div>
    );
  }

  function handleRowAction(row: ContactRow, kind: ActionKind) {
    if (kind === 'update') {
      router.push(`/org/${orgSlug}/contacts/${row.id}/edit`);
      return;
    }

    const envelope: ActionEnvelope = {
      clientActionId: crypto.randomUUID(),
      orgId,
      entityType: 'contacts',
      entityId: row.id,
      kind,
    };

    void executeContactAction(envelope, { expectedVersion: row.version }).then((result) => {
      if (result.ok) {
        router.refresh();
      }
    });
  }

  const nameCol = contactColumns[0];
  const columnsWithActions: ColumnDef<ContactRow, unknown>[] = [
    ...(nameCol
      ? [
        {
          ...nameCol,
          cell: ({ row }: { row: { original: ContactRow } }) => (
            <button
              type="button"
              className="text-left font-medium hover:underline"
              onClick={() => router.push(`/org/${orgSlug}/contacts/${row.original.id}`)}
            >
              {row.original.name}
            </button>
          ),
        },
      ]
      : []),
    ...contactColumns.slice(1),
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }: { row: { original: ContactRow } }) => (
        <StatusBadge status={row.original.doc_status} />
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }: { row: { original: ContactRow } }) => {
        const actions = rowActions[row.original.id];
        if (!actions) return null;
        return (
          <EntityActionsCell
            actions={actions}
            onAction={(kind) => handleRowAction(row.original, kind)}
          />
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columnsWithActions}
      data={data}
      emptyMessage="No contacts found."
    />
  );
}
