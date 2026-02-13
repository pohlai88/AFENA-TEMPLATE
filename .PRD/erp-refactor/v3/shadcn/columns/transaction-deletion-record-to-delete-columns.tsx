"use client";

// Column definitions for Transaction Deletion Record To Delete
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { TransactionDeletionRecordToDelete } from "../types/transaction-deletion-record-to-delete.js";

export const transactionDeletionRecordToDeleteColumns: ColumnDef<TransactionDeletionRecordToDelete>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "doctype_name",
    header: "DocType",
  },
  {
    accessorKey: "company_field",
    header: "Company Field",
  },
  {
    accessorKey: "document_count",
    header: "Document Count",
  },
  {
    accessorKey: "child_doctypes",
    header: "Child DocTypes",
  },
  {
    accessorKey: "deleted",
    header: "Deleted",
    cell: ({ row }) => row.getValue("deleted") ? "Yes" : "No",
  },
];