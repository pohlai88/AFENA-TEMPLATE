"use client";

// Column definitions for POS Field
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PosField } from "../types/pos-field.js";

export const posFieldColumns: ColumnDef<PosField>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "fieldname",
    header: "Fieldname",
  },
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "fieldtype",
    header: "Fieldtype",
  },
  {
    accessorKey: "options",
    header: "Options",
  },
];