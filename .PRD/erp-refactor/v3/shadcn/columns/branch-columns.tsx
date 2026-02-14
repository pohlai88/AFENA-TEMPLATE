"use client";

// Column definitions for Branch
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Branch } from "../types/branch.js";

export const branchColumns: ColumnDef<Branch>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
];