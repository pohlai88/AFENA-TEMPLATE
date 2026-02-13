"use client";

// Column definitions for BOM Update Batch
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BomUpdateBatch } from "../types/bom-update-batch.js";

export const bomUpdateBatchColumns: ColumnDef<BomUpdateBatch>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "level",
    header: "Level",
  },
  {
    accessorKey: "batch_no",
    header: "Batch No.",
  },
  {
    accessorKey: "boms_updated",
    header: "BOMs Updated",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];