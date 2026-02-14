"use client";

// Column definitions for Loyalty Program
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { LoyaltyProgram } from "../types/loyalty-program.js";

export const loyaltyProgramColumns: ColumnDef<LoyaltyProgram>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "loyalty_program_name",
    header: "Loyalty Program Name",
  },
];