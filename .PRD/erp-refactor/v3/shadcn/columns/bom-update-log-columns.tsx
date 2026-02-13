"use client";

// Column definitions for BOM Update Log
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BomUpdateLog } from "../types/bom-update-log.js";
import { Badge } from "@/components/ui/badge";

export const bomUpdateLogColumns: ColumnDef<BomUpdateLog>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "update_type",
    header: "Update Type",
  },
  {
    accessorKey: "current_bom",
    header: "Current BOM",
  },
  {
    accessorKey: "new_bom",
    header: "New BOM",
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