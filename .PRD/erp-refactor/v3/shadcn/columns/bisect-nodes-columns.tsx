"use client";

// Column definitions for Bisect Nodes
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BisectNodes } from "../types/bisect-nodes.js";

export const bisectNodesColumns: ColumnDef<BisectNodes>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "root",
    header: "Root",
  },
  {
    accessorKey: "left_child",
    header: "Left Child",
  },
  {
    accessorKey: "right_child",
    header: "Right Child",
  },
  {
    accessorKey: "period_from_date",
    header: "Period_from_date",
    cell: ({ row }) => {
      const val = row.getValue("period_from_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
  {
    accessorKey: "period_to_date",
    header: "Period To Date",
    cell: ({ row }) => {
      const val = row.getValue("period_to_date") as string;
      return val ? new Date(val).toLocaleDateString() : "";
    },
  },
];