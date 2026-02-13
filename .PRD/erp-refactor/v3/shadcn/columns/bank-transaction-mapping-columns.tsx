"use client";

// Column definitions for Bank Transaction Mapping
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BankTransactionMapping } from "../types/bank-transaction-mapping.js";

export const bankTransactionMappingColumns: ColumnDef<BankTransactionMapping>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "bank_transaction_field",
    header: "Field in Bank Transaction",
  },
  {
    accessorKey: "file_field",
    header: "Column in Bank File",
  },
];