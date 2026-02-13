"use client";

// Column definitions for Warehouse Type
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { WarehouseType } from "../types/warehouse-type.js";

export const warehouseTypeColumns: ColumnDef<WarehouseType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];