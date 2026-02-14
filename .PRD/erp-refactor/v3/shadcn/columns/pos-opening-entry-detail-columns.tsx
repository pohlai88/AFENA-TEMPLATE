"use client";

// Column definitions for POS Opening Entry Detail
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PosOpeningEntryDetail } from "../types/pos-opening-entry-detail.js";

export const posOpeningEntryDetailColumns: ColumnDef<PosOpeningEntryDetail>[] = [
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
];