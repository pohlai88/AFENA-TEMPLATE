"use client";

// Column definitions for Transaction Deletion Record Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TransactionDeletionRecordItem } from "../types/transaction-deletion-record-item.js";

export const transactionDeletionRecordItemColumns: ColumnDef<TransactionDeletionRecordItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "doctype_name",
    header: "DocType",
  },
];