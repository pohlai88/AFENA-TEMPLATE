"use client";

// Column definitions for Closed Document
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ClosedDocument } from "../types/closed-document.js";

export const closedDocumentColumns: ColumnDef<ClosedDocument>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "document_type",
    header: "Document Type",
  },
  {
    accessorKey: "closed",
    header: "Closed",
    cell: ({ row }) => row.getValue("closed") ? "Yes" : "No",
  },
];