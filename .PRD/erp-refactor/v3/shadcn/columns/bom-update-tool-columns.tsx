"use client";

// Column definitions for BOM Update Tool
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { BomUpdateTool } from "../types/bom-update-tool.js";

export const bomUpdateToolColumns: ColumnDef<BomUpdateTool>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "current_bom",
    header: "Current BOM",
  },
  {
    accessorKey: "new_bom",
    header: "New BOM",
  },
];