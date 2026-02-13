"use client";

// Column definitions for Repost Allowed Types
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { RepostAllowedTypes } from "../types/repost-allowed-types.js";

export const repostAllowedTypesColumns: ColumnDef<RepostAllowedTypes>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "document_type",
    header: "Doctype",
  },
  {
    accessorKey: "allowed",
    header: "Allowed",
    cell: ({ row }) => row.getValue("allowed") ? "Yes" : "No",
  },
];