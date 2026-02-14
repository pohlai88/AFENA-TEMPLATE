"use client";

// Column definitions for Subcontracting BOM
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SubcontractingBom } from "../types/subcontracting-bom.js";

export const subcontractingBomColumns: ColumnDef<SubcontractingBom>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "is_active",
    header: "Is Active",
    cell: ({ row }) => row.getValue("is_active") ? "Yes" : "No",
  },
  {
    accessorKey: "finished_good",
    header: "Finished Good",
  },
  {
    accessorKey: "finished_good_bom",
    header: "Finished Good BOM",
  },
  {
    accessorKey: "service_item",
    header: "Service Item",
  },
];