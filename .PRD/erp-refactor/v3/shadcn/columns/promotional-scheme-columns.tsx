"use client";

// Column definitions for Promotional Scheme
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PromotionalScheme } from "../types/promotional-scheme.js";

export const promotionalSchemeColumns: ColumnDef<PromotionalScheme>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "apply_on",
    header: "Apply On",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];