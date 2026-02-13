"use client";

// Column definitions for POS Search Fields
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PosSearchFields } from "../types/pos-search-fields.js";

export const posSearchFieldsColumns: ColumnDef<PosSearchFields>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "field",
    header: "Field",
  },
];