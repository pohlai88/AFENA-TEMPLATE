"use client";

// Column definitions for POS Closing Entry Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PosClosingEntryDetail } from "../types/pos-closing-entry-detail.js";

export const posClosingEntryDetailColumns: ColumnDef<PosClosingEntryDetail>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "mode_of_payment",
    header: "Mode of Payment",
  },
  {
    accessorKey: "opening_amount",
    header: "Opening Amount",
    cell: ({ row }) => {
      const val = row.getValue("opening_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "expected_amount",
    header: "Expected Amount",
    cell: ({ row }) => {
      const val = row.getValue("expected_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "closing_amount",
    header: "Closing Amount",
    cell: ({ row }) => {
      const val = row.getValue("closing_amount") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
  {
    accessorKey: "difference",
    header: "Difference",
    cell: ({ row }) => {
      const val = row.getValue("difference") as number;
      return val != null ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";
    },
  },
];