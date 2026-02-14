"use client";

// Column definitions for Process Statement Of Accounts CC
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ProcessStatementOfAccountsCc } from "../types/process-statement-of-accounts-cc.js";

export const processStatementOfAccountsCcColumns: ColumnDef<ProcessStatementOfAccountsCc>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "cc",
    header: "CC",
  },
];