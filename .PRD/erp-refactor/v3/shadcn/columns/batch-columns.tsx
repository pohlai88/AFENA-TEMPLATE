"use client";

// Column definitions for Batch
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { Batch } from "../types/batch.js";

export const batchColumns: ColumnDef<Batch>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "batch_id",
    header: "Batch ID",
  },
  {
    accessorKey: "item_name",
    header: "Item Name",
  },
  {
    accessorKey: "batch_qty",
    header: "Batch Quantity",
  },
];