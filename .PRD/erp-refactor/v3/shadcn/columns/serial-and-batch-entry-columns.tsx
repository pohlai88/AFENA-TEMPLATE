"use client";

// Column definitions for Serial and Batch Entry
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SerialAndBatchEntry } from "../types/serial-and-batch-entry.js";

export const serialAndBatchEntryColumns: ColumnDef<SerialAndBatchEntry>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "serial_no",
    header: "Serial No",
  },
  {
    accessorKey: "batch_no",
    header: "Batch No",
  },
  {
    accessorKey: "qty",
    header: "Qty",
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
];