"use client";

// Column definitions for BOM
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Bom } from "../types/bom.js";
import { Badge } from "@/components/ui/badge";

export const bomColumns: ColumnDef<Bom>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item",
    header: "Item",
  },
  {
    accessorKey: "is_active",
    header: "Is Active",
    cell: ({ row }) => row.getValue("is_active") ? "Yes" : "No",
  },
  {
    accessorKey: "is_default",
    header: "Is Default",
    cell: ({ row }) => row.getValue("is_default") ? "Yes" : "No",
  },
  {
    accessorKey: "total_cost",
    header: "Total Cost",
    cell: ({ row }) => {
      const val = row.getValue("total_cost") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "has_variants",
    header: "Has Variants",
    cell: ({ row }) => row.getValue("has_variants") ? "Yes" : "No",
  },
  {
    id: "docstatus",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original as any).docstatus;
      return (
        <Badge variant={status === 1 ? "default" : "secondary"}>
          {status === 0 ? "Draft" : status === 1 ? "Submitted" : "Cancelled"}
        </Badge>
      );
    },
  },
];