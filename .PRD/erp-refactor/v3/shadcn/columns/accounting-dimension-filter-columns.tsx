"use client";

// Column definitions for Accounting Dimension Filter
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AccountingDimensionFilter } from "../types/accounting-dimension-filter.js";

export const accountingDimensionFilterColumns: ColumnDef<AccountingDimensionFilter>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "accounting_dimension",
    header: "Accounting Dimension",
  },
];