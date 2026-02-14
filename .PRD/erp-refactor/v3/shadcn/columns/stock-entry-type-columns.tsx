"use client";

// Column definitions for Stock Entry Type
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { StockEntryType } from "../types/stock-entry-type.js";

export const stockEntryTypeColumns: ColumnDef<StockEntryType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "purpose",
    header: "Purpose",
  },
];