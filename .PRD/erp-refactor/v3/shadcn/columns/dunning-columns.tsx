"use client";

// Column definitions for Dunning
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Dunning } from "../types/dunning.js";
import { Badge } from "@/components/ui/badge";

export const dunningColumns: ColumnDef<Dunning>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "customer_name",
    header: "Customer Name",
  },
  {
    accessorKey: "dunning_type",
    header: "Dunning Type",
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