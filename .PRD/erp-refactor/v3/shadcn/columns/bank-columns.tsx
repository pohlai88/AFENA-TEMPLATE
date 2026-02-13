"use client";

// Column definitions for Bank
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Bank } from "../types/bank.js";

export const bankColumns: ColumnDef<Bank>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "swift_number",
    header: "SWIFT number",
  },
];