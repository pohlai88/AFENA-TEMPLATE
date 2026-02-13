"use client";

// Column definitions for POS Profile
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PosProfile } from "../types/pos-profile.js";

export const posProfileColumns: ColumnDef<PosProfile>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];