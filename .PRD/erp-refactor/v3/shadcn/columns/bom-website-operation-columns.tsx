"use client";

// Column definitions for BOM Website Operation
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BomWebsiteOperation } from "../types/bom-website-operation.js";

export const bomWebsiteOperationColumns: ColumnDef<BomWebsiteOperation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "operation",
    header: "Operation",
  },
  {
    accessorKey: "time_in_mins",
    header: "Operation Time",
  },
];