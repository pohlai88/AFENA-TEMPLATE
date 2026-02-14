"use client";

// Column definitions for Supplier Group Item
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { SupplierGroupItem } from "../types/supplier-group-item.js";

export const supplierGroupItemColumns: ColumnDef<SupplierGroupItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "supplier_group",
    header: "Supplier Group",
  },
];