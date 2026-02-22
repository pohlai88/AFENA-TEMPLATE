'use client';

import { Badge } from 'afenda-ui/components/badge';
import { Button } from 'afenda-ui/components/button';
import { ArrowUpDown } from 'lucide-react';

import type { Column, ColumnDef } from '@tanstack/react-table';

/**
 * Entity column helpers — reusable column definition factories
 * for sortable headers, date formatting, badge rendering, and status display.
 */

export function sortableHeader<T>(column: Column<T>, label: string) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function dateColumn<T>(
  accessorKey: string,
  header: string,
): ColumnDef<T> {
  return {
    accessorKey,
    header: ({ column }) => sortableHeader(column, header),
    cell: ({ row }) => {
      const value = row.getValue<string>(accessorKey);
      if (!value) return <span className="text-muted-foreground">—</span>;
      return new Date(value).toLocaleDateString();
    },
  };
}

export function badgeColumn<T>(
  accessorKey: string,
  header: string,
  variantMap?: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'>,
): ColumnDef<T> {
  return {
    accessorKey,
    header,
    cell: ({ row }) => {
      const value = row.getValue<string>(accessorKey);
      if (!value) return null;
      const variant = variantMap?.[value] ?? 'outline';
      return <Badge variant={variant}>{value}</Badge>;
    },
  };
}

export function textColumn<T>(
  accessorKey: string,
  header: string,
): ColumnDef<T> {
  return {
    accessorKey,
    header: ({ column }) => sortableHeader(column, header),
    cell: ({ row }) => {
      const value = row.getValue<string>(accessorKey);
      return value ?? <span className="text-muted-foreground">—</span>;
    },
  };
}
