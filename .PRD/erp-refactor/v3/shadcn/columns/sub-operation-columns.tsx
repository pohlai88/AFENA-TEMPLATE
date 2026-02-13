"use client";

// Column definitions for Sub Operation
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SubOperation } from "../types/sub-operation.js";

export const subOperationColumns: ColumnDef<SubOperation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "operation",
    header: "Operation",
  },
  {
    accessorKey: "time_in_mins",
    header: "Operation Time",
  },
];