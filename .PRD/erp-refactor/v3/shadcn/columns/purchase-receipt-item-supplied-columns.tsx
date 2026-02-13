"use client";

// Column definitions for Purchase Receipt Item Supplied
// Generated from Canon schema — do not edit manually

import type { ColumnDef } from "@tanstack/react-table";
import type { PurchaseReceiptItemSupplied } from "../types/purchase-receipt-item-supplied.js";

export const purchaseReceiptItemSuppliedColumns: ColumnDef<PurchaseReceiptItemSupplied>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "main_item_code",
    header: "Item Code",
  },
  {
    accessorKey: "rm_item_code",
    header: "Raw Material Item Code",
  },
  {
    accessorKey: "bom_detail_no",
    header: "BOM Detail No",
  },
  {
    accessorKey: "reference_name",
    header: "Reference Name",
  },
  {
    accessorKey: "required_qty",
    header: "Available Qty For Consumption",
  },
  {
    accessorKey: "consumed_qty",
    header: "Qty to Be Consumed",
  },
  {
    accessorKey: "current_stock",
    header: "Current Stock",
  },
];