"use client";

// Column definitions for Inventory Dimension
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { InventoryDimension } from "../types/inventory-dimension.js";

export const inventoryDimensionColumns: ColumnDef<InventoryDimension>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "dimension_name",
    header: "Dimension Name",
  },
  {
    accessorKey: "reference_document",
    header: "Reference Document",
  },
];