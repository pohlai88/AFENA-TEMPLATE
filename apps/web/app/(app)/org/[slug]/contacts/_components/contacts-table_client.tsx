'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from 'afena-ui/components/button';
import { Building2, Plus } from 'lucide-react';

import { DataTable } from '../../_components/crud/client/data-table_client';

import { contactColumns } from './contact-columns';

import type { ContactRow } from './contact-columns';

interface ContactsTableProps {
  data: ContactRow[];
  orgSlug: string;
}

export function ContactsTable({ data, orgSlug }: ContactsTableProps) {
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

  // Add a click-to-navigate name column override
  const columnsWithLink = [
    {
      ...contactColumns[0]!,
      cell: ({ row }: { row: { original: ContactRow } }) => (
        <button
          type="button"
          className="font-medium hover:underline text-left"
          onClick={() => router.push(`/org/${orgSlug}/contacts/${row.original.id}`)}
        >
          {row.original.name}
        </button>
      ),
    },
    ...contactColumns.slice(1),
  ];

  return (
    <DataTable
      columns={columnsWithLink}
      data={data}
      emptyMessage="No contacts found."
    />
  );
}
