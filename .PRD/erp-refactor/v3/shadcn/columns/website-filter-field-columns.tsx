"use client";

// Column definitions for Website Filter Field
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { WebsiteFilterField } from "../types/website-filter-field.js";

export const websiteFilterFieldColumns: ColumnDef<WebsiteFilterField>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "fieldname",
    header: "Fieldname",
  },
];