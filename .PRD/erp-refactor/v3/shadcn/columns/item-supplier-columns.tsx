"use client";

// Column definitions for Item Supplier
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { ItemSupplier } from "../types/item-supplier.js";

export const itemSupplierColumns: ColumnDef<ItemSupplier>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "supplier_part_no",
    header: "Supplier Part Number",
  },
];