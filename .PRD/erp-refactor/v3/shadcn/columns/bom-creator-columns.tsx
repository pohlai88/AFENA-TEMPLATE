"use client";

// Column definitions for BOM Creator
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BomCreator } from "../types/bom-creator.js";
import { Badge } from "@/components/ui/badge";

export const bomCreatorColumns: ColumnDef<BomCreator>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "item_code",
    header: "Finished Good",
  },
  {
    accessorKey: "currency",
    header: "Currency",
  },
  {
    accessorKey: "raw_material_cost",
    header: "Total Cost",
    cell: ({ row }) => {
      const val = row.getValue("raw_material_cost") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
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