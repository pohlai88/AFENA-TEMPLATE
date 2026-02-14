"use client";

// Column definitions for Supplier Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SupplierItem } from "../types/supplier-item.js";

export const supplierItemColumns: ColumnDef<SupplierItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
];