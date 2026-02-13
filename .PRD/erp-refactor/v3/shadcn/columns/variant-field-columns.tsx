"use client";

// Column definitions for Variant Field
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { VariantField } from "../types/variant-field.js";

export const variantFieldColumns: ColumnDef<VariantField>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "field_name",
    header: "Field Name",
  },
];