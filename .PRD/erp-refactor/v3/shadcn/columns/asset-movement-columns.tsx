"use client";

// Column definitions for Asset Movement
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AssetMovement } from "../types/asset-movement.js";
import { Badge } from "@/components/ui/badge";

export const assetMovementColumns: ColumnDef<AssetMovement>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "transaction_date",
    header: "Transaction Date",
    cell: ({ row }) => {
      const val = row.getValue("transaction_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
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