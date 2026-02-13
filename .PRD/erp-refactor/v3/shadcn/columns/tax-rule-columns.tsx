"use client";

// Column definitions for Tax Rule
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TaxRule } from "../types/tax-rule.js";

export const taxRuleColumns: ColumnDef<TaxRule>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "tax_type",
    header: "Tax Type",
  },
];