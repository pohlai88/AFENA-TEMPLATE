"use client";

// Column definitions for Allowed To Transact With
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { AllowedToTransactWith } from "../types/allowed-to-transact-with.js";

export const allowedToTransactWithColumns: ColumnDef<AllowedToTransactWith>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];