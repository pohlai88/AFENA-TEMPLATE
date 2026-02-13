"use client";

// Column definitions for Workstation Operating Component Account
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { WorkstationOperatingComponentAccount } from "../types/workstation-operating-component-account.js";

export const workstationOperatingComponentAccountColumns: ColumnDef<WorkstationOperatingComponentAccount>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "expense_account",
    header: "Expense Account",
  },
];