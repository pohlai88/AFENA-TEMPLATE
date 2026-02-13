"use client";

// Column definitions for Shareholder
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Shareholder } from "../types/shareholder.js";

export const shareholderColumns: ColumnDef<Shareholder>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];