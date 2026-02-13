"use client";

// Column definitions for Accounting Dimension
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AccountingDimension } from "../types/accounting-dimension.js";

export const accountingDimensionColumns: ColumnDef<AccountingDimension>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "label",
    header: "Dimension Name",
  },
];