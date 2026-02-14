"use client";

// Column definitions for Industry Type
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { IndustryType } from "../types/industry-type.js";

export const industryTypeColumns: ColumnDef<IndustryType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "industry",
    header: "Industry",
  },
];