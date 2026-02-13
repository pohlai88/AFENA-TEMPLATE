"use client";

// Column definitions for Transaction Deletion Record Details
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TransactionDeletionRecordDetails } from "../types/transaction-deletion-record-details.js";

export const transactionDeletionRecordDetailsColumns: ColumnDef<TransactionDeletionRecordDetails>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "doctype_name",
    header: "DocType",
  },
  {
    accessorKey: "no_of_docs",
    header: "No of Docs",
  },
  {
    accessorKey: "done",
    header: "Done",
    cell: ({ row }) => row.getValue("done") ? "Yes" : "No",
  },
];